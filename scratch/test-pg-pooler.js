const { Pool } = require("pg");

// Test different pooler configurations
const testPooler = async (config, label) => {
  const pool = new Pool(config);
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT COUNT(*) as count FROM "User"');
    console.log(`✅ ${label}: User count = ${res.rows[0].count}`);
    client.release();
  } catch (err) {
    console.error(`❌ ${label}: ${err.message.substring(0, 150)}`);
  }
  await pool.end();
};

async function main() {
  // Test 1: Direct DB port 5432
  await testPooler({
    connectionString: "postgresql://postgres:IITIAN%401234m@db.cszovxezdjszkyfdfuwf.supabase.co:5432/postgres",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  }, "Direct DB port 5432");

  // Test 2: Pooler port 6543 (transaction mode)
  await testPooler({
    connectionString: "postgresql://postgres.cszovxezdjszkyfdfuwf:IITIAN%401234m@aws-0-ap-south-1.pooler.supabase.com:6543/postgres",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  }, "Pooler port 6543");

  // Test 3: Pooler port 5432 (session mode)
  await testPooler({
    connectionString: "postgresql://postgres.cszovxezdjszkyfdfuwf:IITIAN%401234m@aws-0-ap-south-1.pooler.supabase.com:5432/postgres",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  }, "Pooler port 5432 (session)");
}

main();
