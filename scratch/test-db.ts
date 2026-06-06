import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  console.log("DATABASE_URL:", dbUrl);
  if (!dbUrl) {
    console.error("No DATABASE_URL found in env.");
    return;
  }

  const pool = new Pool({ connectionString: dbUrl });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Connecting to database...");
    const count = await prisma.user.count();
    console.log("Database connection successful. Total users:", count);
    const users = await prisma.user.findMany({ take: 5 });
    console.log("Sample users:", users);
  } catch (err) {
    console.error("Database connection failed:", err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
