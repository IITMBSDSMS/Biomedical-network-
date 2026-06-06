import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

let prisma: PrismaClient;

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    throw new Error("DATABASE_URL environment variable is missing.");
  }
  
  if (dbUrl.includes("[password]") || dbUrl.includes("[id]")) {
    throw new Error(
      "DATABASE_URL contains placeholder '[password]' or '[id]'. Please configure the real Supabase PostgreSQL database credentials."
    );
  }

  // Use PrismaPg driver adapter with Supabase-compatible SSL settings.
  // Supabase uses a self-signed SSL certificate chain, so we must set
  // rejectUnauthorized: false to allow the connection in production environments.
  const pool = new Pool({
    connectionString: dbUrl,
    ssl: dbUrl.includes("supabase") || dbUrl.includes("supabase.co") || process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
    max: 10,
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

if (process.env.NODE_ENV === "production") {
  prisma = createPrismaClient();
} else {
  // Prevent multiple instances of Prisma Client during Next.js hot-reloads
  if (!(global as any).prismaGlobal) {
    (global as any).prismaGlobal = createPrismaClient();
  }
  prisma = (global as any).prismaGlobal;
}

export { prisma };
