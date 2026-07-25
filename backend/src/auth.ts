import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI, bearer } from "better-auth/plugins";
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

  const isLocal = env.BETTER_AUTH_URL?.includes("localhost") || false;

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
      bearer(),
    ],
    baseURL: env.BETTER_AUTH_URL || "http://localhost:8787",
    trustedOrigins: origins,
    advanced: {
      defaultCookieAttributes: {
        sameSite: isLocal ? "lax" : "none",
        secure: !isLocal,
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
