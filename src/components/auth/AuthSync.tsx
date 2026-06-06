"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthSync() {
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        const token = session?.access_token;
        if (token) {
          // Set cookie with secure attributes
          const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
          document.cookie = `healix_supabase_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${isHttps ? "; Secure" : ""}`;
        }
      } else if (event === "SIGNED_OUT") {
        // Clear all session cookies
        const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
        document.cookie = `healix_supabase_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${isHttps ? "; Secure" : ""}`;
        document.cookie = "healix_mock_user_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return null;
}
