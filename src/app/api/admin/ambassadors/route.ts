import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/admin/ambassadors — list all ambassador applications
export async function GET(req: NextRequest) {
  try {
    const applications = await prisma.ambassadorApplication.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ applications });
  } catch (err: any) {
    console.error("Failed to fetch ambassador applications:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/admin/ambassadors — update status of an application
export async function POST(req: NextRequest) {
  try {
    const { applicationId, status } = await req.json();

    if (!applicationId || !["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const updated = await prisma.ambassadorApplication.update({
      where: { id: applicationId },
      data: { status },
    });

    return NextResponse.json({ success: true, application: updated });
  } catch (err: any) {
    console.error("Failed to update ambassador application status:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
