const { Client } = require("pg");

async function main() {
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
    
    const usersRes = await client.query("SELECT id, email, name, role FROM users;");
    console.log("\n--- Users ---");
    console.table(usersRes.rows);

    const resRes = await client.query("SELECT id, \"userId\", \"researchId\", \"fullName\", slug FROM researchers;");
    console.log("\n--- Researchers ---");
    console.table(resRes.rows);

    await client.end();
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

main();
