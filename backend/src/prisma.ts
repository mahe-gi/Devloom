import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";
import pg from "pg";

let acceleratePrisma: PrismaClient | undefined;
let globalPrisma: PrismaClient | undefined;

export const getPrisma = (datasourceUrl?: string): PrismaClient => {
  const url = (typeof datasourceUrl === "string" && datasourceUrl.trim()) ? datasourceUrl.trim() : (process.env.DATABASE_URL || "");
  
  if (url && (url.startsWith("prisma://") || url.startsWith("prisma+postgres://"))) {
    if (acceleratePrisma) return acceleratePrisma;
    acceleratePrisma = new PrismaClient({ datasourceUrl: url }).$extends(withAccelerate()) as unknown as PrismaClient;
    return acceleratePrisma;
  }

  if (globalPrisma) return globalPrisma;

  const pool = new pg.Pool({ connectionString: url });
  const adapter = new PrismaPg(pool);
  globalPrisma = new PrismaClient({ adapter });
  return globalPrisma;
};
