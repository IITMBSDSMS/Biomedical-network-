import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { sendEmail, getPublicationApprovedTemplate } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const { publicationId, approve } = body;

    if (!publicationId) {
      return NextResponse.json({ error: "Publication ID is required" }, { status: 400 });
    }

    const publication = await prisma.publication.update({
      where: { id: publicationId },
      data: {
        isApproved: approve,
      },
      include: {
        researcher: {
          include: {
            user: true,
          },
        },
      },
    });

    // If approved, trigger user notification & email
    if (approve && publication.researcher.user) {
      await prisma.notification.create({
        data: {
          userId: publication.researcher.user.id,
          title: "Publication Approved",
          message: `Your publication "${publication.title}" has been approved and is now public.`,
        },
      });

      // Send Resend email template
      const emailBody = getPublicationApprovedTemplate(
        publication.title,
        publication.researcher.fullName,
        publication.id
      );
      await sendEmail({
        to: publication.researcher.user.email,
        subject: "Your Publication Has Been Approved",
        body: emailBody,
      });
    }

    return NextResponse.json({ success: true, publication });
  } catch (err: any) {
    console.error("Admin approve publication error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
