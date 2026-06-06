import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { ecoDoubt } from "@/lib/db-ecosystem";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { researcherId, title, description } = body;

    if (!researcherId || !title || !description) {
      return NextResponse.json({ error: "researcherId, title and description are required" }, { status: 400 });
    }

    const doubt = await ecoDoubt.create({
      studentId: user.id,
      studentName: user.name || user.email.split("@")[0],
      studentEmail: user.email,
      researcherId,
      title,
      description,
    });

    // Notify researcher
    try {
      const researcher = await prisma.researcher.findUnique({ where: { id: researcherId } });
      if (researcher?.userId) {
        await prisma.notification.create({
          data: {
            userId: researcher.userId,
            title: `New doubt from ${user.name || user.email}`,
            message: title,
            type: "DOUBT",
            isRead: false,
          },
        });
      }
    } catch (notifErr) {
      console.warn("Notification skipped:", notifErr);
    }

    return NextResponse.json({ success: true, doubt });
  } catch (err: any) {
    console.error("Doubt submit error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { id, answer } = body;
    if (!id || !answer) return NextResponse.json({ error: "id and answer required" }, { status: 400 });

    const updated = await ecoDoubt.answer(id, answer);
    return NextResponse.json({ success: true, doubt: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const researcher = await prisma.researcher.findUnique({ where: { userId: user.id } });
    if (!researcher) return NextResponse.json({ doubts: [] });

    const doubts = await ecoDoubt.findManyForResearcher(researcher.id);
    return NextResponse.json({ doubts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
