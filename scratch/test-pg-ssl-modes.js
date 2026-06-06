const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

// Test with Supabase direct connection (IPv6) and different SSL configs
const configs = [
  {
    connectionString: "postgresql://postgres:IITIAN%401234m@db.cszovxezdjszkyfdfuwf.supabase.co:5432/postgres",
    ssl: { rejectUnauthorized: false },
    label: "Direct IPv6 - no reject"
  },
  {
    connectionString: "postgresql://postgres:IITIAN%401234m@db.cszovxezdjszkyfdfuwf.supabase.co:5432/postgres?sslmode=require",
    ssl: { rejectUnauthorized: false },
    label: "Direct IPv6 - SSL require no reject"
  },
  {
    connectionString: "postgresql://postgres:IITIAN%401234m@db.cszovxezdjszkyfdfuwf.supabase.co:5432/postgres",
    label: "Direct IPv6 - default SSL"
  },
];

async function testConfig(config, label) {
  const { label: _l, ...poolConfig } = { label, ...config };
  const pool = new Pool(poolConfig);
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT count(*) as cnt FROM users');
    console.log(`✅ ${label}: count=${res.rows[0].cnt}`);
    client.release();
  } catch (err) {
    console.error(`❌ ${label}: ${err.message.substring(0,200)}`);
  }
  await pool.end();
}

async function main() {
  for (const config of configs) {
    const { label, ...rest } = config;
    await testConfig(rest, label);
  }
}

main();
