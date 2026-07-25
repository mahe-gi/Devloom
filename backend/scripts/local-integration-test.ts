const LOCAL_URL = "http://127.0.0.1:8787";
const FRONTEND_ORIGIN = "http://localhost:5173";

interface TestResult {
  name: string;
  passed: boolean;
  durationMs: number;
  statusCode?: number;
  details?: string;
}

const results: TestResult[] = [];

async function runTest(name: string, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    const durationMs = Date.now() - start;
    results.push({ name, passed: true, durationMs });
    console.log(`✅ PASSED: ${name} (${durationMs}ms)`);
  } catch (err: any) {
    const durationMs = Date.now() - start;
    const msg = err.message || String(err);
    results.push({ name, passed: false, durationMs, details: msg });
    console.error(`❌ FAILED: ${name} (${durationMs}ms) - ${msg}`);
  }
}

async function main() {
  console.log(`\n================================================================`);
  console.log(`🧪 STARTING LOCAL RUNTIME INTEGRATION TEST SUITE`);
  console.log(`Target Local Backend: ${LOCAL_URL}`);
  console.log(`Target Local DB: Docker PostgreSQL (127.0.0.1:5432)`);
  console.log(`Target Frontend Origin: ${FRONTEND_ORIGIN}`);
  console.log(`================================================================\n`);

  const headers = { Origin: FRONTEND_ORIGIN, Connection: "close" };

  // 1. CORS Options Preflight
  await runTest("1. CORS Options Preflight (OPTIONS /api/v1/blog/bulk)", async () => {
    const res = await fetch(`${LOCAL_URL}/api/v1/blog/bulk`, {
      method: "OPTIONS",
      headers
    });
    if (res.status !== 204) {
      const txt = await res.text();
      throw new Error(`Expected HTTP 204, got ${res.status}: ${txt}`);
    }
  });

  // 2. Health Check Endpoint
  await runTest("2. Local Health Check (GET /api/v1/health-check)", async () => {
    const res = await fetch(`${LOCAL_URL}/api/v1/health-check`, { headers });
    if (res.status !== 200) {
      const txt = await res.text();
      throw new Error(`Expected HTTP 200, got ${res.status}: ${txt}`);
    }
    const data = await res.json() as any;
    console.log(`   [DB Counts]: ${JSON.stringify(data.counts)}`);
  });

  // 3. Public Articles Bulk Feed
  let sampleSlug = "";
  let sampleId = 0;
  let sampleAuthorHandle = "";

  await runTest("3. Public Articles Feed (GET /api/v1/blog/bulk)", async () => {
    const res = await fetch(`${LOCAL_URL}/api/v1/blog/bulk`, { headers });
    if (res.status !== 200) {
      const txt = await res.text();
      throw new Error(`Expected HTTP 200, got ${res.status}: ${txt}`);
    }
    const data = await res.json() as any;
    if (!data.articles || !Array.isArray(data.articles)) throw new Error("Missing articles array");
    if (data.articles.length === 0) throw new Error("Feed returned 0 articles");
    
    const blog = data.articles[0];
    sampleSlug = blog.slug;
    sampleId = blog.id;
    sampleAuthorHandle = blog.author?.handle || "chmahesh997";
  });

  // 4. Keyword Search Query Filter
  await runTest("4. Search Keyword Filter (GET /api/v1/blog/bulk?q=react)", async () => {
    const res = await fetch(`${LOCAL_URL}/api/v1/blog/bulk?q=react`, { headers });
    if (res.status !== 200) {
      const txt = await res.text();
      throw new Error(`Expected HTTP 200, got ${res.status}: ${txt}`);
    }
    const data = await res.json() as any;
    if (!data.articles || data.articles.length === 0) throw new Error("Search 'react' returned 0 results");
  });

  // 5. Tag Filter Query
  await runTest("5. Tag Filter Query (GET /api/v1/blog/bulk?tag=postgres)", async () => {
    const res = await fetch(`${LOCAL_URL}/api/v1/blog/bulk?tag=postgres`, { headers });
    if (res.status !== 200) {
      const txt = await res.text();
      throw new Error(`Expected HTTP 200, got ${res.status}: ${txt}`);
    }
    const data = await res.json() as any;
    if (!data.articles || data.articles.length === 0) throw new Error("Tag 'postgres' returned 0 results");
  });

  // 6. Single Article Details by Slug
  await runTest(`6. Single Article Detail (GET /api/v1/blog/${sampleSlug})`, async () => {
    if (!sampleSlug) throw new Error("No sample slug available");
    const res = await fetch(`${LOCAL_URL}/api/v1/blog/${sampleSlug}`, { headers });
    if (res.status !== 200) {
      const txt = await res.text();
      throw new Error(`Expected HTTP 200, got ${res.status}: ${txt}`);
    }
    const data = await res.json() as any;
    if (!data.title || !data.content) throw new Error("Article body missing title or content");
  });

  // 7. Related Articles Endpoint
  await runTest(`7. Related Articles (GET /api/v1/blog/${sampleSlug}/related)`, async () => {
    if (!sampleSlug) throw new Error("No sample slug available");
    const res = await fetch(`${LOCAL_URL}/api/v1/blog/${sampleSlug}/related`, { headers });
    if (res.status !== 200) {
      const txt = await res.text();
      throw new Error(`Expected HTTP 200, got ${res.status}: ${txt}`);
    }
    const data = await res.json() as any;
    if (!data.articles || !Array.isArray(data.articles)) throw new Error("Missing articles array in related response");
  });

  // 8. Public Author Profile
  await runTest(`8. Public Author Profile (GET /api/v1/authors/${sampleAuthorHandle})`, async () => {
    if (!sampleAuthorHandle) throw new Error("No sample author handle available");
    const res = await fetch(`${LOCAL_URL}/api/v1/authors/${sampleAuthorHandle}`, { headers });
    if (res.status !== 200) {
      const txt = await res.text();
      throw new Error(`Expected HTTP 200, got ${res.status}: ${txt}`);
    }
    const data = await res.json() as any;
    if (!data.author || !data.articles) throw new Error("Author response missing author profile or articles");
  });

  // 9. Unauthenticated Session Status
  await runTest("9. Session Check Unauthenticated (GET /api/auth/get-session)", async () => {
    const res = await fetch(`${LOCAL_URL}/api/auth/get-session`, { headers });
    if (res.status !== 200) {
      const txt = await res.text();
      throw new Error(`Expected HTTP 200, got ${res.status}: ${txt}`);
    }
    const data = await res.json() as any;
    if (data !== null && Object.keys(data).length !== 0) {
      throw new Error(`Expected null for anonymous session, got ${JSON.stringify(data)}`);
    }
  });

  // 10. Social OAuth Sign-In Init
  await runTest("10. Social OAuth Sign-In Init (POST /api/auth/sign-in/social)", async () => {
    const res = await fetch(`${LOCAL_URL}/api/auth/sign-in/social`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "google",
        callbackURL: `${FRONTEND_ORIGIN}/blogs`
      })
    });
    if (res.status !== 200) {
      const txt = await res.text();
      throw new Error(`Expected HTTP 200, got ${res.status}: ${txt}`);
    }
    const data = await res.json() as any;
    if (!data.url || !data.url.includes("accounts.google.com")) {
      throw new Error("Invalid OAuth response URL");
    }
  });

  // 11. XML Sitemap Generation
  await runTest("11. XML Sitemap Generation (GET /sitemap.xml)", async () => {
    const res = await fetch(`${LOCAL_URL}/sitemap.xml`, { headers });
    if (res.status !== 200) {
      const txt = await res.text();
      throw new Error(`Expected HTTP 200, got ${res.status}: ${txt}`);
    }
    const text = await res.text();
    if (!text.includes("<urlset") || !text.includes("<loc>")) throw new Error("Invalid XML sitemap output");
  });

  // 12. Unauthorized Protected Route Failure Test
  await runTest("12. Protected Route Unauthorized Failure (GET /api/v1/blog/mine)", async () => {
    const res = await fetch(`${LOCAL_URL}/api/v1/blog/mine`, { headers });
    if (res.status !== 401) {
      const txt = await res.text();
      throw new Error(`Expected HTTP 401 Unauthorized, got ${res.status}: ${txt}`);
    }
  });

  // 13. Invalid Validation Failure Test
  await runTest("13. Article Creation Validation Failure (POST /api/v1/blog)", async () => {
    const res = await fetch(`${LOCAL_URL}/api/v1/blog`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ title: "" })
    });
    if (res.status !== 401) {
      const txt = await res.text();
      throw new Error(`Expected HTTP 401 Unauthorized without token, got ${res.status}: ${txt}`);
    }
  });

  // Final Summary Report
  console.log(`\n================================================================`);
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  console.log(`📊 LOCAL INTEGRATION TEST SUMMARY: ${passedCount}/${totalCount} TESTS PASSED`);
  console.log(`================================================================\n`);

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

main().catch(console.error);
