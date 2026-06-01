import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendAmbassadorApplicationEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      collegeName,
      degreeProgram,
      yearOfStudy,
      email,
      linkedin,
      sop,
    } = body;

    if (!fullName || !collegeName || !email || !sop) {
      return NextResponse.json(
        { error: "Full Name, College Name, Email, and Statement of Purpose are required fields." },
        { status: 400 }
      );
    }

    // 1. Dispatch Ambassador application email
    await sendAmbassadorApplicationEmail(
      email,
      fullName,
      collegeName,
      degreeProgram,
      yearOfStudy,
      linkedin,
      sop
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
            title: "New Ambassador Application",
            message: `${fullName} has applied to be a campus ambassador for ${collegeName}.`,
          },
        });
      }
    } catch (dbErr) {
      console.error("Failed to create admin notification for ambassador application:", dbErr);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Ambassador application API error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
