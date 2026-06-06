import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, photoUrl, bio, institutionName, researchInterests, skills, linkedIn } = body;

    if (!fullName) {
      return NextResponse.json({ error: "Full Name is required" }, { status: 400 });
    }

    // Check if researcher profile already exists for user
    let researcher = await prisma.researcher.findUnique({
      where: { userId: user.id },
    });

    const slug = fullName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    if (researcher) {
      // Update existing profile
      researcher = await prisma.researcher.update({
        where: { id: researcher.id },
        data: {
          fullName,
          photoUrl: photoUrl || researcher.photoUrl,
          bio,
          institutionName,
          researchInterests: JSON.stringify(researchInterests || []),
          skills: JSON.stringify(skills || []),
          linkedIn,
          slug,
        },
      });

      // Sync to User record
      await prisma.user.update({
        where: { id: user.id },
        data: {
          name: fullName,
          photoUrl: photoUrl || user.photoUrl,
        },
      });
    } else {
      // Generate automatic Research ID: HX-RES-2026-XXXX
      const lastResearcher = await prisma.researcher.findFirst({
        orderBy: { researchId: "desc" },
      });

      let nextNum = 1;
      if (lastResearcher && lastResearcher.researchId) {
        const parts = lastResearcher.researchId.split("-");
        const lastNum = parseInt(parts[parts.length - 1], 10);
        if (!isNaN(lastNum)) {
          nextNum = lastNum + 1;
        }
      }

      const researchId = `HX-RES-2026-${String(nextNum).padStart(4, "0")}`;

      // Create new profile
      researcher = await prisma.researcher.create({
        data: {
          userId: user.id,
          researchId,
          fullName,
          photoUrl: photoUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${fullName}`,
          bio,
          institutionName,
          researchInterests: JSON.stringify(researchInterests || []),
          skills: JSON.stringify(skills || []),
          linkedIn,
          slug,
          isVerified: false, // Must be verified by admin
          researchScore: 10.0, // Initial base research score
        },
      });

      // Sync to User record
      await prisma.user.update({
        where: { id: user.id },
        data: {
          name: fullName,
          photoUrl: photoUrl || researcher.photoUrl,
        },
      });

      // Log email trigger welcome message
      await prisma.emailLog.create({
        data: {
          to: user.email,
          subject: "Welcome to Healix BioLabs",
          body: `
            <h3>Welcome to Healix BioLabs</h3>
            <p>Dear ${fullName},</p>
            <p>Your researcher profile has been successfully set up! Your generated Research ID is <strong>${researchId}</strong>.</p>
            <p>Admin verification is currently pending. In the meantime, you can create projects and upload publications.</p>
          `,
          status: "LOGGED",
        },
      });
    }

    return NextResponse.json({ success: true, researcher });
  } catch (err: any) {
    console.error("Profile API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
