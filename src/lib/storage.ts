import fs from "fs";
import path from "path";
import { supabaseAdmin, isSupabaseAdminConfigured } from "./supabase-admin";

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

  // 1. Try Supabase Storage first (Serverless production on Vercel with read-only filesystem)
  if (isSupabaseAdminConfigured) {
    try {
      const bucketName = folder === "avatars" ? "avatars" : "uploads";

      // Ensure the bucket exists and is public
      await supabaseAdmin.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      }).catch(() => {
        // Ignore duplicate / already exists errors
      });

      // Upload file directly
      const { data, error } = await supabaseAdmin.storage
        .from(bucketName)
        .upload(safeFilename, buffer, {
          contentType: file.type || "image/png",
          upsert: true,
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from(bucketName)
        .getPublicUrl(safeFilename);

      console.log(`Successfully uploaded to Supabase Storage (${bucketName}):`, publicUrl);
      return { url: publicUrl, key: fileKey };
    } catch (err) {
      console.warn("Supabase storage upload failed, falling back to local filesystem:", err);
    }
  }

  // 2. Fallback: Local filesystem storage (for local development)
  try {
    const uploadDir = path.join(process.cwd(), "public", folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, safeFilename);
    fs.writeFileSync(filePath, buffer);

    const url = `/${folder}/${safeFilename}`;
    console.log("Successfully saved file to local filesystem:", url);
    return { url, key: fileKey };
  } catch (err) {
    console.error("Local file storage upload failed:", err);
    throw err;
  }
}
