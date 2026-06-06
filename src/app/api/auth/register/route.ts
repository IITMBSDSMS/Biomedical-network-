import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const { email, name, role, triggerWelcome } = await req.json();

    if (!email || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let user: any = null;
    let isNewUser = false;

    try {
      // Check if user already exists
      user = await prisma.user.findUnique({
        where: { email },
        include: { researcher: true },
      });

      isNewUser = !user;

      if (!user) {
        // Create user
        user = await prisma.user.create({
          data: {
            email,
            name: name || email.split("@")[0],
            role: role.toUpperCase(),
          },
          include: { researcher: true },
        });
      }

      // If role is RESEARCHER and no researcher profile exists, create one
      if (user.role === "RESEARCHER" && !user.researcher) {
        const count = await prisma.researcher.count();
        const nextNum = String(count + 1).padStart(4, "0");
        const researchId = `HX-RES-2026-${nextNum}`;
        
        const baseSlug = (name || email.split("@")[0])
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        const slug = `${baseSlug}-${nextNum}`;

        const newProfile = await prisma.researcher.create({
          data: {
            userId: user.id,
            researchId,
            fullName: user.name || "Researcher",
            photoUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name || "user")}`,
            bio: "Biomedical researcher on the Healix BioLabs network.",
            researchInterests: JSON.stringify([]),
            skills: JSON.stringify([]),
            slug,
            isVerified: false,
          },
        });
        
        // Attach newly created researcher profile to the user object
        user.researcher = newProfile;
      }
    } catch (dbError: any) {
      console.error("Database sync failed in register route:", dbError);
      throw dbError;
    }

    // Send Welcome Email if this is a newly registered user or triggerWelcome is active
    if (isNewUser || triggerWelcome) {
      try {
        const researchId = user.researcher?.researchId;
        const slug = user.researcher?.slug;
        await sendWelcomeEmail(email, user.name || email, researchId, slug);
      } catch (mailErr) {
        console.error("Failed to send welcome email upon registration sync:", mailErr);
      }
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Registration sync failed:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

