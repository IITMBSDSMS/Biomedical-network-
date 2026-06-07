import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const revalidate = 0;
export const dynamic = "force-dynamic";

// GET is public so the landing page can fetch members dynamically
export async function GET() {
  try {
    const members = await prisma.leadershipMember.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ members });
  } catch (error) {
    console.error("Failed fetching leadership members:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Access prohibited" }, { status: 403 });
    }

    const body = await req.json();
    const { section, name, role, institution, expertise, photo, linkedin, bio, sortOrder } = body;

    if (!section || !name || !role || !institution || !photo || !linkedin || !bio) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newMember = await prisma.leadershipMember.create({
      data: {
        section,
        name,
        role,
        institution,
        expertise: typeof expertise === "string" ? expertise : JSON.stringify(expertise || []),
        photo,
        linkedin,
        bio,
        sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
      },
    });

    return NextResponse.json({ success: true, member: newMember });
  } catch (error) {
    console.error("Failed creating leadership member:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Access prohibited" }, { status: 403 });
    }

    const body = await req.json();
    const { id, section, name, role, institution, expertise, photo, linkedin, bio, sortOrder } = body;

    if (!id || !section || !name || !role || !institution || !photo || !linkedin || !bio) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedMember = await prisma.leadershipMember.update({
      where: { id },
      data: {
        section,
        name,
        role,
        institution,
        expertise: typeof expertise === "string" ? expertise : JSON.stringify(expertise || []),
        photo,
        linkedin,
        bio,
        sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
      },
    });

    return NextResponse.json({ success: true, member: updatedMember });
  } catch (error) {
    console.error("Failed updating leadership member:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Access prohibited" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing member ID" }, { status: 400 });
    }

    await prisma.leadershipMember.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed deleting leadership member:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
