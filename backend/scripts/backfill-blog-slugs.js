import { PrismaClient } from '@prisma/client';
import { generateSlug, generateRandomSuffix } from '../src/utils/slug';
const prisma = new PrismaClient();
async function main() {
    console.log('Starting slug backfill...');
    // Fetch only articles where slug IS NULL
    const blogsWithoutSlug = await prisma.blog.findMany({
        where: { slug: null },
        select: { id: true, title: true }
    });
    console.log(`Found ${blogsWithoutSlug.length} articles to backfill.`);
    for (const blog of blogsWithoutSlug) {
        let baseSlug = generateSlug(blog.title);
        let finalSlug = baseSlug;
        // Handle duplicate titles and collisions
        let isUnique = false;
        while (!isUnique) {
            const existing = await prisma.blog.findUnique({
                where: { slug: finalSlug },
                select: { id: true }
            });
            if (!existing) {
                isUnique = true;
            }
            else {
                // Collision detected
                finalSlug = `${baseSlug}-${generateRandomSuffix()}`;
            }
        }
        await prisma.blog.update({
            where: { id: blog.id },
            data: { slug: finalSlug }
        });
        console.log(`Updated blog ${blog.id} with slug: ${finalSlug}`);
    }
    console.log('Slug backfill complete.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
