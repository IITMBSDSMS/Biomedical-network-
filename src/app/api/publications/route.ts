import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user has a researcher profile
    const researcher = await prisma.researcher.findUnique({
      where: { userId: user.id },
    });

    if (!researcher) {
      return NextResponse.json(
        { error: "You must complete your researcher profile before uploading publications." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, abstract, keywords, authors, category, pdfUrl, fileKey } = body;

    if (!title || !abstract || !category) {
      return NextResponse.json({ error: "Title, Abstract, and Category are required" }, { status: 400 });
    }

    // Default authors array to contain researcher's name if none specified
    const authorsList = authors && authors.length > 0 ? authors : [researcher.fullName];

    const publication = await prisma.publication.create({
      data: {
        title,
        abstract,
        keywords: JSON.stringify(keywords || []),
        authors: JSON.stringify(authorsList),
        category,
        pdfUrl,
        fileKey,
        isApproved: false, // Default is pending admin approval
        researcherId: researcher.id,
      },
    });

    // Notify admins (create notification in db)
    await prisma.notification.create({
      data: {
        userId: user.id, // Notification to the researcher acknowledging upload
        title: "Publication Received",
        message: `Your publication "${title}" has been successfully uploaded and is pending administrative approval.`,
      },
    });

    return NextResponse.json({ success: true, publication });
  } catch (err: any) {
    console.error("Publications API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
