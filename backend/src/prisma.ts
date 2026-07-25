import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";
import pg from "pg";

let acceleratePrisma: PrismaClient | undefined;

const DEFAULT_DB_URL = "postgresql://postgres:postgres@127.0.0.1:5432/blog?schema=public";

export const getPrisma = (datasourceUrl?: string): PrismaClient => {
  const url = (typeof datasourceUrl === "string" && datasourceUrl.trim()) 
    ? datasourceUrl.trim() 
    : (process.env.DATABASE_URL || DEFAULT_DB_URL);
  
  if (url && (url.startsWith("prisma://") || url.startsWith("prisma+postgres://"))) {
    if (acceleratePrisma) return acceleratePrisma;
    acceleratePrisma = new PrismaClient({ datasourceUrl: url }).$extends(withAccelerate()) as unknown as PrismaClient;
    return acceleratePrisma;
  }

  const pool = new pg.Pool({
    connectionString: url,
    max: 10,
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 5000,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};
