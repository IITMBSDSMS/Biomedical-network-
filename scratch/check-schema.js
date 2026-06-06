const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://postgres:IITIAN%401234m@db.cszovxezdjszkyfdfuwf.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

async function main() {
  const client = await pool.connect();
  try {
    // Check all schemas and tables
    const res = await client.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_schema, table_name;
    `);
    console.log("Tables:", JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error("Error:", err.message);
  }
  client.release();
  await pool.end();
}

main();
