import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP, openAPI } from "better-auth/plugins";
import { getPrisma } from "./prisma";
import bcrypt from "bcryptjs";
// We'll pass the dynamic prisma client in context later if needed, but for now Better Auth requires a stable adapter.
// Wait, Cloudflare Workers require prisma to be instantiated per request if bound via environment. 
// However, Better Auth allows a callback or a pre-initialized adapter.
// We can export a function that initializes Auth with the environment DATABASE_URL.
export const createAuth = (databaseUrl) => {
    const prisma = getPrisma(databaseUrl);
    return betterAuth({
        database: prismaAdapter(prisma, {
            provider: "postgresql", // We set postgresql here because production is PG
        }),
        emailAndPassword: {
            enabled: true,
            password: {
                hash: async (password) => {
                    return await bcrypt.hash(password, 10);
                },
                verify: async ({ hash, password }) => {
                    return await bcrypt.compare(password, hash);
                }
            }
        },
        socialProviders: {
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID || "",
                clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            },
        },
        plugins: [
            emailOTP({
                async sendVerificationOTP({ email, otp, type }) {
                    console.log(`[EmailOTP] Sending ${otp} to ${email} for ${type}`);
                    // Replace this with real Resend API call in production
                    /*
                    await fetch('https://api.resend.com/emails', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        from: process.env.EMAIL_FROM || 'auth@techwithmahe.com',
                        to: email,
                        subject: `Your OTP is ${otp}`,
                        html: `<p>Your verification code is <strong>${otp}</strong></p>`
                      })
                    });
                    */
                },
                expiresIn: 600, // 10 minutes
            }),
            openAPI(),
        ],
        baseURL: process.env.BETTER_AUTH_URL || "https://api.techwithmahe.com",
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
                    before: async (user) => {
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
