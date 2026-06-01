import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { sendEmail, getIncompleteProfileReminderTemplate } from "@/lib/mail";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Find researchers with incomplete profiles (e.g., empty bio, empty interests, or empty skills)
    const researchers = await prisma.researcher.findMany({
      include: { user: true },
    });

    let count = 0;
    for (const res of researchers) {
      const interests = JSON.parse(res.researchInterests) as string[];
      const skills = JSON.parse(res.skills) as string[];
      const isIncomplete = !res.bio || interests.length === 0 || skills.length === 0;

      if (isIncomplete && res.user) {
        // Send simulated incomplete reminder email
        const emailBody = getIncompleteProfileReminderTemplate(res.fullName, res.slug);
        await sendEmail({
          to: res.user.email,
          subject: "Complete Your Healix BioLabs Profile",
          body: emailBody,
        });
        count++;
      }
    }

    return NextResponse.json({ success: true, count });
  } catch (err: any) {
    console.error("Reminder trigger error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
