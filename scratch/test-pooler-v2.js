const { Pool } = require("pg");

// New v2 Supabase format with correct SSL handling
const testPooler = async (config, label) => {
  const pool = new Pool(config);
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT COUNT(*) as cnt FROM users');
    console.log(`✅ ${label}: user count = ${res.rows[0].cnt}`);
    client.release();
  } catch (err) {
    console.error(`❌ ${label}: ${err.message.substring(0,250)}`);
  }
  await pool.end();
};

async function main() {
  // Using connectionString with SSL in URL
  await testPooler({
    connectionString: "postgres://postgres.cszovxezdjszkyfdfuwf:IITIAN@1234m@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=verify-full",
    connectionTimeoutMillis: 15000,
  }, "v2 format with verify-full SSL");
  
  await testPooler({
    connectionString: "postgres://postgres.cszovxezdjszkyfdfuwf:IITIAN@1234m@aws-0-ap-south-1.pooler.supabase.com:6543/postgres",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  }, "v2 format with rejectUnauthorized=false");
}

main();
