import { z } from "zod";

export const signupInput = z.object({
  username: z.string(),
  password: z.string(),
  name: z.string().optional(),
});

export const signinInput = z.object({
  username: z.string(),
  password: z.string(),
});

export const optionalSummary = z
  .string()
  .trim()
  .max(300, "Summary must be 300 characters or fewer")
  .transform((value) => value || undefined)
  .optional();

export const optionalCoverImage = z
  .string()
  .trim()
  .max(2048, "Cover image URL is too long")
  .refine(
    (value) =>
      value === "" ||
      value.startsWith("https://") ||
      value.startsWith("http://"),
    "Enter a valid HTTP or HTTPS image URL"
  )
  .transform((value) => value || undefined)
  .optional();

export const tagInput = z
  .string()
  .trim()
  .min(1, "Tag cannot be empty")
  .max(30, "Tag must be 30 characters or fewer");

export const tagsInput = z
  .array(tagInput)
  .max(5, "Add no more than 5 tags")
  .optional();

export const createBlogInput = z.object({
  title: z.string(),
  content: z.string(),
  summary: optionalSummary,
  coverImage: optionalCoverImage,
  tags: tagsInput,
  published: z.boolean().optional(),
});

export const updateBlogInput = z.object({
  title: z.string(),
  content: z.string(),
  summary: optionalSummary,
  coverImage: optionalCoverImage,
  tags: tagsInput,
  id: z.number(),
});

export const updateBlogPublishedInput = z.object({
  published: z.boolean(),
});

export const updateProfileInput = z.object({
  name: z.string().trim().optional(),
  handle: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Handle must be at least 3 characters")
    .max(30, "Handle must be at most 30 characters")
    .regex(/^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])?$/, "Handle can only contain lowercase letters, numbers, and hyphens (no leading/trailing/consecutive hyphens)")
    .refine((val) => {
      const reserved = ["admin", "api", "authors", "blog", "blogs", "dashboard", "publish", "search", "settings", "signin", "signup", "tags"];
      return !reserved.includes(val);
    }, "This handle is reserved and cannot be used")
    .transform((value) => value || undefined)
    .optional(),
  bio: z
    .string()
    .trim()
    .max(300, "Bio must be 300 characters or fewer")
    .transform((value) => value || undefined)
    .optional(),
  avatarUrl: optionalCoverImage,
});

export type SignupInput = z.infer<typeof signupInput>;
export type SigninInput = z.infer<typeof signinInput>;
export type CreateBlogInput = z.infer<typeof createBlogInput>;
export type UpdateBlogInput = z.infer<typeof updateBlogInput>;
export type UpdateBlogPublishedInput = z.infer<typeof updateBlogPublishedInput>;
export type UpdateProfileInput = z.infer<typeof updateProfileInput>;
