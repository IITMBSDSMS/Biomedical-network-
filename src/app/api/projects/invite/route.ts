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
    const { projectId, researcherId } = body;

    if (!projectId || !researcherId) {
      return NextResponse.json({ error: "Project ID and Researcher ID are required" }, { status: 400 });
    }

    // Verify current user is a member/owner of the project
    const hostResearcher = await prisma.researcher.findUnique({
      where: { userId: user.id },
    });

    if (!hostResearcher) {
      return NextResponse.json({ error: "Researcher profile not found" }, { status: 403 });
    }

    const hostMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_researcherId: {
          projectId,
          researcherId: hostResearcher.id,
        },
      },
    });

    if (!hostMembership || hostMembership.role !== "OWNER") {
      return NextResponse.json({ error: "Only the project Owner can invite members." }, { status: 403 });
    }

    // Check if user is already a member
    const existingMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_researcherId: {
          projectId,
          researcherId,
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json({ error: "Researcher is already a member of this project" }, { status: 400 });
    }

    // Create the membership
    const membership = await prisma.projectMember.create({
      data: {
        projectId,
        researcherId,
        role: "COLLABORATOR",
      },
    });

    // Find the invited user to notify them
    const invitedResearcher = await prisma.researcher.findUnique({
      where: { id: researcherId },
      include: { user: true },
    });

    if (invitedResearcher && invitedResearcher.userId) {
      await prisma.notification.create({
        data: {
          userId: invitedResearcher.userId,
          title: "Added to Project",
          message: `You have been added as a collaborator to the project by ${hostResearcher.fullName}.`,
        },
      });
    }

    return NextResponse.json({ success: true, membership });
  } catch (err: any) {
    console.error("Invite API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
