import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { openAPI } from "better-auth/plugins";
import { getPrisma } from "./prisma";

// We'll pass the dynamic prisma client in context later if needed, but for now Better Auth requires a stable adapter.
// Wait, Cloudflare Workers require prisma to be instantiated per request if bound via environment. 
// However, Better Auth allows a callback or a pre-initialized adapter.
// We can export a function that initializes Auth with the environment DATABASE_URL.

export const createAuth = (env: { DATABASE_URL: string, GOOGLE_CLIENT_ID: string, GOOGLE_CLIENT_SECRET: string, BETTER_AUTH_URL: string }) => {
  const prisma = getPrisma(env.DATABASE_URL);
  return betterAuth({
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID || "",
        clientSecret: env.GOOGLE_CLIENT_SECRET || "",
      },
    },
    plugins: [
      openAPI(),
    ],
    baseURL: env.BETTER_AUTH_URL || "https://api.techwithmahe.com",
    trustedOrigins: [
      "http://localhost:5173",
      "https://blog.techwithmahe.com"
    ],
    user: {
      additionalFields: {
        username: {
          type: "string",
          required: false,
        }
      }
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user: any) => {
            return {
              data: {
                ...user,
                username: user.email,
              },
            };
          },
        },
      },
    },
  });
};
