const { Client } = require("pg");

async function main() {
  console.log("Connecting directly to IPv6 address via config object...");
  
  const client = new Client({
    host: '2406:da12:5ca:b702:7a3c:b06d:3a9d:9d10',
    port: 5432,
    user: 'postgres',
    password: 'IITIAN@1234m',
    database: 'postgres',
    connectionTimeoutMillis: 8000,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Database connection successful!");
    const res = await client.query("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';");
    console.log("Total public tables:", res.rows[0].count);
    await client.end();
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

main();
