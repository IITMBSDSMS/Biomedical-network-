import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

let prisma: PrismaClient;

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL;
  const isDummy = !dbUrl || dbUrl.includes("[password]") || dbUrl.includes("[id]");
  const activeUrl = isDummy ? "postgresql://postgres:postgres@localhost:5432/postgres" : dbUrl;

  try {
    const pool = new Pool({ connectionString: activeUrl });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  } catch (err) {
    console.error(
      "Failed to load PostgreSQL driver. Please ensure 'pg' and '@prisma/adapter-pg' are installed.",
      err
    );
    // Extreme fallback: empty object casted to satisfy build compilation if pg fails to load
    return new PrismaClient({} as ConstructorParameters<typeof PrismaClient>[0]);
  }
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


