import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { certHash } = await req.json();

    if (typeof certHash !== "string" || !certHash.trim()) {
      return NextResponse.json({ error: "Missing certificate hash" }, { status: 400 });
    }

    const certificate = await prisma.certificate.findUnique({
      where: { certHash: certHash.trim() },
    });

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found or invalid" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: certificate.userId },
      select: {
        email: true,
        role: true,
        photoUrl: true,
      },
    });

    return NextResponse.json({
      success: true,
      certificate: {
        fullName: certificate.fullName,
        certHash: certificate.certHash,
        issuedAt: certificate.issuedAt,
      },
      user,
    });
  } catch (error: any) {
    console.error("Failed to verify certificate:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
