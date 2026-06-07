const { Client } = require("pg");

async function main() {
  const client = new Client({
    host: '2406:da12:5ca:b702:7a3c:b06d:3a9d:9d10',
    port: 5432,
    user: 'postgres',
    password: 'IITIAN@1234m',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected successfully to PostgreSQL database via IPv6.");

    const email = "admin@biolabsresearch-healix.com";
    const authId = "be19ce90-1c1b-409a-a30d-84d943e699ea";
    const now = new Date().toISOString();

    console.log("Checking database users table...");
    const checkRes = await client.query("SELECT * FROM users WHERE email = $1", [email]);

    if (checkRes.rows.length > 0) {
      const dbUser = checkRes.rows[0];
      console.log(`Current DB user found with ID: ${dbUser.id}`);

      if (dbUser.id !== authId) {
        console.log(`ID mismatch! Deleting old record with ID ${dbUser.id} and creating matching one with ID ${authId}...`);
        await client.query("DELETE FROM users WHERE email = $1", [email]);
        
        await client.query(
          "INSERT INTO users (id, email, role, name, \"createdAt\", \"updatedAt\") VALUES ($1, $2, $3, $4, $5, $6)",
          [authId, email, "ADMIN", "Healix Administrator", now, now]
        );
        console.log("Database user synced successfully with the correct ID.");
      } else {
        console.log("ID already matches Auth ID. Ensuring role is ADMIN...");
        await client.query("UPDATE users SET role = 'ADMIN' WHERE email = $1", [email]);
        console.log("Database user updated successfully.");
      }
    } else {
      console.log("Database user does not exist. Creating new matching record...");
      await client.query(
        "INSERT INTO users (id, email, role, name, \"createdAt\", \"updatedAt\") VALUES ($1, $2, $3, $4, $5, $6)",
        [authId, email, "ADMIN", "Healix Administrator", now, now]
      );
      console.log("Database user created successfully.");
    }

  } catch (err) {
    console.error("Database error:", err.message);
  } finally {
    await client.end();
  }
}

main().catch(console.error);
