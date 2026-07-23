import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import { Hono } from "hono";
import { signinInput, signupInput } from "@mahe-npm/common";
import bcrypt from "bcryptjs";
import { getPrisma } from "../prisma";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();



userRouter.post("/signup", async (c) => {
  const reqData = await c.req.json();
  if (!reqData.username || !reqData.password) {
    c.status(400);
    return c.json({ error: "Username and password are required" });
  }

  const { success } = signupInput.safeParse(reqData);
  if (!success) {
    c.status(400);
    return c.json({ error: "Invalid signup data format" });
  }

  const hashedPassword = await bcrypt.hash(reqData.password, 10);
  const prisma = getPrisma(c.env.DATABASE_URL);

  try {
    const user = await prisma.user.create({
      data: {
        username: reqData.username,
        password: hashedPassword,
        name: reqData.name || null,
      },
    });

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    c.status(200);
    return c.json({ token, user: { id: user.id, name: user.name, username: user.username } });
  } catch (e) {
    c.status(400);
    return c.json({ error: "User already exists or registration failed" });
  }
});

userRouter.post("/signin", async (c) => {
  const reqData = await c.req.json();
  if (!reqData.username || !reqData.password) {
    c.status(400);
    return c.json({ error: "Username and password are required" });
  }

  const { success } = signinInput.safeParse(reqData);
  if (!success) {
    c.status(400);
    return c.json({ error: "Invalid signin data format" });
  }

  const prisma = getPrisma(c.env.DATABASE_URL);

  try {
    const user = await prisma.user.findFirst({
      where: {
        username: reqData.username,
      },
    });

    if (!user) {
      c.status(401);
      return c.json({ error: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(reqData.password, user.password);
    if (!isMatch) {
      c.status(401);
      return c.json({ error: "Invalid username or password" });
    }

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    c.status(200);
    return c.json({ token, user: { id: user.id, name: user.name, username: user.username } });
  } catch (e) {
    c.status(500);
    return c.json({ error: "Internal server error during signin" });
  }
});

userRouter.post("/me", async (c) => {
  const authHeader = c.req.header("Authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token) {
    c.status(401);
    return c.json({ error: "Token not provided" });
  }

  try {
    const payload = await verify(token, c.env.JWT_SECRET, "HS256");
    if (!payload || !payload.id) {
      c.status(401);
      return c.json({ error: "Invalid token payload" });
    }

    const prisma = getPrisma(c.env.DATABASE_URL);
    const user = await prisma.user.findUnique({
      where: { id: Number(payload.id) },
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
  } catch (e) {
    c.status(401);
    return c.json({ error: "Invalid or expired token" });
  }
});

import { updateProfileInput } from "@mahe-npm/common";

userRouter.put("/profile", async (c) => {
  const authHeader = c.req.header("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  if (!token) {
    c.status(401);
    return c.json({ error: "Token not provided" });
  }

  let payload;
  try {
    payload = await verify(token, c.env.JWT_SECRET, "HS256");
  } catch (e) {
    c.status(401);
    return c.json({ error: "Invalid or expired token" });
  }

  if (!payload || !payload.id) {
    c.status(401);
    return c.json({ error: "Invalid token payload" });
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
          id: { not: Number(payload.id) }
        }
      });

      if (existingUserWithHandle) {
        c.status(409);
        return c.json({ error: "This handle is already taken" });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(payload.id) },
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
  } catch (e) {
    console.error("PUT /profile error:", e);
    c.status(500);
    return c.json({ error: "Failed to update profile" });
  }
});
