import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";
import pg from "pg";

let acceleratePrisma: PrismaClient | undefined;

export const getPrisma = (datasourceUrl?: string): PrismaClient => {
  let url = (typeof datasourceUrl === "string" && datasourceUrl.trim()) 
    ? datasourceUrl.trim() 
    : (process.env.DATABASE_URL || "");

  if (url && (url.startsWith("prisma://") || url.startsWith("prisma+postgres://"))) {
    if (acceleratePrisma) return acceleratePrisma;
    acceleratePrisma = new PrismaClient({ datasourceUrl: url }).$extends(withAccelerate()) as unknown as PrismaClient;
    return acceleratePrisma;
  }

  if (url && url.includes("neon.tech") && !url.includes("sslmode=")) {
    url += (url.includes("?") ? "&" : "?") + "sslmode=require&connect_timeout=10";
  }

  const pool = new pg.Pool({
    connectionString: url,
    max: 1,
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 5000,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};
