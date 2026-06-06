const { Client } = require("pg");

async function main() {
  const connectionString = "postgresql://postgres:IITIAN%401234m@db.cszovxezdjszkyfdfuwf.supabase.co:5432/postgres";
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("Connecting to PostgreSQL directly...");
    await client.connect();
    console.log("Connected successfully.");

    // Query tables in public schema
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("Tables in public schema:");
    tablesRes.rows.forEach(row => console.log(` - ${row.table_name}`));

    // Count rows in users table if exists
    if (tablesRes.rows.some(row => row.table_name === 'users')) {
      const countRes = await client.query('SELECT COUNT(*) as count FROM users');
      console.log(`Users count: ${countRes.rows[0].count}`);
      
      const sampleRes = await client.query('SELECT id, email, role, name FROM users LIMIT 5');
      console.log("Sample users:", sampleRes.rows);
    } else {
      console.log("WARNING: 'users' table does not exist!");
    }

  } catch (err) {
    console.error("Database connection error:", err.message);
  } finally {
    await client.end();
  }
}

main();
