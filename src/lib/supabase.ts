import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = 
  !!supabaseUrl && 
  supabaseUrl !== "https://[id].supabase.co" && 
  !!supabaseAnonKey && 
  supabaseAnonKey !== "[anon-key]";

// Initialize Supabase Client
// We use fallback placeholders to prevent crashes during Next.js static build phase
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : "https://placeholder-url.supabase.co",
  isSupabaseConfigured ? supabaseAnonKey : "placeholder-anon-key"
);
