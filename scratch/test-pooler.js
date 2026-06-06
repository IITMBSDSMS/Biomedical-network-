const { Client } = require("pg");

async function test() {
  const client = new Client({
    connectionString: "postgresql://postgres.cszovxezdjszkyfdfuwf:IITIAN@1234m@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });
  
  try {
    await client.connect();
    console.log("Connected to pooler!");
    const res = await client.query('SELECT COUNT(*) FROM "User"');
    console.log("User count:", res.rows[0].count);
    await client.end();
  } catch (err) {
    console.error("Failed:", err.message);
  }
}

test();
