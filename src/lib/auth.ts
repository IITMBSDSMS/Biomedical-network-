import { cookies } from "next/headers";
import { prisma } from "./db";
import { supabase, isSupabaseConfigured } from "./supabase";
import { sendWelcomeEmail } from "./mail";

export interface HealixUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  photoUrl: string | null;
  researcherId?: string;
  researcherSlug?: string;
}

/**
 * Auto-creates a user + researcher profile in local DB from a Supabase user object.
 * Called when Supabase auth is valid but local DB record is missing.
 */
async function autoProvisionLocalUser(email: string, name: string, photoUrl?: string) {
  try {
    let user = await prisma.user.findUnique({
      where: { email },
      include: { researcher: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split("@")[0],
          role: "RESEARCHER",
          photoUrl: photoUrl || null,
        },
        include: { researcher: true },
      });
    }

    // Auto-create researcher profile if missing
    if (user.role === "RESEARCHER" && !user.researcher) {
      const count = await prisma.researcher.count();
      const nextNum = String(count + 1).padStart(4, "0");
      const safeName = (name || email.split("@")[0]).trim();
      const baseSlug = safeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const slug = `${baseSlug}-${nextNum}`;

      const researcher = await prisma.researcher.create({
        data: {
          userId: user.id,
          researchId: `HX-RES-2026-${nextNum}`,
          fullName: safeName,
          photoUrl: photoUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(safeName)}`,
          bio: "Biomedical researcher on the Healix BioLabs network.",
          researchInterests: JSON.stringify([]),
          skills: JSON.stringify([]),
          slug,
          isVerified: false,
        },
      });

      // Attach to user object
      (user as any).researcher = researcher;

      // Send welcome email for new provisions
      try {
        await sendWelcomeEmail(email, safeName, researcher.researchId, slug);
      } catch (mailErr) {
        console.error("Welcome email failed during auto-provision:", mailErr);
      }
    }

    return user;
  } catch (err) {
    console.error("autoProvisionLocalUser failed:", err);
    return null;
  }
}

export async function getCurrentUser(): Promise<HealixUser | null> {
  const cookieStore = await cookies();

  // ──────────────────────────────────────────────────────────────
  // 1. Supabase Token Authentication
  // ──────────────────────────────────────────────────────────────
  if (isSupabaseConfigured) {
    try {
      const token = cookieStore.get("healix_supabase_token")?.value;
      if (token) {
        const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);
        if (supabaseUser && supabaseUser.email && !error) {
          const email = supabaseUser.email;
          const name =
            supabaseUser.user_metadata?.full_name ||
            supabaseUser.user_metadata?.name ||
            email.split("@")[0];
          const photoUrl = supabaseUser.user_metadata?.avatar_url || null;

          // Find user in local DB — auto-create if missing (e.g. registered via OAuth)
          let dbUser = null;
          try {
            dbUser = await prisma.user.findUnique({
              where: { email },
              include: { researcher: true },
            });

            if (!dbUser) {
              // User authenticated with Supabase but not in local DB — auto-provision
              dbUser = await autoProvisionLocalUser(email, name, photoUrl) as any;
            }
          } catch (dbError) {
            console.error("Database connection failed in session resolver:", dbError);
            return null;
          }

          if (dbUser) {
            return {
              id: dbUser.id,
              email: dbUser.email,
              name: dbUser.name,
              role: dbUser.role,
              photoUrl: dbUser.photoUrl,
              researcherId: (dbUser as any).researcher?.id,
              researcherSlug: (dbUser as any).researcher?.slug || undefined,
            };
          }
          
          return null;
        }
      }
    } catch (err) {
      console.error("Supabase session resolver failed:", err);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // 2. Clerk Authentication (Legacy)
  // ──────────────────────────────────────────────────────────────
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkEnabled =
    publishableKey &&
    publishableKey !== "pk_test_placeholder" &&
    publishableKey.startsWith("pk_");

  if (isClerkEnabled) {
    try {
      const { currentUser } = await import("@clerk/nextjs/server");
      const clerkUser = await currentUser();
      if (clerkUser) {
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        if (email) {
          let dbUser = await prisma.user.findUnique({
            where: { email },
            include: { researcher: true },
          });

          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                email,
                name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
                role: "RESEARCHER",
                photoUrl: clerkUser.imageUrl,
              },
              include: { researcher: true },
            });

            try {
              await sendWelcomeEmail(email, dbUser.name || email);
            } catch (mailErr) {
              console.error("Failed to send welcome email for Clerk user:", mailErr);
            }
          }

          return {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role,
            photoUrl: dbUser.photoUrl,
            researcherId: (dbUser as any).researcher?.id,
            researcherSlug: (dbUser as any).researcher?.slug || undefined,
          };
        }
      }
    } catch (err) {
      console.error("Clerk currentUser resolver failed:", err);
    }
  }

  return null;
}
