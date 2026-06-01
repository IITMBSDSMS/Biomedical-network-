import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const progress = await prisma.trainingProgress.findMany({
      where: { userId: user.id },
    });

    const certificate = await prisma.certificate.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({
      progress,
      certificate,
    });
  } catch (error: any) {
    console.error("Failed to fetch training status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
