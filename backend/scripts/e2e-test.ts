export {};
const BASE_URL = process.env.BACKEND_URL || "https://backend-cloudflare-worker.chmahesh997.workers.dev";
const FRONTEND_ORIGIN = "https://blog.techwithmahe.com";

interface TestResult {
  name: string;
  passed: boolean;
  durationMs: number;
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
  console.log(`\n======================================================`);
  console.log(`🚀 STARTING END-TO-END (E2E) PRODUCTION TEST SUITE`);
  console.log(`Target Backend: ${BASE_URL}`);
  console.log(`Target Frontend Origin: ${FRONTEND_ORIGIN}`);
  console.log(`======================================================\n`);

  // 1. Test CORS Options Preflight
  await runTest("1. CORS Preflight (OPTIONS /api/v1/blog/bulk)", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/blog/bulk`, {
      method: "OPTIONS",
      headers: { Origin: FRONTEND_ORIGIN }
    });
    if (res.status !== 204) {
      const txt = await res.text();
      throw new Error(`Expected HTTP 204, got ${res.status}: ${txt}`);
    }
    const allowOrigin = res.headers.get("access-control-allow-origin");
    if (allowOrigin !== FRONTEND_ORIGIN) {
      throw new Error(`CORS header mismatch: expected ${FRONTEND_ORIGIN}, got ${allowOrigin}`);
    }
  });

  // 2. Test Public Articles Feed (Page 1)
  let testArticleSlug = "";
  let testArticleId = 0;
  let testAuthorHandle = "";

  await runTest("2. Public Feed (GET /api/v1/blog/bulk)", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/blog/bulk`, {
      headers: { Origin: FRONTEND_ORIGIN }
    });
    if (res.status !== 200) {
      const txt = await res.text();
      throw new Error(`Expected HTTP 200, got ${res.status}: ${txt}`);
    }
    const data = await res.json() as any;
    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error("Invalid response format: missing articles array");
    }
    if (data.articles.length === 0) throw new Error("Feed returned 0 articles");
    
    const firstBlog = data.articles[0];
    testArticleSlug = firstBlog.slug;
    testArticleId = firstBlog.id;
    testAuthorHandle = firstBlog.author?.handle;
  });

  // 3. Test Feed Search Query Filtering
  await runTest("3. Feed Keyword Search (GET /api/v1/blog/bulk?q=react)", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/blog/bulk?q=react`, {
      headers: { Origin: FRONTEND_ORIGIN }
    });
    if (res.status !== 200) {
      const txt = await res.text();
      throw new Error(`Expected HTTP 200, got ${res.status}: ${txt}`);
    }
    const data = await res.json() as any;
    if (!data.articles || data.articles.length === 0) {
      throw new Error("Search for 'react' returned 0 results");
    }
  });

  // 4. Test Feed Tag Filtering
  await runTest("4. Feed Tag Filter (GET /api/v1/blog/bulk?tag=postgres)", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/blog/bulk?tag=postgres`, {
      headers: { Origin: FRONTEND_ORIGIN }
    });
    if (res.status !== 200) {
      const txt = await res.text();
      throw new Error(`Expected HTTP 200, got ${res.status}: ${txt}`);
    }
    const data = await res.json() as any;
    if (!data.articles || data.articles.length === 0) {
      throw new Error("Tag filter for 'postgres' returned 0 results");
    }
  });

  // 5. Test Single Article Details by Slug
  await runTest(`5. Article Detail by Slug (GET /api/v1/blog/${testArticleSlug})`, async () => {
    if (!testArticleSlug) throw new Error("No article slug available from feed test");
    const res = await fetch(`${BASE_URL}/api/v1/blog/${testArticleSlug}`, {
      headers: { Origin: FRONTEND_ORIGIN }
    });
    if (res.status !== 200) {
      const txt = await res.text();
      throw new Error(`Expected HTTP 200, got ${res.status}: ${txt}`);
    }
    const data = await res.json() as any;
    if (!data.title || !data.content) {
      throw new Error("Article body missing title or full markdown content");
    }
  });

  // 6. Test Related Articles Endpoint
  await runTest(`6. Related Articles (GET /api/v1/blog/${testArticleSlug}/related)`, async () => {
    const res = await fetch(`${BASE_URL}/api/v1/blog/${testArticleSlug}/related`, {
      headers: { Origin: FRONTEND_ORIGIN }
    });
    if (res.status !== 200) {
      const txt = await res.text();
      throw new Error(`Expected HTTP 200, got ${res.status}: ${txt}`);
    }
    const data = await res.json() as any;
    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error("Related articles response missing articles array");
    }
  });

  // 7. Test Author Profile Endpoint
  await runTest(`7. Public Author Profile (GET /api/v1/authors/${testAuthorHandle})`, async () => {
    if (!testAuthorHandle) throw new Error("No author handle available");
    const res = await fetch(`${BASE_URL}/api/v1/authors/${testAuthorHandle}`, {
      headers: { Origin: FRONTEND_ORIGIN }
    });
    if (res.status !== 200) {
      const txt = await res.text();
      throw new Error(`Expected HTTP 200, got ${res.status}: ${txt}`);
    }
    const data = await res.json() as any;
    if (!data.author || !data.articles) {
      throw new Error("Author response missing author profile or articles");
    }
  });

  // 8. Test Social OAuth Initialization Endpoint
  await runTest("8. OAuth Sign-In Init (POST /api/auth/sign-in/social)", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/sign-in/social`, {
      method: "POST",
      headers: { Origin: FRONTEND_ORIGIN, "Content-Type": "application/json" },
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
      throw new Error("Social sign-in did not return valid Google OAuth redirect URL");
    }
    const setCookie = res.headers.get("set-cookie") || "";
    if (!setCookie.includes("better-auth.state")) {
      throw new Error("OAuth sign-in response missing better-auth.state cookie");
    }
  });

  // 9. Test Unauthenticated Session Status
  await runTest("9. Session Check Unauthenticated (GET /api/auth/get-session)", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/get-session`, {
      headers: { Origin: FRONTEND_ORIGIN }
    });
    if (res.status !== 200) {
      const txt = await res.text();
      throw new Error(`Expected HTTP 200, got ${res.status}: ${txt}`);
    }
    const data = await res.json() as any;
    if (data !== null && Object.keys(data).length !== 0) {
      throw new Error(`Expected null session for anonymous request, got: ${JSON.stringify(data)}`);
    }
  });

  // 10. Test XML Sitemap Generation
  await runTest("10. XML Sitemap Generation (GET /sitemap.xml)", async () => {
    const res = await fetch(`${BASE_URL}/sitemap.xml`);
    if (res.status !== 200) {
      const txt = await res.text();
      throw new Error(`Expected HTTP 200, got ${res.status}: ${txt}`);
    }
    const text = await res.text();
    if (!text.includes("<urlset") || !text.includes("<loc>")) {
      throw new Error("Sitemap XML output invalid or missing <urlset> tags");
    }
  });

  // Final Summary Report
  console.log(`\n======================================================`);
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  console.log(`📊 E2E TEST SUMMARY: ${passedCount}/${totalCount} TESTS PASSED`);
  console.log(`======================================================\n`);

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

main().catch(console.error);
