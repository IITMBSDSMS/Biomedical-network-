import { db } from "../src/lib/db";

async function main() {
  console.log("Testing db.ts wrapper...");
  
  try {
    const users = await db.user.findMany();
    console.log("✅ Users fetched successfully. Total:", users.length);
    users.forEach(u => console.log(` - ${u.email} (${u.role})`));

    const researchers = await db.researcher.findMany({
      include: {
        user: true
      }
    });
    console.log("✅ Researchers fetched successfully. Total:", researchers.length);
    researchers.forEach(r => console.log(` - ${r.fullName} (Slug: ${r.slug}, ID: ${r.researchId})`));

  } catch (err: any) {
    console.error("❌ DB Wrapper Test Failed:", err.message);
  }
}

main();
