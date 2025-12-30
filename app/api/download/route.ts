import { NextRequest } from "next/server";
import { getDownloadUrl } from "@/lib/backblaze";

export async function POST(request: NextRequest) {
  try {
    const { fileId } = await request.json();

    if (!fileId) {
      return Response.json({ error: "fileId is required" }, { status: 400 });
    }

    // Generate temporary download URL (valid for 1 hour)
    const downloadUrl = await getDownloadUrl(fileId);

    return Response.json({ 
      success: true, 
      downloadUrl,
      expiresIn: '1 hour'
    });

  } catch (error: any) {
    console.error("Download URL error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
