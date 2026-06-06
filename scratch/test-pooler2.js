const { Client } = require("pg");

async function test() {
  const client = new Client({
    host: "aws-0-ap-south-1.pooler.supabase.com",
    port: 6543,
    user: "postgres.cszovxezdjszkyfdfuwf",
    password: "IITIAN@1234m",
    database: "postgres",
    ssl: { rejectUnauthorized: false, checkServerIdentity: () => undefined },
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
