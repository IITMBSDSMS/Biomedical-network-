const { Pool } = require("pg");

// The Supabase pooler username format: postgres.[project-ref]
// The password must be URL-decoded when using object format
const configs = [
  {
    host: "aws-0-ap-south-1.pooler.supabase.com",
    port: 6543,
    database: "postgres",
    user: "postgres.cszovxezdjszkyfdfuwf",
    password: "IITIAN@1234m",
    ssl: true,
    connectionTimeoutMillis: 15000,
    label: "Pooler 6543 (transaction mode)"
  },
  {
    host: "aws-0-ap-south-1.pooler.supabase.com",
    port: 5432,
    database: "postgres",
    user: "postgres.cszovxezdjszkyfdfuwf",
    password: "IITIAN@1234m",
    ssl: true,
    connectionTimeoutMillis: 15000,
    label: "Pooler 5432 (session mode)"
  }
];

async function testConfig(config) {
  const { label, ...pgConfig } = config;
  const pool = new Pool(pgConfig);
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT COUNT(*) as cnt FROM users');
    console.log(`✅ ${label}: user count = ${res.rows[0].cnt}`);
    client.release();
  } catch (err) {
    console.error(`❌ ${label}: ${err.message.substring(0,200)}`);
  }
  await pool.end();
}

async function main() {
  for (const config of configs) {
    await testConfig(config);
  }
}

main();
