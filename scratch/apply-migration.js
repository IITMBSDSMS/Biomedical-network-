const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Reading schema SQL file...");
  const sqlPath = path.join(__dirname, "schema.sql");
  const sqlContent = fs.readFileSync(sqlPath, "utf8");

  console.log("Connecting to PostgreSQL database via IPv6...");
  const client = new Client({
    host: '2406:da12:5ca:b702:7a3c:b06d:3a9d:9d10',
    port: 5432,
    user: 'postgres',
    password: 'IITIAN@1234m',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected successfully! Dropping old public schema and recreating...");
    
    // Drop the public schema and recreate it to reset all tables and indexes cleanly
    await client.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO postgres; GRANT ALL ON SCHEMA public TO public;");
    console.log("Public schema reset completed. Running schema creation script...");
    
    // Execute the SQL creation commands
    await client.query(sqlContent);
    console.log("Database schema applied successfully! All tables created.");
    
    // Seed verification check
    const res = await client.query("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';");
    console.log("Total public tables now present:", res.rows[0].count);
    
    await client.end();
  } catch (err) {
    console.error("Migration execution failed:", err);
    process.exit(1);
  }
}

main();
