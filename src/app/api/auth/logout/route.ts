import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Clear cookies by setting maxAge to 0
    cookieStore.set("healix_supabase_token", "", {
      path: "/",
      maxAge: 0,
      sameSite: "lax",
      secure: true,
    });
    
    cookieStore.set("healix_mock_user_email", "", {
      path: "/",
      maxAge: 0,
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout API failed:", error);
    return NextResponse.json({ success: false, error: "Logout failed" }, { status: 500 });
  }
}
