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

export async function getCurrentUser(): Promise<HealixUser | null> {
  const cookieStore = await cookies();

  // 1. Supabase Authentication (If configured)
  if (isSupabaseConfigured) {
    try {
      const token = cookieStore.get("healix_supabase_token")?.value;
      if (token) {
        const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);
        if (supabaseUser && supabaseUser.email) {
          const email = supabaseUser.email;
          
          const dbUser = await prisma.user.findUnique({
            where: { email },
            include: { researcher: true },
          });

          if (dbUser) {
            return {
              id: dbUser.id,
              email: dbUser.email,
              name: dbUser.name,
              role: dbUser.role,
              photoUrl: dbUser.photoUrl,
              researcherId: dbUser.researcher?.id,
              researcherSlug: dbUser.researcher?.slug || undefined,
            };
          }
        }
      }
    } catch (err) {
      console.error("Supabase session resolver failed:", err);
    }
  }

  // 2. Clerk Authentication (If configured)
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkEnabled = publishableKey && publishableKey !== "pk_test_placeholder" && publishableKey.startsWith("pk_");

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
                role: "RESEARCHER", // Default role
                photoUrl: clerkUser.imageUrl,
              },
              include: { researcher: true },
            });

            // Send Welcome Email for new Clerk signups
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
            researcherId: dbUser.researcher?.id,
            researcherSlug: dbUser.researcher?.slug || undefined,
          };
        }
      }
    } catch (err) {
      console.error("Clerk currentUser resolver failed:", err);
    }
  }

  // 3. Fallback to Developer Mock Cookie Sandbox when Clerk/Supabase is not configured
  try {
    const mockEmail = cookieStore.get("healix_mock_user_email")?.value;

    if (mockEmail) {
      const dbUser = await prisma.user.findUnique({
        where: { email: mockEmail },
        include: { researcher: true },
      });

      if (dbUser) {
        return {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role,
          photoUrl: dbUser.photoUrl,
          researcherId: dbUser.researcher?.id,
          researcherSlug: dbUser.researcher?.slug || undefined,
        };
      }
    }
  } catch (err) {
    console.error("Failed to read mock cookies in server component", err);
  }

  return null;
}

