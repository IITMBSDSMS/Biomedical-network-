// Quick test of pooler connection via Prisma
process.env.DATABASE_URL = "postgresql://postgres.cszovxezdjszkyfdfuwf:IITIAN%401234m@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.user.count();
    console.log("Pooler connected! User count:", count);
  } catch (err) {
    console.error("Failed:", err.message.substring(0,300));
  } finally {
    await prisma.$disconnect();
  }
}

main();
