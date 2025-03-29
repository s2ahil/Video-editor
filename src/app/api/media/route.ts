import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define the types for Cloudinary response
interface CloudinaryResource {
  secure_url: string;
  public_id: string;

}

export async function GET() {
  try {
    // Fetch images
    const images = await cloudinary.search
      .expression("folder:uploads/images")
      .sort_by("created_at", "desc")
      .max_results(20)
      .execute();

    // Fetch videos
    const videos = await cloudinary.search
      .expression("folder:uploads/videos")
      .sort_by("created_at", "desc")
      .max_results(20)
      .execute();

    return NextResponse.json({
      images: images.resources.map((file: CloudinaryResource) => file.secure_url),
      videos: videos.resources.map((file: CloudinaryResource) => file.secure_url),
    });
  } catch (error) {
    console.error("Failed to fetch media:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}
