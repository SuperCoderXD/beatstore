import { NextRequest } from "next/server";
import { uploadToBackblaze } from "@/lib/backblaze";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const beatId = formData.get('beatId') as string;
    const licenseType = formData.get('licenseType') as string;

    if (!beatId || !licenseType) {
      return Response.json({ error: "beatId and licenseType are required" }, { status: 400 });
    }

    if (!files || files.length === 0) {
      return Response.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadedFiles: string[] = [];

    for (const file of files) {
      const publicUrl = await uploadToBackblaze(file, beatId, licenseType);
      uploadedFiles.push(publicUrl);
    }

    return Response.json({ 
      success: true, 
      files: uploadedFiles,
      count: uploadedFiles.length 
    });

  } catch (error: any) {
    console.error("File upload error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
