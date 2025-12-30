import B2 from 'backblaze-b2';

const b2 = new B2({
  applicationKeyId: process.env.BACKBLAZE_KEY_ID!,
  applicationKey: process.env.BACKBLAZE_APP_KEY!,
});

export async function uploadToBackblaze(file: File, beatId: string, licenseType: string): Promise<string> {
  try {
    // Authorize with B2
    const authResponse = await b2.authorize();
    
    // Get upload URL
    const bucketResponse = await b2.getUploadUrl({
      bucketId: process.env.BACKBLAZE_BUCKET_ID!,
    });
    
    // Prepare file for upload
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${beatId}/${licenseType}/${Date.now()}_${file.name}`;
    
    // Upload file
    const uploadResponse = await b2.uploadFile({
      uploadUrl: bucketResponse.data.uploadUrl,
      uploadAuthToken: bucketResponse.data.authorizationToken,
      fileName: fileName,
      data: buffer,
      mime: file.type,
    });
    
    // Return the file ID (not public URL for private buckets)
    return uploadResponse.data.fileId;
  } catch (error) {
    console.error('Backblaze upload error:', error);
    throw new Error('Failed to upload file to Backblaze');
  }
}

export async function getDownloadUrl(fileId: string): Promise<string> {
  try {
    // Authorize with B2
    await b2.authorize();
    
    // Get download authorization
    const authResponse = await b2.getDownloadAuthorization({
      bucketId: process.env.BACKBLAZE_BUCKET_ID!,
      fileNamePrefix: '',
      validDurationInSeconds: 3600, // 1 hour
    });
    
    // Build download URL
    const downloadUrl = `https://f002.backblazeb2.com/file/${process.env.BACKBLAZE_BUCKET_NAME}/fileId=${fileId}?Authorization=${authResponse.data.authorizationToken}`;
    
    return downloadUrl;
  } catch (error) {
    console.error('Backblaze download URL error:', error);
    throw new Error('Failed to generate download URL');
  }
}
