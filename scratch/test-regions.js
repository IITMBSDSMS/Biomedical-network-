const { Pool } = require("pg");

const regions = [
  "aws-0-ap-south-1",
  "aws-0-ap-southeast-1", 
  "aws-0-ap-southeast-2",
  "aws-0-us-east-1",
  "aws-0-eu-west-1",
];

async function testRegion(region) {
  const pool = new Pool({
    host: `${region}.pooler.supabase.com`,
    port: 6543,
    database: "postgres",
    user: "postgres.cszovxezdjszkyfdfuwf",
    password: "IITIAN@1234m",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
  });
  
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT COUNT(*) as cnt FROM users');
    console.log(`✅ ${region}: user count = ${res.rows[0].cnt}`);
    client.release();
  } catch (err) {
    console.error(`❌ ${region}: ${err.message.substring(0,120)}`);
  }
  await pool.end();
}

async function main() {
  for (const region of regions) {
    await testRegion(region);
  }
}

main();
