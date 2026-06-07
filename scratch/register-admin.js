const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://cszovxezdjszkyfdfuwf.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzem92eGV6ZGpzemt5ZmRmdXdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTg2ODc0NSwiZXhwIjoyMDk1NDQ0NzQ1fQ.dDIX5eBX1dQElLqC0-_iKE2HqcfLdImazjI8GLHDq-E";

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  const email = "admin@biolabsresearch-healix.com";
  const password = "admin2026";

  console.log(`Checking if user ${email} exists in Supabase Auth...`);
  
  // List users
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("Error listing users:", listError.message);
    process.exit(1);
  }

  let authUser = users.find(u => u.email === email);

  if (authUser) {
    console.log(`User found. Updating password for auth user ID: ${authUser.id}`);
    const { error: updateError } = await supabase.auth.admin.updateUserById(authUser.id, {
      password: password,
      email_confirm: true,
      user_metadata: { full_name: "Healix Administrator", role: "ADMIN" }
    });
    if (updateError) {
      console.error("Error updating user:", updateError.message);
      process.exit(1);
    }
    console.log("Successfully updated auth user password and metadata.");
  } else {
    console.log("User not found in auth. Creating new pre-confirmed user...");
    const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: "Healix Administrator", role: "ADMIN" }
    });
    if (createError) {
      console.error("Error creating user:", createError.message);
      process.exit(1);
    }
    authUser = user;
    console.log(`Successfully created pre-confirmed auth user: ${user.id}`);
  }

  // Now verify and sync the user in the database 'users' table
  console.log("Checking database users table...");
  const { data: dbUser, error: findError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (findError) {
    console.error("Error reading database user:", findError.message);
  }

  const now = new Date().toISOString();

  if (dbUser) {
    console.log(`Database user exists: ${dbUser.id}. Updating role to ADMIN...`);
    const { error: updateDbError } = await supabase
      .from("users")
      .update({ role: "ADMIN", name: "Healix Administrator", updatedAt: now })
      .eq("email", email);

    if (updateDbError) {
      console.error("Error updating database user:", updateDbError.message);
    } else {
      console.log("Database user role updated successfully.");
    }
  } else {
    console.log("Database user does not exist. Creating new database user record...");
    const { error: insertError } = await supabase
      .from("users")
      .insert({
        id: authUser.id,
        email,
        name: "Healix Administrator",
        role: "ADMIN",
        createdAt: now,
        updatedAt: now
      });

    if (insertError) {
      console.error("Error inserting database user:", insertError.message);
    } else {
      console.log("Database user record created successfully.");
    }
  }
}

main().catch(console.error);
