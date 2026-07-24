import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";
import { getPrisma } from "./prisma";

export const createAuth = (
  env: { DATABASE_URL: string; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; BETTER_AUTH_URL: string },
  requestOrigin?: string
) => {
  const prisma = getPrisma(env.DATABASE_URL);

  const origins = [
    "http://localhost:5173",
    "http://localhost:8787",
    "https://blog.techwithmahe.com",
    "https://devloom.vercel.app",
    "https://devloom-frontend.vercel.app",
  ];

  if (requestOrigin) {
    try {
      const url = new URL(requestOrigin);
      const originStr = url.origin;
      if (!origins.includes(originStr) && (originStr.endsWith(".vercel.app") || originStr.startsWith("http://localhost"))) {
        origins.push(originStr);
      }
    } catch (e) {
      // ignore
    }
  }

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
    baseURL: env.BETTER_AUTH_URL || "https://backend-cloudflare-worker.chmahesh997.workers.dev",
    trustedOrigins: origins,
    advanced: {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
      },
    },
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
                avatarUrl: user.image || user.avatarUrl,
              },
            };
          },
        },
      },
    },
  });
};
