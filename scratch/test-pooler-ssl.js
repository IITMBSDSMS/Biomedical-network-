const { Pool } = require("pg");

const configs = [
  {
    host: "aws-0-ap-south-1.pooler.supabase.com",
    port: 6543,
    database: "postgres",
    user: "postgres.cszovxezdjszkyfdfuwf",
    password: "IITIAN@1234m",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
    label: "Pooler 6543 SSL no-reject"
  },
  {
    host: "aws-0-ap-south-1.pooler.supabase.com",
    port: 5432,
    database: "postgres",
    user: "postgres.cszovxezdjszkyfdfuwf",
    password: "IITIAN@1234m",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
    label: "Pooler 5432 SSL no-reject"
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
