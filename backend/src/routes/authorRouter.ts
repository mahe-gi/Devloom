import { Hono } from "hono";
import { getPrisma } from "../prisma";

export const authorRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
}>();

// Public Endpoint: Fetch public author profile and their published articles
authorRouter.get("/:handle", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const handle = c.req.param("handle").toLowerCase();

  const page = Math.max(1, Number(c.req.query("page")) || 1);
  const limit = Math.min(25, Math.max(1, Number(c.req.query("limit")) || 10));
  const skip = (page - 1) * limit;

  try {
    const author = await prisma.user.findFirst({
      where: {
        OR: [
          { handle: handle },
          { username: handle },
          { email: handle }
        ]
      },
      select: {
        id: true,
        name: true,
        username: true,
        handle: true,
        bio: true,
        avatarUrl: true,
        image: true,
      },
    });

    if (!author) {
      c.status(404);
      return c.json({ error: "Author not found" });
    }

    const formattedAuthor = {
      ...author,
      avatarUrl: author.avatarUrl || author.image,
    };

    const where = {
      authorId: author.id,
      published: true,
    };

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
        },
      }),
    ]);

    // Attach author to blogs to maintain structure for UI
    const articles = blogs.map((b) => ({
      ...b,
      author: {
        id: formattedAuthor.id,
        name: formattedAuthor.name,
        username: formattedAuthor.username,
        handle: formattedAuthor.handle,
        avatarUrl: formattedAuthor.avatarUrl,
      },
    }));

    c.header("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=600");
    return c.json({
      author: formattedAuthor,
      articles,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: skip + blogs.length < total,
      },
    });
  } catch (err) {
    console.error("GET /authors/:handle error:", err);
    c.status(500);
    return c.json({ error: "Failed to fetch author profile" });
  }
});
