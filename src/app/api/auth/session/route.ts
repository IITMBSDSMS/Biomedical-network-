import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Session fetch failed:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
