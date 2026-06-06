const { Client } = require("pg");

async function main() {
  const connectionString = "postgresql://postgres:IITIAN%401234m@db.cszovxezdjszkyfdfuwf.supabase.co:5432/postgres";
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("Connecting to PostgreSQL to fix privileges...");
    await client.connect();
    console.log("Connected successfully.");

    const queries = [
      // Grant schema usage
      "GRANT USAGE ON SCHEMA public TO postgres, service_role, authenticated, anon, authenticator;",
      
      // Grant all privileges on all tables
      "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres, service_role, authenticated, anon, authenticator;",
      
      // Grant all privileges on all sequences
      "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role, authenticated, anon, authenticator;",
      
      // Alter default privileges for future tables
      "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, service_role, authenticated, anon, authenticator;",
      "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, service_role, authenticated, anon, authenticator;"
    ];

    for (const sql of queries) {
      console.log(`Running: ${sql}`);
      await client.query(sql);
    }

    console.log("All permission queries executed successfully!");

  } catch (err) {
    console.error("Database privilege error:", err.message);
  } finally {
    await client.end();
  }
}

main();
