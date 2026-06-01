import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendChapterRegistrationEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      collegeName,
      department,
      location,
      proposerName,
      proposerEmail,
      proposedMentor,
      plannedActivities,
    } = body;

    if (!collegeName || !department || !location || !proposerName || !proposerEmail) {
      return NextResponse.json(
        { error: "College Name, Department, Location, Proposer Name, and Proposer Email are required fields." },
        { status: 400 }
      );
    }

    // 1. Dispatch Chapter registration email
    await sendChapterRegistrationEmail(
      proposerEmail,
      proposerName,
      collegeName,
      department,
      location,
      proposedMentor,
      plannedActivities
    );

    // 2. Notify all Admins in database
    try {
      const admins = await prisma.user.findMany({
        where: { role: "ADMIN" },
      });

      for (const admin of admins) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            title: "New Chapter Proposed",
            message: `${proposerName} has proposed a new chapter at ${collegeName}.`,
          },
        });
      }
    } catch (dbErr) {
      console.error("Failed to create admin notification for proposed chapter:", dbErr);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Chapter registration API error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
