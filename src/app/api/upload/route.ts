import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/storage";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const result = await uploadFile(file, folder);

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    console.error("Upload API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
