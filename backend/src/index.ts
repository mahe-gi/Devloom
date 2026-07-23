import { Hono } from "hono";
import { userRouter } from "./routes/userRouter";
import { blogRouter } from "./routes/blogRouter";
import { cors } from "hono/cors";
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();
import { authorRouter } from "./routes/authorRouter";

app.use("/*", cors());
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);
app.route("/api/v1/authors", authorRouter);

import { getPrisma } from "./prisma";

app.get("/sitemap.xml", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true }
  });
  
  const frontendUrl = "https://101dev.com";
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  for (const blog of blogs) {
    if (blog.slug) {
      xml += `  <url>\n`;
      xml += `    <loc>${frontendUrl}/article/${blog.slug}</loc>\n`;
      xml += `    <lastmod>${blog.updatedAt.toISOString()}</lastmod>\n`;
      xml += `  </url>\n`;
    }
  }
  xml += `</urlset>`;
  
  return new Response(xml, {
    headers: { "Content-Type": "application/xml" }
  });
});

export default app;
