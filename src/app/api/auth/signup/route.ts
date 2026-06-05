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

    const cleanEmail = email.trim().toLowerCase();
    let supabaseUserId: string | null = null;
    let accessToken: string | null = null;

    if (isSupabaseAdminConfigured) {
      // ========== APPROACH 1: Admin API — Create pre-confirmed user ==========
      // Try creating the user directly (most users will be new)
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: cleanEmail,
        password,
        email_confirm: true, // Pre-confirm — our OTP already verified the email
        user_metadata: { full_name: name.trim() },
      });

      if (!createError && newUser?.user) {
        supabaseUserId = newUser.user.id;
      } else if (createError) {
        // User already exists — find them and auto-confirm
        console.log("createUser error (likely duplicate):", createError.message);

        // Page through users to find by email
        let found = false;
        let page = 1;
        while (!found) {
          const { data: pageData, error: listError } = await supabaseAdmin.auth.admin.listUsers({
            page,
            perPage: 50,
          });

          if (listError || !pageData?.users?.length) break;

          const match = pageData.users.find((u: any) => u.email === cleanEmail);
          if (match) {
            // Found — auto-confirm and update password
            const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(match.id, {
              email_confirm: true,
              password,
            });
            if (!updateError) {
              supabaseUserId = match.id;
            }
            found = true;
          }

          if (pageData.users.length < 50) break; // Last page reached
          page++;
        }
      }

      // Sign in to get session token
      if (supabaseUserId) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (!signInError && signInData?.session) {
          accessToken = signInData.session.access_token;
        } else {
          console.error("Sign-in after admin create failed:", signInError?.message);
        }
      }
    } else if (isSupabaseConfigured) {
      // ========== APPROACH 2: Standard signUp (fallback without service role) ==========
      const { error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: { data: { full_name: name.trim() } },
      });

      if (signUpError && !signUpError.message.toLowerCase().includes("already")) {
        return NextResponse.json({ error: signUpError.message }, { status: 400 });
      }

      // Try immediate sign-in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!signInError && signInData?.session) {
        accessToken = signInData.session.access_token;
      } else if (signInError?.message?.toLowerCase().includes("not confirmed")) {
        return NextResponse.json({ success: true, requiresConfirmation: true, email: cleanEmail });
      }
    }

    // ========== Sync user to Prisma DB ==========
    let dbUser: any = null;
    let isNewUser = false;
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: cleanEmail },
        include: { researcher: true },
      });
      isNewUser = !dbUser;

      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            email: cleanEmail,
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

    // Send welcome email for new users only
    if (isNewUser && dbUser) {
      try {
        await sendWelcomeEmail(
          cleanEmail,
          name,
          dbUser.researcher?.researchId,
          dbUser.researcher?.slug
        );
      } catch (mailErr) {
        console.error("Welcome email failed (non-fatal):", mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      accessToken,
      email: cleanEmail,
      user: dbUser
        ? {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role,
            researcherId: dbUser.researcher?.id,
            researcherSlug: dbUser.researcher?.slug,
          }
        : null,
    });
  } catch (error: any) {
    console.error("Server-side signup error:", error);
    return NextResponse.json({ error: error.message || "Signup failed" }, { status: 500 });
  }
}
