import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const customName = formData.get("customName") as string;

    if (!file || !customName) {
      return NextResponse.json({ error: "No file or custom name provided" }, { status: 400 });
    }

    // Determine file type and directory
    let uploadDir = "public/uploads";
    if (file.type.startsWith("image/")) {
      uploadDir = "public/uploads/images";
    } else if (file.type.startsWith("video/")) {
      uploadDir = "public/uploads/videos";
    }

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define file path
    const filePath = path.join(process.cwd(), uploadDir, customName);

    // Save file
    await writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${uploadDir.split("/").pop()}/${customName}` }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: "Upload failed: " + error }, { status: 500 });
  }
}
