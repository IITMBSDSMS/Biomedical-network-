const { Client } = require("pg");

async function test() {
  // Try with session mode (port 5432 on pooler)
  const configs = [
    { host: "aws-0-ap-south-1.pooler.supabase.com", port: 5432, user: "postgres.cszovxezdjszkyfdfuwf", password: "IITIAN@1234m", database: "postgres", label: "Pooler session mode 5432" },
    { host: "aws-0-ap-south-1.pooler.supabase.com", port: 6543, user: "postgres.cszovxezdjszkyfdfuwf", password: "IITIAN@1234m", database: "postgres", label: "Pooler transaction mode 6543" },
  ];
  
  for (const config of configs) {
    const { label, ...connConfig } = config;
    const client = new Client({
      ...connConfig,
      ssl: true,
      connectionTimeoutMillis: 10000,
    });
    
    try {
      await client.connect();
      console.log(`✅ ${label} - Connected!`);
      const res = await client.query('SELECT COUNT(*) FROM "User"');
      console.log("   User count:", res.rows[0].count);
      await client.end();
    } catch (err) {
      console.error(`❌ ${label} - Failed: ${err.message}`);
    }
  }
}

test();
