const { Client } = require("pg");

const connectionString =
  "postgresql://postgres:IITIAN%401234m@db.cszovxezdjszkyfdfuwf.supabase.co:5432/postgres";

async function main() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log("✅ Connected to Supabase PostgreSQL");

  const queries = [
    // ── student_connections (calls + messages) ──────────────────────────────
    `CREATE TABLE IF NOT EXISTS student_connections (
      id TEXT PRIMARY KEY,
      "studentId" TEXT NOT NULL,
      "studentName" TEXT,
      "studentEmail" TEXT,
      "researcherId" TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'MESSAGE',
      status TEXT NOT NULL DEFAULT 'PENDING',
      subject TEXT,
      message TEXT,
      "scheduledAt" TIMESTAMP,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    )`,

    // ── doubts ──────────────────────────────────────────────────────────────
    `CREATE TABLE IF NOT EXISTS doubts (
      id TEXT PRIMARY KEY,
      "studentId" TEXT NOT NULL,
      "studentName" TEXT,
      "studentEmail" TEXT,
      "researcherId" TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'OPEN',
      answer TEXT,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    )`,

    // ── thesis_updates ──────────────────────────────────────────────────────
    `CREATE TABLE IF NOT EXISTS thesis_updates (
      id TEXT PRIMARY KEY,
      "studentId" TEXT NOT NULL,
      "studentName" TEXT,
      "studentEmail" TEXT,
      "researcherId" TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      chapter TEXT,
      "fileUrl" TEXT,
      status TEXT NOT NULL DEFAULT 'PENDING',
      feedback TEXT,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    )`,

    // ── permissions ─────────────────────────────────────────────────────────
    `GRANT ALL PRIVILEGES ON TABLE student_connections TO postgres, service_role, authenticated, anon, authenticator`,
    `GRANT ALL PRIVILEGES ON TABLE doubts TO postgres, service_role, authenticated, anon, authenticator`,
    `GRANT ALL PRIVILEGES ON TABLE thesis_updates TO postgres, service_role, authenticated, anon, authenticator`,
  ];

  for (const sql of queries) {
    const preview = sql.replace(/\s+/g, " ").substring(0, 70);
    console.log(`  Running: ${preview}...`);
    await client.query(sql);
    console.log("  ✓ Done");
  }

  console.log("\n🎉 All ecosystem tables created and permissions granted!");
  await client.end();
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
