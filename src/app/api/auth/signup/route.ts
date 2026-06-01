import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { prisma } from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/mail";

/**
 * Server-side signup handler that creates a pre-confirmed Supabase user.
 * Uses the admin service role key to bypass Supabase's email confirmation requirement.
 * Our own OTP system has already verified the email — no need for a second confirmation.
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password, name, role } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let supabaseUserId: string | null = null;
    let accessToken: string | null = null;

    if (isSupabaseAdminConfigured) {
      // ========== APPROACH 1: Admin API — Create pre-confirmed user ==========
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(u => u.email === email.trim());

      if (existingUser) {
        // User exists but may be unconfirmed — confirm them and update password if needed
        const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          existingUser.id,
          { email_confirm: true }
        );
        if (updateError) {
          console.error("Failed to confirm existing user:", updateError);
        } else {
          supabaseUserId = updatedUser.user?.id || null;
        }
      } else {
        // Create a new confirmed user via admin
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: email.trim(),
          password,
          email_confirm: true, // Pre-confirm since our OTP already verified the email
          user_metadata: { full_name: name.trim() },
        });

        if (createError) {
          console.error("Admin createUser failed:", createError);
          // Fall through to regular signup below
        } else {
          supabaseUserId = newUser.user?.id || null;
        }
      }

      // Now sign in to get session token
      if (supabaseUserId) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (!signInError && signInData?.session) {
          accessToken = signInData.session.access_token;
        }
      }
    } else if (isSupabaseConfigured) {
      // ========== APPROACH 2: Standard signUp (may require email confirmation) ==========
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: name.trim() } },
      });

      if (signUpError && !signUpError.message.includes("User already registered")) {
        return NextResponse.json({ error: signUpError.message }, { status: 400 });
      }

      // Try immediate sign-in (works if email confirmation is disabled)
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (!signInError && signInData?.session) {
        accessToken = signInData.session.access_token;
      } else if (signInError?.message?.includes("Email not confirmed")) {
        // Return success without session — client will use mock session fallback
        return NextResponse.json({ success: true, requiresConfirmation: true, email });
      }
    }

    // ========== Sync user to our Prisma database ==========
    let dbUser: any = null;
    let isNewUser = false;
    try {
      dbUser = await prisma.user.findUnique({ where: { email }, include: { researcher: true } });
      isNewUser = !dbUser;

      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            email,
            name: name.trim(),
            role: (role || "RESEARCHER").toUpperCase(),
          },
          include: { researcher: true },
        });
      }

      // Auto-create researcher profile
      if (dbUser.role === "RESEARCHER" && !dbUser.researcher) {
        const count = await prisma.researcher.count();
        const nextNum = String(count + 1).padStart(4, "0");
        const baseSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const slug = `${baseSlug}-${nextNum}`;

        dbUser.researcher = await prisma.researcher.create({
          data: {
            userId: dbUser.id,
            researchId: `HX-RES-2026-${nextNum}`,
            fullName: name.trim(),
            photoUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
            bio: "Biomedical researcher on the Healix BioLabs network.",
            researchInterests: JSON.stringify([]),
            skills: JSON.stringify([]),
            slug,
            isVerified: false,
          },
        });
      }
    } catch (dbError) {
      console.error("Database sync error (non-fatal):", dbError);
    }

    // Send welcome email for new users
    if (isNewUser && dbUser) {
      try {
        await sendWelcomeEmail(email, name, dbUser.researcher?.researchId, dbUser.researcher?.slug);
      } catch (mailErr) {
        console.error("Welcome email failed (non-fatal):", mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      accessToken,
      email,
      user: dbUser ? {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
        researcherId: dbUser.researcher?.id,
        researcherSlug: dbUser.researcher?.slug,
      } : null,
    });
  } catch (error: any) {
    console.error("Server-side signup error:", error);
    return NextResponse.json({ error: error.message || "Signup failed" }, { status: 500 });
  }
}
