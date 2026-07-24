import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";
import pg from "pg";
let acceleratePrisma;
export const getPrisma = (datasourceUrl) => {
    if (datasourceUrl && (datasourceUrl.startsWith("prisma://") || datasourceUrl.startsWith("prisma+postgres://"))) {
        if (acceleratePrisma)
            return acceleratePrisma;
        acceleratePrisma = new PrismaClient({ datasourceUrl }).$extends(withAccelerate());
        return acceleratePrisma;
    }
    // Local development with pg adapter
    // We CANNOT cache this globally because Cloudflare Workers isolate Node.js sockets (I/O) to the request context.
    // Reusing a pg.Pool created in Request A for Request B will throw "Cannot perform I/O on behalf of a different request".
    const pool = new pg.Pool({ connectionString: datasourceUrl });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
};
