const { Client } = require("pg");

async function main() {
  const connectionString = "postgresql://postgres:IITIAN%401234m@db.cszovxezdjszkyfdfuwf.supabase.co:5432/postgres";
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL.");

    const res = await client.query('SELECT * FROM researchers');
    console.log("Researchers list:");
    res.rows.forEach(r => {
      console.log(`- ID: ${r.id}, userId: ${r.userId}, name: ${r.fullName}, slug: ${r.slug}, researchId: ${r.researchId}`);
    });

    const pubRes = await client.query('SELECT id, title, "researcherId", "isApproved" FROM publications');
    console.log("\nPublications list:");
    pubRes.rows.forEach(p => {
      console.log(`- ID: ${p.id}, Title: ${p.title}, researcherId: ${p.researcherId}, Approved: ${p.isApproved}`);
    });

  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

main();
