import { Hono } from "hono";
import { getPrisma } from "../prisma";

export const seedRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
}>();

const articlesData = [
  {
    title: "Building High-Throughput Distributed Systems with Cloudflare Workers and PostgreSQL",
    summary: "An architectural guide on configuring edge compute runtimes with serverless database pools to achieve sub-50ms global latency.",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    tags: ["system-design", "cloudflare", "postgres", "architecture"],
    content: `## The Evolution of Edge Compute\n\nEdge computing has shifted the topology of modern web applications. By running code physically closer to users in hundreds of PoPs (Points of Presence) worldwide, we eliminate round-trip latency to centralized data centers.`
  },
  {
    title: "Mastering React 19: A Deep Dive into Concurrent UI Architecture",
    summary: "Exploring server components, actions, and automatic memoization in the latest React 19 ecosystem.",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80",
    tags: ["react", "frontend", "javascript", "webdev"],
    content: `## What's New in React 19\n\nReact 19 introduces groundbreaking paradigm shifts in state synchronization, component rendering, and compiler optimizations.`
  },
  {
    title: "Optimizing Database Indexes in PostgreSQL: From B-Trees to GiST & GIN",
    summary: "Learn how query execution plans work under the hood and how to pick the optimal indexing strategy for complex queries.",
    coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80",
    tags: ["postgres", "database", "performance", "backend"],
    content: `## Deep Dive into Index Structures\n\nIndexing is the single most effective tool for optimizing relational database query performance.`
  },
  {
    title: "Designing Zero-Trust Security for Edge APIs with OAuth 2.0 & OpenID Connect",
    summary: "How to implement cryptographic token validation, SameSite cookie topology, and identity conflict resolution.",
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    tags: ["security", "oauth", "architecture", "webdev"],
    content: `## Zero-Trust API Architecture\n\nZero-trust models assume that local networks are untrusted by default.`
  },
  {
    title: "How Vector Embeddings and RAG Architecture Power Next-Gen AI Applications",
    summary: "A practical guide to implementing Retrieval-Augmented Generation using vector databases and LLMs.",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80",
    tags: ["ai", "llm", "vector-db", "system-design"],
    content: `## Introduction to RAG Systems\n\nRetrieval-Augmented Generation (RAG) grounds Large Language Models with authoritative external domain data.`
  },
  {
    title: "Type-Safe Full-Stack Development with TypeScript 5.5 and Prisma ORM",
    summary: "Eliminate runtime boundary bugs using shared Zod schemas, inferred types, and end-to-end type inference.",
    coverImage: "https://images.unsplash.com/photo-1516116211223-48a1255258a6?auto=format&fit=crop&w=1200&q=80",
    tags: ["typescript", "prisma", "webdev", "fullstack"],
    content: `## The Power of Shared Type Schemas\n\nIn a monorepo architecture, sharing input validation schemas between backend APIs and frontend forms guarantees total type safety.`
  },
  {
    title: "Demystifying Event-Driven Architecture with Kafka and Microservices",
    summary: "Understanding message brokers, partition keys, consumer groups, and idempotency in distributed event streams.",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    tags: ["microservices", "kafka", "system-design", "backend"],
    content: `## Why Event-Driven Architecture?\n\nSynchronous REST APIs create tight coupling between services.`
  },
  {
    title: "Modern CSS Architecture: Tailwind CSS v4 vs Vanilla CSS in Production",
    summary: "An in-depth analysis of dynamic theme tokens, build performance, and CSS container queries.",
    coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    tags: ["css", "frontend", "webdev", "tailwind"],
    content: `## The Modern CSS Ecosystem\n\nTailwind CSS v4 introduces a streamlined engine built directly on LightningCSS.`
  },
  {
    title: "Building Scalable Real-Time Applications with WebSockets and Redis Pub/Sub",
    summary: "Architecting persistent connections across horizontally scaled node processes with Redis backplane.",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    tags: ["websockets", "redis", "node", "backend"],
    content: `## Real-Time Communication at Scale\n\nA single server can maintain thousands of open WebSocket connections.`
  },
  {
    title: "Node.js Event Loop Deep Dive: Asynchronous I/O and Performance Tuning",
    summary: "Understanding microtasks, macrotasks, libuv threadpool execution, and CPU profiling.",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    tags: ["nodejs", "performance", "javascript", "backend"],
    content: `## Understanding the Node.js Event Loop\n\nNode.js executes JavaScript on a single thread using non-blocking I/O primitives.`
  },
  {
    title: "Kubernetes for Frontend Engineers: Containers, Ingress, and CI/CD Pipelines",
    summary: "Demystifying container deployment, ingress controllers, TLS certificates, and zero-downtime rollouts.",
    coverImage: "https://images.unsplash.com/photo-1667372335854-c0727405280b?auto=format&fit=crop&w=1200&q=80",
    tags: ["devops", "docker", "kubernetes", "architecture"],
    content: `## Demystifying K8s Deployment Manifests\n\nContainer orchestrators automate deployment and scaling.`
  },
  {
    title: "Rust for Web Developers: Writing Blazing Fast WebAssembly Modules",
    summary: "How to compile high-performance Rust algorithms into WebAssembly modules for browser execution.",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    tags: ["rust", "webassembly", "performance", "webdev"],
    content: `## Why Rust + WebAssembly?\n\nWebAssembly delivers near-native computational performance.`
  }
];

seedRouter.get("/", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  try {
    let users = await prisma.user.findMany();
    if (users.length === 0) {
      // Create seed user if none exists
      const dummyUser = await prisma.user.create({
        data: {
          email: "chmahesh997@gmail.com",
          username: "chmahesh997@gmail.com",
          name: "Mahesh Ch",
          handle: "chmahesh997",
          bio: "Full-stack engineer crafting high performance systems and elegant UI components.",
          avatarUrl: "https://lh3.googleusercontent.com/a/ACg8ocK3cCLSmWmkAaa7DOS3m4UYXEYKGahEErpFoKU1tBR8zscekvrGGw=s96-c",
          image: "https://lh3.googleusercontent.com/a/ACg8ocK3cCLSmWmkAaa7DOS3m4UYXEYKGahEErpFoKU1tBR8zscekvrGGw=s96-c"
        }
      });
      users = [dummyUser];
    }

    // Backfill handles for users
    for (let i = 0; i < users.length; i++) {
      const u = users[i];
      if (!u.handle) {
        const suggestedHandle = u.email ? u.email.split("@")[0].replace(/[^a-z0-9]/g, "") : `author${i+1}`;
        await prisma.user.update({
          where: { id: u.id },
          data: {
            handle: suggestedHandle,
            avatarUrl: u.avatarUrl || u.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
          }
        });
      }
    }

    const updatedUsers = await prisma.user.findMany();
    let seededCount = 0;

    for (let i = 0; i < articlesData.length; i++) {
      const art = articlesData[i];
      const author = updatedUsers[i % updatedUsers.length];
      const baseSlug = art.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

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

      const daysAgo = (articlesData.length - i) * 2;
      const publishedDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

      const existing = await prisma.blog.findFirst({ where: { slug: baseSlug } });
      if (!existing) {
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
        seededCount++;
      }
    }

    return c.json({ success: true, seededCount, totalUsers: updatedUsers.length });
  } catch (err: any) {
    console.error("Seed database error:", err);
    return c.json({ error: err?.message || String(err) }, 500);
  }
});
