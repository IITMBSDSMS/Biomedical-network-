import { PrismaClient } from "@prisma/client";

// Test with pooler connection string
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.cszovxezdjszkyfdfuwf:IITIAN%401234m@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1",
    },
  },
  log: ["error"],
});

async function main() {
  try {
    const count = await prisma.user.count();
    console.log("✅ Pooler connected! User count:", count);
  } catch (err: any) {
    console.error("❌ Failed:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
