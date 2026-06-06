import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Access prohibited" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Failed fetching users for admin:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Access prohibited" }, { status: 403 });
    }

    const { userId, role } = await req.json();
    if (!userId || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const validRoles = ["ADMIN", "RESEARCHER", "STUDENT", "INSTITUTION"];
    const upperRole = role.toUpperCase();
    if (!validRoles.includes(upperRole)) {
      return NextResponse.json({ error: "Invalid role value" }, { status: 400 });
    }

    // Failsafe: Prevent admins from self-demoting
    if (userId === currentUser.id && upperRole !== "ADMIN") {
      return NextResponse.json({ error: "You cannot demote yourself from Admin status" }, { status: 400 });
    }

    // Update the role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: upperRole },
    });

    // Auto-provision researcher profile if user is promoted/set to RESEARCHER and doesn't have one
    if (upperRole === "RESEARCHER") {
      const dbUser = await prisma.user.findUnique({
        where: { id: userId },
        include: { researcher: true },
      });

      if (dbUser && !dbUser.researcher) {
        const count = await prisma.researcher.count();
        const nextNum = String(count + 1).padStart(4, "0");
        const safeName = (dbUser.name || dbUser.email.split("@")[0]).trim();
        const baseSlug = safeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const slug = `${baseSlug}-${nextNum}`;

        await prisma.researcher.create({
          data: {
            userId: dbUser.id,
            researchId: `HX-RES-2026-${nextNum}`,
            fullName: safeName,
            photoUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(safeName)}`,
            bio: "Biomedical researcher on the Healix BioLabs network.",
            researchInterests: JSON.stringify([]),
            skills: JSON.stringify([]),
            slug,
            isVerified: false,
          },
        });
      }
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Failed updating user role:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
