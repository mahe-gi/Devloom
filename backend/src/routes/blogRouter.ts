import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@mahe-npm/common";
import { getPrisma } from "../prisma";
import { generateSlug, generateRandomSuffix } from "../utils/slug";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    BETTER_AUTH_URL: string;
  };
  Variables: {
    userId: string;
  };
}>();



import { createAuth } from "../auth";

// Authentication Middleware for protected routes
const authMiddleware = async (c: any, next: () => Promise<void>) => {
  const auth = createAuth(c.env);
  
  // 1. Check Better Auth Session
  const sessionData = await auth.api.getSession({ headers: c.req.raw.headers });
  const betterAuthUserId = sessionData?.user?.id;

  // 2. Check Legacy JWT
  const authHeader = c.req.header("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
  let legacyUserId: string | null = null;
  
  if (token) {
    try {
      const payload = await verify(token, c.env.JWT_SECRET, "HS256");
      if (payload && payload.id) legacyUserId = String(payload.id);
    } catch (err) {
      // Legacy token invalid/expired, ignore for now (better auth might be valid)
    }
  }

  // 3. Evaluate Conflict Policy
  if (betterAuthUserId && legacyUserId && betterAuthUserId.toString() !== legacyUserId.toString()) {
    c.status(409);
    // Setting header to clear better auth session since they conflict
    return c.json({ error: "AUTH_IDENTITY_CONFLICT", message: "Conflicting authentications. Please sign in again." });
  }

  // 4. Authorize
  const finalUserId = betterAuthUserId || legacyUserId;
  
  if (!finalUserId) {
    c.status(401);
    return c.json({ error: "Authentication token missing or invalid" });
  }

  c.set("userId", String(finalUserId));
  await next();
};

// Public Endpoint: Fetch published articles list (newest first)
blogRouter.get("/bulk", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  const page = Math.max(1, Number(c.req.query("page")) || 1);
  const limit = Math.min(25, Math.max(1, Number(c.req.query("limit")) || 10));
  const q = c.req.query("q")?.slice(0, 100).trim();
  const tag = c.req.query("tag")?.trim().toLowerCase();

  const skip = (page - 1) * limit;

  try {
    const where: any = {
      published: true,
    };

    if (q) {
      where.title = {
        contains: q,
        mode: "insensitive",
      };
    }

    if (tag) {
      where.tags = {
        some: {
          tag: {
            slug: tag,
          },
        },
      };
    }

    const [total, blogs] = await Promise.all([
      prisma.blog.count({ where }),
      prisma.blog.findMany({
        where,
        orderBy: [
          { publishedAt: "desc" },
          { id: "desc" },
        ],
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          content: true,
          summary: true,
          coverImage: true,
          slug: true,
          published: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          tags: {
            select: {
              tag: {
                select: { name: true, slug: true },
              },
            },
          },
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              handle: true,
              avatarUrl: true,
              image: true,
            },
          },
        },
      }),
    ]);

    const formattedBlogs = blogs.map((b: any) => ({
      ...b,
      author: b.author ? {
        ...b.author,
        avatarUrl: b.author.avatarUrl || b.author.image,
      } : null,
    }));

    c.header("Cache-Control", "public, max-age=30, s-maxage=120, stale-while-revalidate=300");
    return c.json({ 
      articles: formattedBlogs,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: skip + blogs.length < total,
      }
    });
  } catch (err) {
    console.error("GET /bulk error:", err);
    c.status(500);
    return c.json({ error: "Failed to fetch blogs" });
  }
});

// Protected Endpoint: Fetch all articles (drafts and published) for the authenticated user
blogRouter.get("/mine", authMiddleware, async (c) => {
  const userId = c.get("userId");
  if (!userId) {
    c.status(401);
    return c.json({ error: "Unauthorized: Invalid user ID" });
  }

  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        content: true,
        summary: true,
        coverImage: true,
        slug: true,
        published: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        tags: {
          select: {
            tag: {
              select: { name: true, slug: true },
            },
          },
        },
      },
    });

    return c.json({ success: true, articles: blogs });
  } catch (err) {
    c.status(500);
    return c.json({ error: "Failed to fetch your blogs" });
  }
});

// Protected Endpoint: Fetch a single article (draft or published) for editing by the authenticated user
blogRouter.get("/mine/:id", authMiddleware, async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    c.status(400);
    return c.json({ error: "Invalid blog ID" });
  }

  const userId = c.get("userId");
  if (!userId) {
    c.status(401);
    return c.json({ error: "Unauthorized: Invalid user ID" });
  }

  const prisma = getPrisma(c.env.DATABASE_URL);

  try {
    const blog = await prisma.blog.findFirst({
      where: {
        id,
        authorId: userId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        summary: true,
        coverImage: true,
        slug: true,
        published: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        tags: {
          select: {
            tag: {
              select: { name: true, slug: true },
            },
          },
        },
      },
    });

    if (!blog) {
      c.status(404);
      return c.json({ error: "Blog post not found or you do not have permission to view it" });
    }

    return c.json(blog);
  } catch (err) {
    c.status(500);
    return c.json({ error: "Failed to fetch blog post" });
  }
});

// Public Endpoint: Fetch related articles
blogRouter.get("/:slugOrId/related", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const param = c.req.param("slugOrId");

  const isNumeric = /^\d+$/.test(param);
  const whereClause = isNumeric ? { id: Number(param) } : { slug: param };

  try {
    const blog = await prisma.blog.findFirst({
      where: whereClause,
      select: {
        id: true,
        tags: { select: { tagId: true } },
      }
    });

    if (!blog) {
      return c.json({ articles: [] });
    }

    const tagIds = blog.tags.map(t => t.tagId);
    let relatedBlogs: any[] = [];

    if (tagIds.length > 0) {
      relatedBlogs = await prisma.blog.findMany({
        where: {
          published: true,
          id: { not: blog.id },
          tags: { some: { tagId: { in: tagIds } } }
        },
        orderBy: { publishedAt: "desc" },
        take: 3,
        select: {
          id: true,
          title: true,
          content: true,
          summary: true,
          coverImage: true,
          slug: true,
          published: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          tags: { select: { tag: { select: { name: true, slug: true } } } },
          author: { select: { id: true, name: true, username: true, handle: true, avatarUrl: true } }
        }
      });
    }

    if (relatedBlogs.length < 3) {
      const fallbackBlogs = await prisma.blog.findMany({
        where: {
          published: true,
          id: { notIn: [blog.id, ...relatedBlogs.map(b => b.id)] }
        },
        orderBy: { publishedAt: "desc" },
        take: 3 - relatedBlogs.length,
        select: {
          id: true,
          title: true,
          content: true,
          summary: true,
          coverImage: true,
          slug: true,
          published: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          tags: { select: { tag: { select: { name: true, slug: true } } } },
          author: { select: { id: true, name: true, username: true, handle: true, avatarUrl: true } }
        }
      });
      relatedBlogs = [...relatedBlogs, ...fallbackBlogs];
    }

    c.header("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=600");
    return c.json({ articles: relatedBlogs });
  } catch (err) {
    c.status(500);
    return c.json({ error: "Failed to fetch related blogs" });
  }
});

// Public Endpoint: Fetch single published article details
blogRouter.get("/:slugOrId", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const param = c.req.param("slugOrId");
  
  const isNumeric = /^\d+$/.test(param);
  const whereClause = isNumeric ? { id: Number(param) } : { slug: param };

  try {
    const blog = await prisma.blog.findFirst({
      where: whereClause,
      select: {
        id: true,
        title: true,
        content: true,
        summary: true,
        coverImage: true,
        slug: true,
        published: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        tags: {
          select: {
            tag: {
              select: { name: true, slug: true },
            },
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            handle: true,
            avatarUrl: true,
            image: true,
          },
        },
      },
    });

    if (!blog || !blog.published) {
      c.status(404);
      return c.json({ error: "Blog post not found" });
    }

    const formattedBlog = {
      ...blog,
      author: blog.author ? {
        ...blog.author,
        avatarUrl: blog.author.avatarUrl || blog.author.image,
      } : null,
    };

    c.header("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=600");
    return c.json(formattedBlog);
  } catch (err) {
    c.status(500);
    return c.json({ error: "Failed to fetch blog post" });
  }
});

// Protected Endpoint: Create article
blogRouter.post("/", authMiddleware, async (c) => {
  const reqData = await c.req.json();
  const { success } = createBlogInput.safeParse(reqData);

  if (!success) {
    c.status(400);
    return c.json({ error: "Invalid blog input data" });
  }

  const userId = c.get("userId");
  if (!userId) {
    c.status(401);
    return c.json({ error: "Unauthorized: Invalid user ID" });
  }

  const prisma = getPrisma(c.env.DATABASE_URL);

  try {
    let baseSlug = generateSlug(reqData.title);
    let finalSlug = baseSlug;
    let isUnique = false;
    while (!isUnique) {
      const existing = await prisma.blog.findUnique({ where: { slug: finalSlug }, select: { id: true } });
      if (!existing) {
        isUnique = true;
      } else {
        finalSlug = `${baseSlug}-${generateRandomSuffix()}`;
      }
    }

    const tagsInput = (reqData.tags || [])
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0)
      .slice(0, 5);

    const uniqueTags = new Map<string, string>();
    for (const t of tagsInput) {
      uniqueTags.set(t.toLowerCase(), t);
    }
    const tagNamesToConnect = Array.from(uniqueTags.values());

    const tagConnects = [];
    for (const tagName of tagNamesToConnect) {
      const tagSlug = tagName.toLowerCase();
      const tag = await prisma.tag.upsert({
        where: { slug: tagSlug },
        update: {},
        create: { name: tagName, slug: tagSlug },
      });
      tagConnects.push({ tagId: tag.id });
    }

    const blog = await prisma.blog.create({
      data: {
        title: reqData.title,
        slug: finalSlug,
        content: reqData.content,
        summary: reqData.summary ?? null,
        coverImage: reqData.coverImage ?? null,
        authorId: userId,
        published: reqData.published ?? false,
        publishedAt: (reqData.published ?? false) ? new Date() : null,
        tags: {
          create: tagConnects,
        },
      },
    });

    return c.json({
      id: blog.id,
      slug: blog.slug,
      msg: "Blog published successfully",
    });
  } catch (err) {
    c.status(500);
    return c.json({ error: "Failed to create blog" });
  }
});

// Protected Endpoint: Update article status (publish/unpublish)
import { updateBlogPublishedInput } from "@mahe-npm/common";

blogRouter.patch("/:id/published", authMiddleware, async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    c.status(400);
    return c.json({ error: "Invalid blog ID" });
  }

  const reqData = await c.req.json();
  const { success } = updateBlogPublishedInput.safeParse(reqData);

  if (!success) {
    c.status(400);
    return c.json({ error: "Invalid payload format" });
  }

  const userId = c.get("userId");
  if (!userId) {
    c.status(401);
    return c.json({ error: "Unauthorized: Invalid user ID" });
  }

  const prisma = getPrisma(c.env.DATABASE_URL);

  try {
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      c.status(404);
      return c.json({ error: "Blog post not found" });
    }

    if (existingBlog.authorId !== userId) {
      c.status(403);
      return c.json({ error: "Forbidden: You are not the author of this blog" });
    }

    const isPublishing = reqData.published && !existingBlog.published;

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        published: reqData.published,
        ...(isPublishing && !existingBlog.publishedAt ? { publishedAt: new Date() } : {}),
      },
    });

    return c.json({
      id: updatedBlog.id,
      published: updatedBlog.published,
      msg: "Blog status updated successfully",
    });
  } catch (err) {
    c.status(500);
    return c.json({ error: "Failed to update blog status" });
  }
});

// Protected Endpoint: Update article (with strict ownership check)
blogRouter.put("/", authMiddleware, async (c) => {
  const reqData = await c.req.json();
  const { success } = updateBlogInput.safeParse(reqData);

  if (!success) {
    c.status(400);
    return c.json({ error: "Invalid blog update input" });
  }

  const userId = c.get("userId");
  if (!userId) {
    c.status(401);
    return c.json({ error: "Unauthorized: Invalid user ID" });
  }

  const prisma = getPrisma(c.env.DATABASE_URL);

  try {
    const existingBlog = await prisma.blog.findUnique({
      where: { id: reqData.id },
    });

    if (!existingBlog) {
      c.status(404);
      return c.json({ error: "Blog post not found" });
    }

    if (existingBlog.authorId !== userId) {
      c.status(403);
      return c.json({ error: "Forbidden: You are not the author of this blog" });
    }

    let tagUpdateData = {};
    if (reqData.tags !== undefined) {
      const tagsInput = reqData.tags
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0)
        .slice(0, 5);

      const uniqueTags = new Map<string, string>();
      for (const t of tagsInput) {
        uniqueTags.set(t.toLowerCase(), t);
      }
      const tagNamesToConnect = Array.from(uniqueTags.values());

      const tagConnects = [];
      for (const tagName of tagNamesToConnect) {
        const tagSlug = tagName.toLowerCase();
        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name: tagName, slug: tagSlug },
        });
        tagConnects.push({ tagId: tag.id });
      }

      tagUpdateData = {
        tags: {
          deleteMany: {},
          create: tagConnects,
        },
      };
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: reqData.id },
      data: {
        title: reqData.title,
        content: reqData.content,
        summary: reqData.summary ?? null,
        coverImage: reqData.coverImage ?? null,
        ...tagUpdateData,
      },
    });

    return c.json({
      id: updatedBlog.id,
      slug: updatedBlog.slug,
      msg: "Blog updated successfully",
    });
  } catch (err) {
    c.status(500);
    return c.json({ error: "Failed to update blog" });
  }
});

// Protected Endpoint: Delete article (with strict ownership check)
blogRouter.delete("/:id", authMiddleware, async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    c.status(400);
    return c.json({ error: "Invalid blog ID" });
  }

  const userId = c.get("userId");
  if (!userId) {
    c.status(401);
    return c.json({ error: "Unauthorized: Invalid user ID" });
  }

  const prisma = getPrisma(c.env.DATABASE_URL);

  try {
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      c.status(404);
      return c.json({ error: "Blog post not found" });
    }

    if (existingBlog.authorId !== userId) {
      c.status(403);
      return c.json({ error: "Forbidden: You are not the author of this blog" });
    }

    await prisma.blog.delete({
      where: { id },
    });

    return c.json({ msg: "Blog deleted successfully" });
  } catch (err) {
    c.status(500);
    return c.json({ error: "Failed to delete blog" });
  }
});
