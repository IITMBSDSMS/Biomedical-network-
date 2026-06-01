import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const { applicationId, status } = body;

    if (!applicationId || !status) {
      return NextResponse.json({ error: "Application ID and Status are required" }, { status: 400 });
    }

    const application = await prisma.fellowshipApplication.update({
      where: { id: applicationId },
      data: {
        status,
      },
    });

    return NextResponse.json({ success: true, application });
  } catch (err: any) {
    console.error("Admin fellowship resolution error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
