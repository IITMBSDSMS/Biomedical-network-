import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({ authenticated: !!user, user });
  } catch (error) {
    console.error("Failed fetching current user:", error);
    return NextResponse.json({ authenticated: false, user: null, error: "Internal server error" }, { status: 500 });
  }
}
