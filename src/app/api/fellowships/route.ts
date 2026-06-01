import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail, getFellowshipReceivedTemplate } from "@/lib/mail";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, institutionName, course, researchInterests, cvUrl, statementOfPurpose, email } = body;

    if (!fullName || !institutionName || !course || !statementOfPurpose || !email) {
      return NextResponse.json(
        { error: "Full Name, Institution, Course, Email, and Statement of Purpose are required" },
        { status: 400 }
      );
    }

    // Save fellowship application in database
    const application = await prisma.fellowshipApplication.create({
      data: {
        fullName,
        institutionName,
        course,
        researchInterests: JSON.stringify(researchInterests || []),
        cvUrl,
        statementOfPurpose,
        status: "PENDING",
      },
    });

    // Notify admins (create notification in db)
    // Find admin users
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
    });

    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          title: "New Fellowship Application",
          message: `${fullName} has submitted an application for the research fellowship.`,
        },
      });
    }

    // Send confirmation email
    const emailBody = getFellowshipReceivedTemplate(fullName, course, institutionName);
    await sendEmail({
      to: email,
      subject: "Application Successfully Received",
      body: emailBody,
    });

    return NextResponse.json({ success: true, application });
  } catch (err: any) {
    console.error("Fellowship API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
