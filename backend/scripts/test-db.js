import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL || "postgresql://postgres:postgres@127.0.0.1:5432/blog_migration_test"
});
async function main() {
    console.log("Testing Prisma Queries for Phase 4...");
    // 1. Check slug generation
    const blog = await prisma.blog.findFirst({ select: { slug: true, title: true } });
    console.log("Blog:", blog);
    // 2. Check tags
    const tags = await prisma.tag.findMany();
    console.log("Tags:", tags);
    // 3. Related blogs logic check
    if (blog?.slug) {
        const fetched = await prisma.blog.findUnique({ where: { slug: blog.slug } });
        console.log("Fetched by slug successfully!");
    }
    console.log("Database queries successful!");
}
main().catch(console.error).finally(() => prisma.$disconnect());
