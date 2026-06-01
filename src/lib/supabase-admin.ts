import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const isSupabaseAdminConfigured =
  !!supabaseUrl &&
  supabaseUrl !== "https://[id].supabase.co" &&
  !!supabaseServiceRoleKey &&
  supabaseServiceRoleKey.length > 10;

// Admin client has full bypass powers — NEVER expose this to the client
export const supabaseAdmin = createClient(
  isSupabaseAdminConfigured ? supabaseUrl : "https://placeholder-url.supabase.co",
  isSupabaseAdminConfigured ? supabaseServiceRoleKey : "placeholder-service-role-key",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
