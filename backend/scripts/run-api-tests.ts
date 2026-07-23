import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || "postgresql://postgres:postgres@127.0.0.1:5432/blog_migration_test"
});

const BASE_URL = "http://127.0.0.1:8787";

async function fetchJSON(url: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${url}`, options);
  const text = await res.text();
  try {
    return { status: res.status, data: JSON.parse(text) };
  } catch (e) {
    return { status: res.status, text };
  }
}

async function main() {
  console.log("🚀 Starting Phase 4 API Test Matrix...");

  // 0. Reset Database
  await prisma.blog.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  const timestamp = Date.now();
  const aliceEmail = `alice${timestamp}@example.com`;
  const aliceHandle = `Alice-Dev-${timestamp}`;
  const aliceHandleLower = `alice-dev-${timestamp}`;
  const bobEmail = `bob${timestamp}@example.com`;

  // 1. Signup User 1
  console.log("-> Signing up Test User 1");
  let res = await fetchJSON("/api/v1/user/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Alice", username: aliceEmail, password: "password123" })
  });
  console.log("Signup res:", res);
  const tokenAlice = "Bearer " + res.data.token;

  // 2. Profile tests
  console.log("-> Testing Profile: Missing auth");
  res = await fetchJSON("/api/v1/user/profile", { method: "PUT" });
  if (res.status !== 403 && res.status !== 401) throw new Error(`Missing auth should fail but got ${res.status}`);

  console.log("-> Testing Profile: Setup handle");
  res = await fetchJSON("/api/v1/user/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": tokenAlice },
    body: JSON.stringify({ handle: aliceHandle, bio: "Hello" })
  });
  if (res.status !== 200) throw new Error("Profile setup failed: " + JSON.stringify(res.data));

  // Check handle is lowercase
  res = await fetchJSON(`/api/v1/authors/${aliceHandleLower}`);
  if (res.status !== 200) {
    console.error("Handle error:", res);
    throw new Error("Handle not found or not lowercase");
  }
  
  // Public profile excludes email and drafts
  if (res.data.email || res.data.username) throw new Error("Email leaked in public profile!");
  
  // Reserved handle rejected
  console.log("-> Testing Profile: Reserved handle");
  res = await fetchJSON("/api/v1/user/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": tokenAlice },
    body: JSON.stringify({ handle: "admin" })
  });
  if (res.status !== 400) throw new Error("Reserved handle should be rejected");

  // Signup User 2 to test duplicate handle
  res = await fetchJSON("/api/v1/user/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Bob", username: bobEmail, password: "password123" })
  });
  const tokenBob = "Bearer " + res.data.token;

  console.log("-> Testing Profile: Duplicate handle");
  res = await fetchJSON("/api/v1/user/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": tokenBob },
    body: JSON.stringify({ handle: aliceHandleLower })
  });
  if (res.status !== 409) throw new Error("Duplicate handle should return 409");

  // 3. Slug & Tag Tests
  console.log("-> Testing Slugs & Tags");
  
  const dynamicTitle = `My Awesome Post ${timestamp}`;
  const dynamicSlugPrefix = `my-awesome-post-${timestamp}`;
  
  // Create normal title
  res = await fetchJSON("/api/v1/blog", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": tokenAlice },
    body: JSON.stringify({ title: dynamicTitle, content: "Hello world" })
  });
  const id1 = res.data.id;
  console.log(`Created draft 1 ID: ${id1}`);

  // Publish with Tags
  res = await fetchJSON("/api/v1/blog", {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": tokenAlice },
    body: JSON.stringify({ id: id1, title: dynamicTitle, content: "Hello world", published: true, tags: ["React", "react", " REACT "] })
  });
  let slug1 = res.data.slug;
  if (!slug1) throw new Error("Slug not generated");
  if (slug1 !== dynamicSlugPrefix) throw new Error(`Unexpected slug: ${slug1} (expected ${dynamicSlugPrefix})`);
  
  // Publish the article
  await fetchJSON(`/api/v1/blog/${id1}/published`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "Authorization": tokenAlice },
    body: JSON.stringify({ published: true })
  });

  res = await fetchJSON(`/api/v1/blog/${slug1}`);
  if (res.status !== 200) throw new Error(`GET slug1 failed with ${res.status}: ${JSON.stringify(res.data)}`);
  if (res.data.tags.length !== 1) throw new Error("Tags were not normalized to a single tag");
  console.log(`Published slug 1: ${slug1} with tags: ${res.data.tags.map((t:any)=>t.tag.name).join(",")}`);

  // Duplicate title
  res = await fetchJSON("/api/v1/blog", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": tokenAlice },
    body: JSON.stringify({ title: dynamicTitle, content: "Hello world 2" })
  });
  const id2 = res.data.id;
  res = await fetchJSON("/api/v1/blog", {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": tokenAlice },
    body: JSON.stringify({ id: id2, title: dynamicTitle, content: "Hello world 2", published: true, tags: ["Node.js"] })
  });
  const slug2 = res.data.slug;
  
  await fetchJSON(`/api/v1/blog/${id2}/published`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "Authorization": tokenAlice },
    body: JSON.stringify({ published: true })
  });
  
  if (slug1 === slug2) throw new Error("Duplicate titles should not have same slug");
  console.log(`Published slug 2 (duplicate title): ${slug2}`);

  // Numeric title
  res = await fetchJSON("/api/v1/blog", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": tokenAlice },
    body: JSON.stringify({ title: `12345`, content: "Numeric" })
  });
  const id3 = res.data.id;
  res = await fetchJSON("/api/v1/blog", {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": tokenAlice },
    body: JSON.stringify({ id: id3, title: `12345`, content: "Numeric", published: true })
  });
  const slug3 = res.data.slug;
  
  await fetchJSON(`/api/v1/blog/${id3}/published`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "Authorization": tokenAlice },
    body: JSON.stringify({ published: true })
  });

  if (slug3 === `12345`) throw new Error("Numeric title should not produce numeric slug");
  console.log(`Published slug 3 (numeric title): ${slug3}`);

  // Edit title - slug remains stable
  res = await fetchJSON("/api/v1/blog", {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": tokenAlice },
    body: JSON.stringify({ id: id1, title: "Changed Title", content: "Hello world", published: true, tags: ["React"] })
  });
  if (res.data.slug !== slug1) throw new Error("Slug changed after edit");
  console.log(`Slug 1 remained stable after title edit: ${res.data.slug}`);

  // Six tags rejected
  console.log("-> Testing Tag limits");
  res = await fetchJSON("/api/v1/blog", {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": tokenAlice },
    body: JSON.stringify({ id: id1, title: "Changed Title", content: "Hello", tags: ["t1","t2","t3","t4","t5","t6"] })
  });
  if (res.status !== 400) throw new Error(`Six tags should be rejected with 400, got ${res.status}`);

  // Empty array clears tags
  await fetchJSON("/api/v1/blog", {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": tokenAlice },
    body: JSON.stringify({ id: id1, title: "Changed Title", content: "Hello", published: true, tags: [] })
  });
  res = await fetchJSON(`/api/v1/blog/${slug1}`);
  if (res.status !== 200) throw new Error(`GET slug1 failed with ${res.status}: ${JSON.stringify(res.data)}`);
  if (res.data.tags.length !== 0) throw new Error("Empty array did not clear tags");

  // Omitted tags preserve tags
  // First add a tag back
  await fetchJSON("/api/v1/blog", {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": tokenAlice },
    body: JSON.stringify({ id: id1, title: "Changed Title", content: "Hello", published: true, tags: ["preserved-tag"] })
  });
  await fetchJSON("/api/v1/blog", {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": tokenAlice },
    body: JSON.stringify({ id: id1, title: "Changed Title", content: "Hello updated", published: true })
  });
  res = await fetchJSON(`/api/v1/blog/${slug1}`);
  if (res.status !== 200) throw new Error(`GET slug1 failed with ${res.status}: ${JSON.stringify(res.data)}`);
  if (res.data.tags.length !== 1 || res.data.tags[0].tag.name !== "preserved-tag") throw new Error("Omitted tags did not preserve tags");

  // 4. Access testing
  console.log("-> Testing Route Access");
  // Access by slug
  res = await fetchJSON(`/api/v1/blog/${slug1}`);
  if (res.status !== 200 || res.data.id !== id1) throw new Error("Access by slug failed");
  // Access by ID (old numeric)
  res = await fetchJSON(`/api/v1/blog/${id1}`);
  if (res.status !== 200 || res.data.id !== id1) throw new Error("Access by ID failed");
  // Access unknown slug
  res = await fetchJSON(`/api/v1/blog/unknown-slug-xyz`);
  if (res.status !== 404) throw new Error("Unknown slug should be 404");

  // Draft by slug -> 404
  res = await fetchJSON("/api/v1/blog", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": tokenAlice },
    body: JSON.stringify({ title: "Draft Post", content: "Draft" })
  });
  const idDraft = res.data.id;
  await fetchJSON("/api/v1/blog", {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": tokenAlice },
    body: JSON.stringify({ id: idDraft, title: "Draft Post", content: "Draft", published: false })
  });
  const dbDraft = await prisma.blog.findUnique({ where: { id: idDraft } });
  if (dbDraft?.slug) {
    res = await fetchJSON(`/api/v1/blog/${dbDraft.slug}`);
    if (res.status !== 404) throw new Error("Draft accessed by slug should be 404");
  }

  // 5. Search & Pagination
  console.log("-> Testing Search & Pagination");
  res = await fetchJSON(`/api/v1/blog/bulk?q=Awesome`);
  if (res.data.articles.length < 1) throw new Error("Search by title failed");

  res = await fetchJSON(`/api/v1/blog/bulk?tag=node.js`);
  if (!res.data.articles.some((a:any) => a.slug === slug2)) throw new Error(`Search by tag failed: ${JSON.stringify(res.data)} (expected slug2=${slug2})`);

  res = await fetchJSON(`/api/v1/blog/bulk?limit=1&page=1`);
  const paginatedId = res.data.articles[0].id;
  res = await fetchJSON(`/api/v1/blog/bulk?limit=1&page=2`);
  if (res.data.articles[0].id === paginatedId) throw new Error("Pagination duplicated records");

  // 6. Related articles
  console.log("-> Testing Related Articles");
  // Add unique tag to both 1 and 2
  const uniqueTag = `tech-${timestamp}`;
  res = await fetchJSON("/api/v1/blog", {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": tokenAlice },
    body: JSON.stringify({ id: id1, title: "Title 1", content: "Content 1", tags: [uniqueTag] })
  });
  if (res.status !== 200) throw new Error(`Tag update 1 failed: ${JSON.stringify(res.data)}`);
  
  res = await fetchJSON("/api/v1/blog", {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": tokenAlice },
    body: JSON.stringify({ id: id2, title: "Title 2", content: "Content 2", tags: [uniqueTag] })
  });
  if (res.status !== 200) throw new Error(`Tag update 2 failed: ${JSON.stringify(res.data)}`);
  
  res = await fetchJSON(`/api/v1/blog/${slug1}/related`);
  if (!res.data.articles.some((a:any) => a.id === id2)) throw new Error(`Related articles missing shared tag article: ${JSON.stringify(res.data.articles.map((a:any)=>a.id))}`);
  if (res.data.articles.some((a:any) => a.id === id1)) throw new Error("Related articles included self");

  // 7. Sitemap XML
  console.log("-> Testing Sitemap XML");
  res = await fetchJSON("/sitemap.xml");
  if (res.status !== 200 || !(res.text as string).includes(slug1)) throw new Error("Sitemap missing slug");
  if (dbDraft?.slug && (res.text as string).includes(dbDraft.slug)) throw new Error("Sitemap includes draft");

  console.log("🎉 ALL TESTS PASSED! Phase 4 API functionality is fully verified.");
}

main().catch((e) => {
  console.error("❌ Test script failed:", e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
