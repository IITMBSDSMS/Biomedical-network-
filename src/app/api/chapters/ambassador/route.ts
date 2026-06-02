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

    // 1. Save application to database
    const application = await prisma.ambassadorApplication.create({
      data: {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        collegeName: collegeName.trim(),
        degreeProgram: degreeProgram?.trim() || null,
        yearOfStudy: yearOfStudy || null,
        linkedin: linkedin?.trim() || null,
        sop: sop.trim(),
        status: "PENDING",
      },
    });

    // 2. Dispatch Ambassador application email to applicant
    await sendAmbassadorApplicationEmail(
      email,
      fullName,
      collegeName,
      degreeProgram,
      yearOfStudy,
      linkedin,
      sop
    );

    // 3. Notify all Admins in database
    try {
      const admins = await prisma.user.findMany({
        where: { role: "ADMIN" },
      });

      for (const admin of admins) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            title: "New Ambassador Application",
            message: `${fullName} from ${collegeName} has applied to be a campus ambassador.`,
          },
        });
      }
    } catch (dbErr) {
      console.error("Failed to create admin notification for ambassador application:", dbErr);
    }

    return NextResponse.json({ success: true, id: application.id });
  } catch (err: any) {
    console.error("Ambassador application API error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
