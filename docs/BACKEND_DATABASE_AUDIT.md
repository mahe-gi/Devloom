# Backend & Database Audit: 101dev

## 1. API Endpoint Inventory

| Method | Route | Auth Required | Purpose | Input Validation | Response Format | Issues & Security Risks |
| ------ | ----- | ------------- | ------- | ---------------- | --------------- | ----------------------- |
| `POST` | `/api/v1/user/signup` | No | User Registration | `signupInput` (Zod) | `{ token: string }` | Username not validated as email format; generic error messages. |
| `POST` | `/api/v1/user/signin` | No | User Authentication | `signinInput` (Zod) | `{ token: string }` | Debug `console.log` in production route. |
| `POST` | `/api/v1/user/me` | Yes | Token Validation | Manual Header check | `{ id: string }` | Does not verify if user still exists in DB; wrong method (`POST` instead of `GET`). |
| `GET` | `/api/v1/blog/bulk` | Yes (Incorrect) | List All Blogs | None | `{ blogs: Array }` | Trapped under global auth middleware; no pagination (`findMany` fetches all records); no order sorting. |
| `GET` | `/api/v1/blog/:id` | Yes (Incorrect) | Single Blog Detail | Route Param (`id`) | `{ id, title, content, author }` | Trapped under global auth middleware; 404 response missing structured error handling. |
| `POST` | `/api/v1/blog` | Yes | Create Blog Post | `createBlogInput` (Zod) | `{ id: number, msg: string }` | Author ID derived from token claims (`c.get("userId")`). |
| `PUT` | `/api/v1/blog` | Yes | Update Blog Post | `updateBlogInput` (Zod) | `{ id: number, msg: string }` | **CRITICAL IDOR**: No author ownership check. Any user can overwrite any blog. |

## 2. Database Schema Analysis (`schema.prisma`)

```prisma
model User {
  id       Int     @id @default(autoincrement())
  username String  @unique
  password String
  name     String?
  blogs    Blog[]
}

model Blog {
  id        Int     @id @default(autoincrement())
  authorId  Int
  title     String
  content   String
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
}
```

### Database Design Gaps:
1. **Missing Timestamps**: Neither `User` nor `Blog` models have `createdAt` or `updatedAt` fields.
2. **Missing Indexes**: `Blog.authorId` and `Blog.published` lack indexing `@index([authorId])`.
3. **No Cascade Rules**: Deleting a `User` entity will cause relational errors if associated `Blog` records exist.
4. **Prisma Client Edge Anti-Pattern**: Instantiating Prisma Client Edge inside every individual handler callback increases latency and memory usage on Cloudflare Workers.
