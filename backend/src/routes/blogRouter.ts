import { Hono } from "hono";
import { getPrisma } from "../prisma";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

// Auth Middleware to extract userId from Session Header or Auth context
const authMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header("Authorization") || "";
  const authCookie = c.req.header("Cookie") || "";
  
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  const cookieMatch = authCookie.match(/better-auth\.session_token=([^;]+)/);
  const cookieToken = cookieMatch ? decodeURIComponent(cookieMatch[1].split(".")[0]) : "";

  const sessionToken = token || cookieToken;

  if (!sessionToken) {
    c.status(401);
    return c.json({ error: "Unauthorized: Missing authentication token" });
  }

  const prisma = getPrisma(c.env.DATABASE_URL);

  // 1. Check Better Auth Session Table
  let session = await prisma.session.findUnique({
    where: { token: sessionToken },
    include: { user: true },
  });

  if (!session) {
    session = await prisma.session.findFirst({
      where: { token: { startsWith: sessionToken } },
      include: { user: true },
    });
  }

  let betterAuthUserId: string | null = null;
  if (session && session.user) {
    if (new Date() > new Date(session.expiresAt)) {
      c.status(401);
      return c.json({ error: "Session expired. Please sign in again." });
    }
    betterAuthUserId = session.user.id;
  }

  let legacyUserId: string | null = null;

  if (betterAuthUserId && legacyUserId && betterAuthUserId !== legacyUserId) {
    c.status(409);
    return c.json({ error: "AUTH_IDENTITY_CONFLICT", message: "Conflicting authentications. Please sign in again." });
  }

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
      const lower = q.toLowerCase();
      const upper = q.toUpperCase();
      const cap = q.charAt(0).toUpperCase() + q.slice(1).toLowerCase();
      where.OR = [
        { title: { contains: q } },
        { title: { contains: lower } },
        { title: { contains: upper } },
        { title: { contains: cap } },
      ];
    }

    if (tag) {
      const lowerTag = tag.toLowerCase();
      try {
        const tagRecord = await prisma.tag.findFirst({
          where: {
            OR: [{ slug: lowerTag }, { name: lowerTag }],
          },
          select: { id: true },
        });
        if (tagRecord) {
          const blogTags = await prisma.blogTag.findMany({
            where: { tagId: tagRecord.id },
            select: { blogId: true },
          });
          const blogIds = blogTags.map((bt) => bt.blogId);
          where.id = { in: blogIds };
        } else {
          where.id = { in: [] };
        }
      } catch (tagErr) {
        console.error("Tag query error:", tagErr);
      }
    }

    const total = await prisma.blog.count({ where });
    const blogs = await prisma.blog.findMany({
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
        summary: true,
        coverImage: true,
        slug: true,
        published: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        tags: {
          include: {
            tag: true,
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
  } catch (err: any) {
    console.error("GET /bulk error:", err);
    c.status(500);
    return c.json({ error: "Failed to fetch blogs", details: err?.message || String(err) });
  }
});

// Protected Endpoint: Fetch articles created by the authenticated user
blogRouter.get("/mine", authMiddleware, async (c) => {
  const userId = c.get("userId");
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
      }
    });

    if (!blog) {
      return c.json({ articles: [] });
    }

    const blogTags = await prisma.blogTag.findMany({
      where: { blogId: blog.id },
      select: { tagId: true }
    });
    const tagIds = blogTags.map(bt => bt.tagId);

    let relatedBlogs: any[] = [];

    if (tagIds.length > 0) {
      const relatedMatches = await prisma.blogTag.findMany({
        where: {
          tagId: { in: tagIds },
          blogId: { not: blog.id }
        },
        select: { blogId: true },
        take: 10
      });
      const matchingBlogIds = [...new Set(relatedMatches.map(bt => bt.blogId))];
      if (matchingBlogIds.length > 0) {
        relatedBlogs = await prisma.blog.findMany({
          where: {
            published: true,
            id: { in: matchingBlogIds }
          },
          orderBy: { publishedAt: "desc" },
          take: 3,
          select: {
            id: true,
            title: true,
            summary: true,
            coverImage: true,
            slug: true,
            published: true,
            publishedAt: true,
            createdAt: true,
            updatedAt: true,
            tags: { select: { tag: { select: { name: true, slug: true } } } },
            author: { select: { id: true, name: true, username: true, handle: true, avatarUrl: true, image: true } }
          }
        });
      }
    }

    if (relatedBlogs.length < 3) {
      const existingIds = [blog.id, ...relatedBlogs.map(b => b.id)];
      const fallbackBlogs = await prisma.blog.findMany({
        where: {
          published: true,
          id: { notIn: existingIds }
        },
        orderBy: { publishedAt: "desc" },
        take: 3 - relatedBlogs.length,
        select: {
          id: true,
          title: true,
          summary: true,
          coverImage: true,
          slug: true,
          published: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          tags: { select: { tag: { select: { name: true, slug: true } } } },
          author: { select: { id: true, name: true, username: true, handle: true, avatarUrl: true, image: true } }
        }
      });
      relatedBlogs = [...relatedBlogs, ...fallbackBlogs];
    }

    const formattedRelated = relatedBlogs.map((b: any) => ({
      ...b,
      author: b.author ? {
        ...b.author,
        avatarUrl: b.author.avatarUrl || b.author.image,
      } : null,
    }));

    c.header("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=600");
    return c.json({ articles: formattedRelated });
  } catch (err) {
    console.error("GET /:slugOrId/related error:", err);
    c.status(500);
    return c.json({ error: "Failed to fetch related articles" });
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

// Protected Endpoint: Create a new blog post
blogRouter.post("/", authMiddleware, async (c) => {
  const body = await c.req.json();
  const userId = c.get("userId");
  const prisma = getPrisma(c.env.DATABASE_URL);

  try {
    const { title, content, summary, coverImage, published, tags } = body;

    if (!title || !content) {
      c.status(400);
      return c.json({ error: "Title and content are required" });
    }

    let baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (!baseSlug) baseSlug = `post-${Date.now()}`;
    
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.blog.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const tagConnects = [];
    if (Array.isArray(tags)) {
      for (const tagName of tags) {
        const tagSlug = tagName.toLowerCase().trim();
        if (tagSlug) {
          const tag = await prisma.tag.upsert({
            where: { slug: tagSlug },
            update: {},
            create: { name: tagName.trim(), slug: tagSlug },
          });
          tagConnects.push({ tagId: tag.id });
        }
      }
    }

    const isPublished = Boolean(published);

    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        content,
        summary: summary || null,
        coverImage: coverImage || null,
        published: isPublished,
        publishedAt: isPublished ? new Date() : null,
        authorId: userId,
        tags: {
          create: tagConnects,
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
      },
    });

    return c.json({ id: blog.id, slug: blog.slug, published: blog.published });
  } catch (err) {
    console.error("POST /blog error:", err);
    c.status(500);
    return c.json({ error: "Failed to create blog post" });
  }
});

// Protected Endpoint: Update a blog post
blogRouter.put("/:id", authMiddleware, async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    c.status(400);
    return c.json({ error: "Invalid blog ID" });
  }

  const body = await c.req.json();
  const userId = c.get("userId");
  const prisma = getPrisma(c.env.DATABASE_URL);

  try {
    const existing = await prisma.blog.findFirst({
      where: { id, authorId: userId },
    });

    if (!existing) {
      c.status(404);
      return c.json({ error: "Blog post not found or unauthorized" });
    }

    const { title, content, summary, coverImage, published, tags } = body;
    const isPublished = published !== undefined ? Boolean(published) : existing.published;
    
    let publishedAt = existing.publishedAt;
    if (isPublished && !existing.publishedAt) {
      publishedAt = new Date();
    }

    let tagConnects = undefined;
    if (Array.isArray(tags)) {
      await prisma.blogTag.deleteMany({ where: { blogId: id } });
      tagConnects = [];
      for (const tagName of tags) {
        const tagSlug = tagName.toLowerCase().trim();
        if (tagSlug) {
          const tag = await prisma.tag.upsert({
            where: { slug: tagSlug },
            update: {},
            create: { name: tagName.trim(), slug: tagSlug },
          });
          tagConnects.push({ tagId: tag.id });
        }
      }
    }

    const updated = await prisma.blog.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(summary !== undefined && { summary }),
        ...(coverImage !== undefined && { coverImage }),
        published: isPublished,
        publishedAt,
        ...(tagConnects && {
          tags: {
            create: tagConnects,
          },
        }),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
      },
    });

    return c.json(updated);
  } catch (err) {
    console.error("PUT /blog/:id error:", err);
    c.status(500);
    return c.json({ error: "Failed to update blog post" });
  }
});

// Protected Endpoint: Delete a blog post
blogRouter.delete("/:id", authMiddleware, async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    c.status(400);
    return c.json({ error: "Invalid blog ID" });
  }

  const userId = c.get("userId");
  const prisma = getPrisma(c.env.DATABASE_URL);

  try {
    const existing = await prisma.blog.findFirst({
      where: { id, authorId: userId },
    });

    if (!existing) {
      c.status(404);
      return c.json({ error: "Blog post not found or unauthorized" });
    }

    await prisma.blog.delete({ where: { id } });
    return c.json({ message: "Blog post deleted successfully" });
  } catch (err) {
    c.status(500);
    return c.json({ error: "Failed to delete blog post" });
  }
});
