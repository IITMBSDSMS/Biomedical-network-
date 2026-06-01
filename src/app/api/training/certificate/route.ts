import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify all 4 modules are completed (index 0, 1, 2, 3)
    const progress = await prisma.trainingProgress.findMany({
      where: {
        userId: user.id,
        isCompleted: true,
      },
    });

    const completedIndexes = progress.map((p) => p.moduleIndex);
    const hasCompletedAll = [0, 1, 2, 3].every((idx) => completedIndexes.includes(idx));

    if (!hasCompletedAll) {
      return NextResponse.json(
        { error: "Incomplete progress. All 4 modules must be passed." },
        { status: 400 }
      );
    }

    // Check if certificate already exists
    let certificate = await prisma.certificate.findUnique({
      where: { userId: user.id },
    });

    if (!certificate) {
      // Generate a unique cryptographic certificate hash
      const hashInput = `${user.id}-${Date.now()}`;
      const certHash = "HX-CERT-" + crypto.createHash("sha256").update(hashInput).digest("hex").substring(0, 16).toUpperCase();
      
      certificate = await prisma.certificate.create({
        data: {
          userId: user.id,
          fullName: user.name || "Healix Scholar",
          certHash,
        },
      });
    }

    return NextResponse.json({
      success: true,
      certificate,
    });
  } catch (error: any) {
    console.error("Failed to generate certificate:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
