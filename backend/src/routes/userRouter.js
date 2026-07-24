import { verify } from "hono/jwt";
import { Hono } from "hono";
import { getPrisma } from "../prisma";
export const userRouter = new Hono();
import { createAuth } from "../auth";
userRouter.post("/me", async (c) => {
    const auth = createAuth(c.env.DATABASE_URL);
    // 1. Check Better Auth Session
    const sessionData = await auth.api.getSession({ headers: c.req.raw.headers });
    const betterAuthUserId = sessionData?.user?.id;
    // 2. Check Legacy JWT
    const authHeader = c.req.header("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
    let legacyUserId = null;
    if (token) {
        try {
            const payload = await verify(token, c.env.JWT_SECRET, "HS256");
            if (payload && payload.id)
                legacyUserId = String(payload.id);
        }
        catch (err) { }
    }
    // 3. Evaluate Conflict Policy
    if (betterAuthUserId && legacyUserId && betterAuthUserId.toString() !== legacyUserId.toString()) {
        c.status(409);
        return c.json({ error: "AUTH_IDENTITY_CONFLICT", message: "Conflicting authentications." });
    }
    const finalUserId = betterAuthUserId || legacyUserId;
    if (!finalUserId) {
        c.status(401);
        return c.json({ error: "Token not provided or invalid" });
    }
    try {
        const prisma = getPrisma(c.env.DATABASE_URL);
        const user = await prisma.user.findUnique({
            where: { id: Number(finalUserId) },
            select: {
                id: true,
                name: true,
                username: true,
                handle: true,
                bio: true,
                avatarUrl: true,
            },
        });
        if (!user) {
            c.status(404);
            return c.json({ error: "User not found" });
        }
        c.status(200);
        return c.json({ user });
    }
    catch (e) {
        c.status(500);
        return c.json({ error: "Internal server error" });
    }
});
import { updateProfileInput } from "@mahe-npm/common";
userRouter.put("/profile", async (c) => {
    const auth = createAuth(c.env.DATABASE_URL);
    // 1. Check Better Auth Session
    const sessionData = await auth.api.getSession({ headers: c.req.raw.headers });
    const betterAuthUserId = sessionData?.user?.id;
    // 2. Check Legacy JWT
    const authHeader = c.req.header("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
    let legacyUserId = null;
    if (token) {
        try {
            const payload = await verify(token, c.env.JWT_SECRET, "HS256");
            if (payload && payload.id)
                legacyUserId = String(payload.id);
        }
        catch (err) { }
    }
    // 3. Evaluate Conflict Policy
    if (betterAuthUserId && legacyUserId && betterAuthUserId.toString() !== legacyUserId.toString()) {
        c.status(409);
        return c.json({ error: "AUTH_IDENTITY_CONFLICT", message: "Conflicting authentications." });
    }
    const finalUserId = betterAuthUserId || legacyUserId;
    if (!finalUserId) {
        c.status(401);
        return c.json({ error: "Token not provided or invalid" });
    }
    const reqData = await c.req.json();
    const { success, data } = updateProfileInput.safeParse(reqData);
    if (!success) {
        c.status(400);
        return c.json({ error: "Invalid profile data format" });
    }
    const prisma = getPrisma(c.env.DATABASE_URL);
    try {
        if (data.handle) {
            const existingUserWithHandle = await prisma.user.findFirst({
                where: {
                    handle: data.handle,
                    id: { not: Number(finalUserId) }
                }
            });
            if (existingUserWithHandle) {
                c.status(409);
                return c.json({ error: "This handle is already taken" });
            }
        }
        const updatedUser = await prisma.user.update({
            where: { id: Number(finalUserId) },
            data: {
                name: data.name,
                handle: data.handle,
                bio: data.bio,
                avatarUrl: data.avatarUrl,
            },
            select: {
                id: true,
                name: true,
                username: true,
                handle: true,
                bio: true,
                avatarUrl: true,
            }
        });
        return c.json({
            msg: "Profile updated successfully",
            user: updatedUser
        });
    }
    catch (e) {
        console.error("PUT /profile error:", e);
        c.status(500);
        return c.json({ error: "Failed to update profile" });
    }
});
