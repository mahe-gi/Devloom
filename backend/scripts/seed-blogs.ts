import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const articlesData = [
  {
    title: "Building High-Throughput Distributed Systems with Cloudflare Workers and PostgreSQL",
    summary: "An architectural guide on configuring edge compute runtimes with serverless database pools to achieve sub-50ms global latency.",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    tags: ["system-design", "cloudflare", "postgres", "architecture"],
    content: `## The Evolution of Edge Compute

Edge computing has shifted the topology of modern web applications. By running code physically closer to users in hundreds of PoPs (Points of Presence) worldwide, we eliminate round-trip latency to centralized data centers.

### Edge Database Connection Pooling

One challenge when pairing serverless Workers with traditional SQL databases is connection limits. Postgres handles standard client connections via dedicated processes, which consumes memory quickly under burst load.

\`\`\`ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

export const getPrisma = (datasourceUrl: string) => {
  const pool = new pg.Pool({ connectionString: datasourceUrl });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};
\`\`\`

### Performance Metrics

- **TTFB (Time to First Byte):** 28ms (Global Median)
- **Database Query Latency:** 12ms (via Connection Pooler)
- **Total Request Duration:** < 45ms

By pairing Cloudflare Workers with direct connection pooling, application response times scale linearly without degrading database stability.`
  },
  {
    title: "Mastering React 19: A Deep Dive into Concurrent UI Architecture",
    summary: "Exploring server components, actions, and automatic memoization in the latest React 19 ecosystem.",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80",
    tags: ["react", "frontend", "javascript", "webdev"],
    content: `## What's New in React 19

React 19 introduces groundbreaking paradigm shifts in state synchronization, component rendering, and compiler optimizations.

### Actions & Server Functions

Form submissions and mutations no longer require manual state management or verbose loading flags:

\`\`\`tsx
import { useActionState } from "react";

async function updateProfile(prevState: any, formData: FormData) {
  const name = formData.get("name");
  const res = await api.updateUser({ name });
  return res.data;
}

export function ProfileForm() {
  const [state, formAction, isPending] = useActionState(updateProfile, null);

  return (
    <form action={formAction}>
      <input name="name" defaultValue={state?.name} />
      <button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
\`\`\`

### Summary of Benefits

1. **Automatic Memoization:** The React Compiler eliminates manual \`useMemo\` and \`useCallback\` boilerplate.
2. **Simplified Hydration:** Server Components stream directly without duplicate JavaScript payload overhead.`
  },
  {
    title: "Optimizing Database Indexes in PostgreSQL: From B-Trees to GiST & GIN",
    summary: "Learn how query execution plans work under the hood and how to pick the optimal indexing strategy for complex queries.",
    coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80",
    tags: ["postgres", "database", "performance", "backend"],
    content: `## Deep Dive into Index Structures

Indexing is the single most effective tool for optimizing relational database query performance. However, applying indexes blindly can degrade write throughput.

### Index Types Compared

| Index Type | Primary Use Case | Time Complexity |
|------------|------------------|-----------------|
| **B-Tree** | Equality & range queries (\`=\`, \`<\`, \`>\`) | O(log N) |
| **GIN** | Full-text search, JSONB, Arrays | O(log N) lookup |
| **GiST** | Geometric data, Range types, Nearest neighbor | O(log N) average |

### Analyzing Query Plans with EXPLAIN ANALYZE

\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM "Blog"
WHERE "published" = true
  AND "createdAt" >= '2026-01-01'
ORDER BY "publishedAt" DESC
LIMIT 10;
\`\`\`

Using compound indexes covering \`(published, publishedAt DESC, id)\` allows PostgreSQL to perform an **Index Only Scan**, avoiding table heap lookups altogether.`
  },
  {
    title: "Designing Zero-Trust Security for Edge APIs with OAuth 2.0 & OpenID Connect",
    summary: "How to implement cryptographic token validation, SameSite cookie topology, and identity conflict resolution.",
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    tags: ["security", "oauth", "architecture", "webdev"],
    content: `## Zero-Trust API Architecture

Zero-trust models assume that local networks are untrusted by default. Every API request must be authenticated, authorized, and cryptographically verified.

### Cookie Topology & Cross-Site Protection

Using HTTP-only SameSite cookies protects sessions against Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF).

\`\`\`ts
// Strict CORS configuration
app.use("/*", cors({
  origin: ["http://localhost:5173", "https://blog.techwithmahe.com"],
  credentials: true,
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));
\`\`\`

### Best Practices

- Always set \`HttpOnly\`, \`Secure\`, and \`SameSite=Lax\` (or \`Strict\`) on authentication cookies.
- Validate JWT signature keys using public JWKS endpoints.
- Enforce strict identity conflict policies when dual token topologies coexist.`
  },
  {
    title: "How Vector Embeddings and RAG Architecture Power Next-Gen AI Applications",
    summary: "A practical guide to implementing Retrieval-Augmented Generation using vector databases and LLMs.",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80",
    tags: ["ai", "llm", "vector-db", "system-design"],
    content: `## Introduction to RAG Systems

Retrieval-Augmented Generation (RAG) grounds Large Language Models with authoritative external domain data, dramatically reducing hallucinations.

### Semantic Search Workflow

1. Convert raw text documents into high-dimensional vector embeddings.
2. Store vector representations in a spatial index (e.g. pgvector or HNSW).
3. Compute cosine similarity between user prompt embeddings and stored vectors.
4. Pass top matches into context window for LLM inference.

\`\`\`python
import numpy as np

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
\`\`\`

RAG enables realtime knowledge updates without retraining or fine-tuning expensive foundational models.`
  },
  {
    title: "Type-Safe Full-Stack Development with TypeScript 5.5 and Prisma ORM",
    summary: "Eliminate runtime boundary bugs using shared Zod schemas, inferred types, and end-to-end type inference.",
    coverImage: "https://images.unsplash.com/photo-1516116211223-48a1255258a6?auto=format&fit=crop&w=1200&q=80",
    tags: ["typescript", "prisma", "webdev", "fullstack"],
    content: `## The Power of Shared Type Schemas

In a monorepo architecture, sharing input validation schemas between backend APIs and frontend forms guarantees total type safety across HTTP boundaries.

### Shared Monorepo Package

\`\`\`ts
// common/src/index.ts
import { z } from "zod";

export const createBlogInput = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10),
  summary: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateBlogInput = z.infer<typeof createBlogInput>;
\`\`\`

### Key Takeaways

- Single source of truth for payload definitions.
- Instant autocompletion in frontend forms and backend handlers.
- Catch runtime payload mismatches at compile time.`
  },
  {
    title: "Demystifying Event-Driven Architecture with Kafka and Microservices",
    summary: "Understanding message brokers, partition keys, consumer groups, and idempotency in distributed event streams.",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    tags: ["microservices", "kafka", "system-design", "backend"],
    content: `## Why Event-Driven Architecture?

Synchronous REST APIs create tight coupling between services. Event-driven architectures decouple producers from consumers, boosting fault tolerance and scalability.

### Partitioning & Idempotency

When streaming high-volume events, ordering guarantees are maintained within individual partition keys:

\`\`\`json
{
  "eventId": "evt_998124",
  "eventType": "ARTICLE_PUBLISHED",
  "aggregateId": "blog_104",
  "payload": {
    "title": "Demystifying Event-Driven Architecture",
    "authorId": "user_42"
  },
  "timestamp": "2026-07-24T20:00:00Z"
}
\`\`\`

Using unique \`eventId\` deduplication keys ensures consumers handle replayed messages idempotently.`
  },
  {
    title: "Modern CSS Architecture: Tailwind CSS v4 vs Vanilla CSS in Production",
    summary: "An in-depth analysis of dynamic theme tokens, build performance, and CSS container queries.",
    coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    tags: ["css", "frontend", "webdev", "tailwind"],
    content: `## The Modern CSS Ecosystem

Tailwind CSS v4 introduces a streamlined engine built directly on LightningCSS, drastically speeding up build times and native HMR updates.

### Dynamic Design System Tokens

\`\`\`css
@import "tailwindcss";

@theme {
  --color-primary: #0066ff;
  --color-surface: #ffffff;
  --font-display: 'Inter', sans-serif;
}
\`\`\`

Container queries enable components to respond fluidly to their immediate container size rather than fixed viewport breakpoints.`
  },
  {
    title: "Building Scalable Real-Time Applications with WebSockets and Redis Pub/Sub",
    summary: "Architecting persistent connections across horizontally scaled node processes with Redis backplane.",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    tags: ["websockets", "redis", "node", "backend"],
    content: `## Real-Time Communication at Scale

A single server can maintain thousands of open WebSocket connections. But when scaling across multiple instances, messages must be broadcast seamlessly.

### Redis Pub/Sub Backplane

\`\`\`ts
import { createClient } from "redis";

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

await pubClient.connect();
await subClient.connect();

subClient.subscribe("article_updates", (message) => {
  const data = JSON.parse(message);
  broadcastToConnectedClients(data);
});
\`\`\`

This architecture allows client WebSocket connections to land on any backend pod while receiving real-time global state updates.`
  },
  {
    title: "Node.js Event Loop Deep Dive: Asynchronous I/O and Performance Tuning",
    summary: "Understanding microtasks, macrotasks, libuv threadpool execution, and CPU profiling.",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    tags: ["nodejs", "performance", "javascript", "backend"],
    content: `## Understanding the Node.js Event Loop

Node.js executes JavaScript on a single thread using non-blocking I/O primitives delegated to \`libuv\`.

### Event Loop Phases

1. **Timers:** Executes callbacks scheduled by \`setTimeout\` and \`setInterval\`.
2. **Pending Callbacks:** Executes I/O callbacks deferred to the next iteration.
3. **Poll:** Retrieves new I/O events and executes node I/O scripts.
4. **Check:** Executes \`setImmediate\` callbacks.
5. **Close Callbacks:** Executes socket close handlers.

Avoid blocking the main thread with heavy compute loops; offload CPU-intensive workloads to Worker Threads or native C++ add-ons.`
  },
  {
    title: "Kubernetes for Frontend Engineers: Containers, Ingress, and CI/CD Pipelines",
    summary: "Demystifying container deployment, ingress controllers, TLS certificates, and zero-downtime rollouts.",
    coverImage: "https://images.unsplash.com/photo-1667372335854-c0727405280b?auto=format&fit=crop&w=1200&q=80",
    tags: ["devops", "docker", "kubernetes", "architecture"],
    content: `## Demystifying K8s Deployment Manifests

Container orchestrators automate deployment, health monitoring, and dynamic scaling of web applications.

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: devloom-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: devloom-frontend
  template:
    metadata:
      labels:
        app: devloom-frontend
    spec:
      containers:
      - name: frontend
        image: devloom/frontend:v1.2.0
        ports:
        - containerPort: 80
\`\`\`

Rolling update deployment strategies ensure zero downtime during production updates.`
  },
  {
    title: "Rust for Web Developers: Writing Blazing Fast WebAssembly Modules",
    summary: "How to compile high-performance Rust algorithms into WebAssembly modules for browser execution.",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    tags: ["rust", "webassembly", "performance", "webdev"],
    content: `## Why Rust + WebAssembly?

WebAssembly (Wasm) delivers near-native computational performance inside browser engines, ideal for image manipulation, crypto validation, and heavy data processing.

\`\`\`rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
export fn compute_hash(data: &str) -> String {
    format!("{:x}", md5::compute(data))
}
\`\`\`

Using \`wasm-pack\`, Rust packages compile into standard NPM modules that integrate directly into Vite or Next.js projects.`
  }
];

async function main() {
  console.log("Seeding realistic blog posts into database...");

  // Get all users
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.error("No users found in database! Please sign up first.");
    return;
  }

  // Backfill handles for authors if missing
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if (!user.handle) {
      const suggestedHandle = user.email.split("@")[0].replace(/[^a-z0-9]/g, "");
      await prisma.user.update({
        where: { id: user.id },
        data: {
          handle: suggestedHandle,
          name: user.name || `Developer ${i + 1}`,
          bio: "Full-stack engineer crafting high performance systems and elegant UI components.",
          avatarUrl: user.avatarUrl || user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
        }
      });
    }
  }

  // Refresh updated users
  const updatedUsers = await prisma.user.findMany();

  // Create blogs
  let count = 0;
  for (let i = 0; i < articlesData.length; i++) {
    const art = articlesData[i];
    const author = updatedUsers[i % updatedUsers.length];

    // Generate unique slug
    const baseSlug = art.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    
    // Process tags
    const tagConnects = [];
    for (const tagName of art.tags) {
      const tagSlug = tagName.toLowerCase();
      const tag = await prisma.tag.upsert({
        where: { slug: tagSlug },
        update: {},
        create: { name: tagName, slug: tagSlug },
      });
      tagConnects.push({ tagId: tag.id });
    }

    // Days offset to stagger publication dates
    const daysAgo = (articlesData.length - i) * 2;
    const publishedDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    const existingBlog = await prisma.blog.findUnique({ where: { slug: baseSlug } });
    if (!existingBlog) {
      await prisma.blog.create({
        data: {
          title: art.title,
          slug: baseSlug,
          summary: art.summary,
          content: art.content,
          coverImage: art.coverImage,
          published: true,
          publishedAt: publishedDate,
          createdAt: publishedDate,
          authorId: author.id,
          tags: {
            create: tagConnects
          }
        }
      });
      count++;
    }
  }

  console.log(`Successfully seeded ${count} technical blog posts!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
