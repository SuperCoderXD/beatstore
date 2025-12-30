import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

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

    // Create upload directory
    const uploadDir = path.join(process.cwd(), "public", "uploads", beatId, licenseType);
    await fs.mkdir(uploadDir, { recursive: true });

    const uploadedFiles: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const filename = `${Date.now()}_${file.name}`;
      const filepath = path.join(uploadDir, filename);
      
      await fs.writeFile(filepath, buffer);
      
      // Store the public URL path
      const publicPath = `/uploads/${beatId}/${licenseType}/${filename}`;
      uploadedFiles.push(publicPath);
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
