import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { ecoThesis } from "@/lib/db-ecosystem";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { researcherId, title, description, chapter, fileUrl } = body;

    if (!researcherId || !title) {
      return NextResponse.json({ error: "researcherId and title are required" }, { status: 400 });
    }

    const thesis = await ecoThesis.create({
      studentId: user.id,
      studentName: user.name || user.email.split("@")[0],
      studentEmail: user.email,
      researcherId,
      title,
      description,
      chapter,
      fileUrl,
    });

    // Notify researcher
    try {
      const researcher = await prisma.researcher.findUnique({ where: { id: researcherId } });
      if (researcher?.userId) {
        await prisma.notification.create({
          data: {
            userId: researcher.userId,
            title: `Thesis update from ${user.name || user.email}`,
            message: `${title}${chapter ? ` — Chapter ${chapter}` : ""}`,
            type: "THESIS",
            isRead: false,
          },
        });
      }
    } catch (notifErr) {
      console.warn("Notification skipped:", notifErr);
    }

    return NextResponse.json({ success: true, thesis });
  } catch (err: any) {
    console.error("Thesis submit error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { id, status, feedback } = body;
    if (!id || !status) return NextResponse.json({ error: "id and status required" }, { status: 400 });

    const updated = await ecoThesis.review(id, status, feedback || "");
    return NextResponse.json({ success: true, thesis: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const researcher = await prisma.researcher.findUnique({ where: { userId: user.id } });
    if (!researcher) return NextResponse.json({ thesis: [] });

    const thesis = await ecoThesis.findManyForResearcher(researcher.id);
    return NextResponse.json({ thesis });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
