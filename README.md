# Devloom

Devloom is a premium, minimal, editorial-focused platform designed for developers and engineers to share insights, architectural notes, and technical articles.

## Tech Stack

The repository is organized as a monorepo containing three main workspaces:

- **Frontend:** React, TypeScript, Vite, Tailwind CSS v4, React Router v7.
- **Backend:** Hono, Cloudflare Workers, Prisma, PostgreSQL.
- **Common:** Zod for shared validation schemas and types across both frontend and backend.

## Project Structure

- `/frontend` - The React user interface and application logic.
- `/backend` - The Serverless Hono API.
- `/common` - Shared Zod schemas and TypeScript types.
- `docker-compose.yml` - Local database infrastructure.

## Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **Docker & Docker Compose** (for the local PostgreSQL database)

### 2. Setup Shared Types (Common)
The common package contains Zod schemas shared between the frontend and backend. It must be built first.

```bash
cd common
npm install
tsc -b
```

### 3. Start the Database
The project uses PostgreSQL. A `docker-compose.yml` file is provided for local development.

```bash
# from the project root
docker-compose up -d
```

### 4. Setup Backend API
The backend runs on Cloudflare Workers using the Hono framework and Prisma ORM.

```bash
cd backend
npm install
```

Set up your local environment variables. Create a `.dev.vars` file in the `backend/` directory:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
```

Initialize the database schema using Prisma:
```bash
npx prisma migrate dev
```

Start the backend development server:
```bash
npm run dev
```
The API will run locally at `http://localhost:8787`.

### 5. Setup Frontend
The frontend is a Vite-powered React application with Tailwind CSS.

```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```
The application will run locally at `http://localhost:5173`.

## Architecture Highlights
- **Stark Minimalist UI:** Built meticulously without heavy shadows or gradients, relying entirely on clean typography, precise padding, and strict grid alignments.
- **Edge-Ready API:** Built on Cloudflare Workers and Hono, ready for edge deployment.
- **Type Safety:** End-to-end type safety enforced via shared Zod schemas (in the `common` package) spanning from the database inputs directly to frontend forms.
