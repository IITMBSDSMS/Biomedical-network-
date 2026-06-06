import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { ecoConnection } from "@/lib/db-ecosystem";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { researcherId, type, subject, message, scheduledAt } = body;

    if (!researcherId || !type) {
      return NextResponse.json({ error: "researcherId and type are required" }, { status: 400 });
    }

    const connection = await ecoConnection.create({
      studentId: user.id,
      studentName: user.name || user.email.split("@")[0],
      studentEmail: user.email,
      researcherId,
      type,
      subject,
      message,
      scheduledAt,
    });

    // Notify the researcher
    try {
      const researcher = await prisma.researcher.findUnique({ where: { id: researcherId } });
      if (researcher?.userId) {
        const typeLabel = type === "CALL" ? "call request" : "message";
        await prisma.notification.create({
          data: {
            userId: researcher.userId,
            title: `New ${typeLabel} from ${user.name || user.email}`,
            message: subject || message || `${user.name} wants to connect with you`,
            type: "CONNECTION",
            isRead: false,
          },
        });
      }
    } catch (notifErr) {
      console.warn("Notification skipped:", notifErr);
    }

    return NextResponse.json({ success: true, connection });
  } catch (err: any) {
    console.error("Ecosystem connect error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) return NextResponse.json({ error: "id and status required" }, { status: 400 });

    const updated = await ecoConnection.updateStatus(id, status);
    return NextResponse.json({ success: true, connection: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const researcher = await prisma.researcher.findUnique({ where: { userId: user.id } });
    if (!researcher) return NextResponse.json({ connections: [] });

    const connections = await ecoConnection.findManyForResearcher(researcher.id);
    return NextResponse.json({ connections });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
