import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const imagesPath = path.join(process.cwd(), "public/uploads/images");
    const videosPath = path.join(process.cwd(), "public/uploads/videos");

    // Read files from both directories
    const imageFiles = await readdir(imagesPath).catch(() => []);
    const videoFiles = await readdir(videosPath).catch(() => []);

    return NextResponse.json({
      images: imageFiles.map((file) => `/uploads/images/${file}`),
      videos: videoFiles.map((file) => `/uploads/videos/${file}`),
    });
  } catch (error:unknown) {
    return NextResponse.json({ error: "Failed to fetch media"+error }, { status: 500 });
  }
}
