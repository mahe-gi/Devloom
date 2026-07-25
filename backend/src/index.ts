import { Hono } from "hono";
import { cors } from "hono/cors";
import { userRouter } from "./routes/userRouter";
import { blogRouter } from "./routes/blogRouter";
import { authorRouter } from "./routes/authorRouter";
import { createAuth } from "./auth";
import { getPrisma } from "./prisma";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    BETTER_AUTH_URL: string;
  };
}>();

app.use("/*", async (c, next) => {
  const origin = c.req.header("origin") || "";
  const isAllowed = 
    origin.startsWith("http://localhost:") ||
    origin.endsWith(".vercel.app") ||
    origin === "https://blog.techwithmahe.com" ||
    origin === "https://devloom-frontend.vercel.app";

  const allowOrigin = isAllowed ? origin : "https://blog.techwithmahe.com";

  const corsMiddleware = cors({
    origin: allowOrigin,
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    maxAge: 86400,
  });
  return corsMiddleware(c, next);
});

app.get("/api/v1/health-check", async (c) => {
  try {
    const prisma = getPrisma(c.env?.DATABASE_URL || process.env.DATABASE_URL);
    const [userCount, blogCount, tagCount] = await Promise.all([
      prisma.user.count(),
      prisma.blog.count(),
      prisma.tag.count(),
    ]);
    const dbHost = (c.env?.DATABASE_URL || process.env.DATABASE_URL || "").split("@")[1]?.split("/")[0] || "unknown";
    return c.json({
      status: "ok",
      dbHost,
      counts: { users: userCount, blogs: blogCount, tags: tagCount }
    });
  } catch (err: any) {
    return c.json({
      status: "error",
      message: err?.message || String(err),
      stack: err?.stack
    }, 500);
  }
});

import { seedRouter } from "./routes/seedRouter";

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);
app.route("/api/v1/authors", authorRouter);
app.route("/api/v1/seed-database", seedRouter);

app.on(["GET", "POST"], "/api/auth/*", async (c) => {
  try {
    const origin = c.req.header("origin") || c.req.header("referer") || "";
    const envVars = {
      DATABASE_URL: c.env?.DATABASE_URL || process.env.DATABASE_URL || "",
      GOOGLE_CLIENT_ID: c.env?.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "",
      GOOGLE_CLIENT_SECRET: c.env?.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET || "",
      BETTER_AUTH_URL: c.env?.BETTER_AUTH_URL || process.env.BETTER_AUTH_URL || "https://backend-cloudflare-worker.chmahesh997.workers.dev",
    };
    const auth = createAuth(envVars, origin);
    const res = await auth.handler(c.req.raw);

    // Inject session token into callback redirect URL for cross-domain cookie bypass
    if (c.req.path.includes("/callback/google") && res.status === 302) {
      const location = res.headers.get("location");
      const setCookie = res.headers.get("set-cookie") || "";
      const match = setCookie.match(/better-auth\.session_token=([^;]+)/);
      if (match && location) {
        try {
          const rawCookieVal = match[1];
          const token = decodeURIComponent(rawCookieVal.split(".")[0]);
          const baseUrl = origin.startsWith("http") ? origin : "https://blog.techwithmahe.com";
          const url = new URL(location, baseUrl);
          if (!url.searchParams.has("token")) {
            url.searchParams.set("token", token);
            const newHeaders = new Headers(res.headers);
            newHeaders.set("location", url.toString());
            return new Response(res.body, {
              status: 302,
              headers: newHeaders,
            });
          }
        } catch (urlErr) {
          console.error("URL parsing error in auth callback redirect:", urlErr);
        }
      }
    }

    return res;
  } catch (err: any) {
    console.error("Better Auth handler exception:", err);
    return c.json({ error: "Authentication service error", details: err?.message || String(err) }, 500);
  }
});

app.get("/sitemap.xml", async (c) => {
  try {
    const prisma = getPrisma(c.env?.DATABASE_URL || process.env.DATABASE_URL);
    const blogs = await prisma.blog.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true }
    });
    
    const frontendUrl = "https://blog.techwithmahe.com";
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    for (const blog of blogs) {
      if (blog.slug) {
        xml += `  <url>\n`;
        xml += `    <loc>${frontendUrl}/blog/${blog.slug}</loc>\n`;
        xml += `    <lastmod>${blog.updatedAt ? blog.updatedAt.toISOString() : new Date().toISOString()}</lastmod>\n`;
        xml += `  </url>\n`;
      }
    }
    xml += `</urlset>`;
    
    return new Response(xml, {
      headers: { "Content-Type": "application/xml" }
    });
  } catch (err: any) {
    console.error("Sitemap XML error:", err);
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`, {
      headers: { "Content-Type": "application/xml" }
    });
  }
});

export default app;
