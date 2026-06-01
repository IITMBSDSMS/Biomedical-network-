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
    const { researcherId, verify } = body;

    if (!researcherId) {
      return NextResponse.json({ error: "Researcher ID is required" }, { status: 400 });
    }

    const researcher = await prisma.researcher.update({
      where: { id: researcherId },
      data: {
        isVerified: verify,
      },
      include: {
        user: true,
      },
    });

    // Notify researcher
    if (researcher.user) {
      await prisma.notification.create({
        data: {
          userId: researcher.user.id,
          title: verify ? "Profile Verified" : "Profile Unverified",
          message: verify
            ? "Your researcher profile has been successfully verified by Healix admin. You now have a verified badge."
            : "Your researcher verification status has been revoked.",
        },
      });
    }

    return NextResponse.json({ success: true, researcher });
  } catch (err: any) {
    console.error("Admin verify error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
