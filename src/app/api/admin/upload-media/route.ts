import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getCurrentUser } from "@/lib/auth";
import { uploadFile } from "@/lib/storage";

const CONFIG_PATH = path.join(process.cwd(), "data", "content-config.json");

function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
  } catch {
    return { videoSection: {}, chapters: {} };
  }
}

function writeConfig(data: object) {
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string; // "video-cover" | "chapter-photo" | "video-url-update"
    const chapterId = formData.get("chapterId") as string | null;

    // Handle YouTube URL update (no file upload needed)
    if (type === "video-url-update") {
      const youtubeUrl = formData.get("youtubeUrl") as string;
      const title = formData.get("title") as string;
      const subtitle = formData.get("subtitle") as string;
      const duration = formData.get("duration") as string;

      const config = readConfig();
      config.videoSection = {
        ...config.videoSection,
        ...(youtubeUrl && { youtubeUrl }),
        ...(title && { title }),
        ...(subtitle && { subtitle }),
        ...(duration && { duration }),
      };
      writeConfig(config);
      return NextResponse.json({ success: true, config: config.videoSection });
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (type === "video-cover" && !isImage) {
      return NextResponse.json({ error: "Video cover must be an image file" }, { status: 400 });
    }
    if (type === "chapter-photo" && !isImage) {
      return NextResponse.json({ error: "Chapter photo must be an image file" }, { status: 400 });
    }

    // Determine upload folder
    const folder =
      type === "video-cover" ? "uploads/video-covers" :
      type === "chapter-photo" ? "uploads/chapters" :
      "uploads/media";

    const { url } = await uploadFile(file, folder);

    // Update config only if modifying static content settings
    let config = null;
    if (type === "video-cover") {
      config = readConfig();
      config.videoSection = { ...config.videoSection, coverImage: url };
      writeConfig(config);
    } else if (type === "chapter-photo" && chapterId) {
      config = readConfig();
      if (!config.chapters) config.chapters = {};
      config.chapters[chapterId] = { ...config.chapters[chapterId], image: url };
      writeConfig(config);
    }

    return NextResponse.json({ success: true, url, config });
  } catch (err: any) {
    console.error("Media upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
