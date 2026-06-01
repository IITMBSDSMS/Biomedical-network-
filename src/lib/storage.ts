import fs from "fs";
import path from "path";

export async function uploadFile(
  file: File,
  folder: string = "uploads"
): Promise<{ url: string; key: string }> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileExtension = file.name.split(".").pop();
  const uniqueId = Math.random().toString(36).substring(2, 15);
  const safeFilename = `${Date.now()}-${uniqueId}.${fileExtension}`;
  const fileKey = `${folder}/${safeFilename}`;

  // Local filesystem storage (saves in public folder of Next.js)
  try {
    const uploadDir = path.join(process.cwd(), "public", folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, safeFilename);
    fs.writeFileSync(filePath, buffer);

    const url = `/${folder}/${safeFilename}`;
    return { url, key: fileKey };
  } catch (err) {
    console.error("Local file storage upload failed:", err);
    throw err;
  }
}
