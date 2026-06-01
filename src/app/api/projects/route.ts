import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user is a researcher
    const researcher = await prisma.researcher.findUnique({
      where: { userId: user.id },
    });

    if (!researcher) {
      return NextResponse.json(
        { error: "You must complete your researcher profile before creating projects." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, category, timeline } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and Description are required" }, { status: 400 });
    }

    // Create the project
    const project = await prisma.project.create({
      data: {
        title,
        description,
        category: category || "Biomedical",
        timeline: timeline || "Ongoing",
        progress: 0, // Starts at 0%
        creatorId: researcher.id,
      },
    });

    // Add creator as OWNER member
    await prisma.projectMember.create({
      data: {
        projectId: project.id,
        researcherId: researcher.id,
        role: "OWNER",
      },
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Project Created",
        message: `Your project "${title}" was successfully created. You can now invite members and track milestones.`,
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (err: any) {
    console.error("Projects API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
