import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import streamifier from "streamifier";

// Ensure environment variables are properly loaded
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error("Missing Cloudinary environment variables.");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const customName = formData.get("customName");

    if (!(file instanceof File) || typeof customName !== "string") {
      return NextResponse.json({ error: "Invalid file or custom name" }, { status: 400 });
    }

    // Determine file type for folder structure
    let cloudFolder = "uploads";
    if (file.type.startsWith("image/")) {
      cloudFolder = "uploads/images";
    } else if (file.type.startsWith("video/")) {
      cloudFolder = "uploads/videos";
    }

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using a stream
    const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: cloudFolder, public_id: customName },
        (error: UploadApiErrorResponse | null, result?: UploadApiResponse) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error("Upload result is undefined"));
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    return NextResponse.json({ url: uploadResult.secure_url }, { status: 200 });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: "Upload failed", details: (error as Error).message },
      { status: 500 }
    );
  }
}
