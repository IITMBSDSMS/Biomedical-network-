import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { ecoConnection, ecoDoubt, ecoThesis } from "@/lib/db-ecosystem";
import { prisma } from "@/lib/db";

/** GET /api/ecosystem/inbox — unified inbox for a researcher */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const researcher = await prisma.researcher.findUnique({ where: { userId: user.id } });
    if (!researcher) {
      return NextResponse.json({ connections: [], doubts: [], thesis: [], total: 0 });
    }

    const [connections, doubts, thesis] = await Promise.all([
      ecoConnection.findManyForResearcher(researcher.id),
      ecoDoubt.findManyForResearcher(researcher.id),
      ecoThesis.findManyForResearcher(researcher.id),
    ]);

    return NextResponse.json({
      connections,
      doubts,
      thesis,
      total: connections.length + doubts.length + thesis.length,
    });
  } catch (err: any) {
    console.error("Inbox fetch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
