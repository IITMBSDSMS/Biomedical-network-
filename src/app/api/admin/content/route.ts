import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getCurrentUser } from "@/lib/auth";

const CONFIG_PATH = path.join(process.cwd(), "data", "content-config.json");

function readConfig() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {
      videoSection: {
        youtubeUrl: "https://www.youtube.com/embed/815mO_K6Wk8",
        coverImage: "/video_cover.png",
        title: "The Future of Biomedical Research: Healing at the Nano-scale",
        subtitle: "Institutional Keynote",
        duration: "10:24 Mins",
      },
      chapters: {
        "chap-1": { image: "/aiims_delhi_campus.png" },
        "chap-2": { image: "/iit_delhi_campus.png" },
        "chap-3": { image: "/vit_vellore_campus.png" },
        "chap-4": { image: "/bits_pilani_campus.png" },
        "chap-5": { image: "/delhi_university_campus.png" },
      },
    };
  }
}

function writeConfig(data: object) {
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// GET /api/admin/content — public read (for landing + chapters pages)
export async function GET() {
  const config = readConfig();
  return NextResponse.json(config);
}

// POST /api/admin/content — admin-only write
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const current = readConfig();

    // Merge partial updates
    const updated = {
      ...current,
      ...body,
      videoSection: { ...current.videoSection, ...(body.videoSection || {}) },
      chapters: { ...current.chapters, ...(body.chapters || {}) },
    };

    writeConfig(updated);
    return NextResponse.json({ success: true, config: updated });
  } catch (err: any) {
    console.error("Content config write error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
