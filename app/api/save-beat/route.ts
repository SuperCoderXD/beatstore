import { NextRequest } from "next/server";
import { getWhopSdk } from "@/lib/whop-sdk";

// Fallback storage for immediate functionality
let fallbackBeats: any[] = [];

// Extract YouTube thumbnail
const extractThumbnail = (youtubeUrl: string) => {
  const videoId = youtubeUrl.split('v=')[1]?.split('&')[0];
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
};

export async function GET() {
  try {
    // Try MongoDB first, fallback to memory if it fails
    try {
      const { getBeats } = await import("@/lib/mongodb");
      const beats = await getBeats();
      return Response.json({ success: true, beats });
    } catch (mongoError: unknown) {
      console.log('MongoDB failed, using fallback storage:', (mongoError as Error).message);
      return Response.json({ success: true, beats: fallbackBeats });
    }
  } catch (error: unknown) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

async function deleteWhopProduct(productId: string): Promise<boolean> {
  try {
    const whopsdk = getWhopSdk();
    await whopsdk.products.delete(productId);
    return true;
  } catch (error: any) {
    console.error(`Failed to delete Whop product ${productId}:`, error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== SAVE BEAT API CALLED ===');
    
    const payload = await request.json();
    console.log('Received payload:', JSON.stringify(payload, null, 2));

    if (!payload?.title || typeof payload.title !== "string") {
      console.error('Validation error: title is required');
      return Response.json({ error: "title is required" }, { status: 400 });
    }

    if (!payload?.youtubeUrl || typeof payload.youtubeUrl !== "string") {
      console.error('Validation error: youtubeUrl is required');
      return Response.json({ error: "youtubeUrl is required" }, { status: 400 });
    }

    if (
      !payload?.whopProductIds ||
      typeof payload.whopProductIds?.basic !== "string" ||
      typeof payload.whopProductIds?.premium !== "string" ||
      typeof payload.whopProductIds?.unlimited !== "string"
    ) {
      console.error('Validation error: whopProductIds are required');
      return Response.json({ error: "whopProductIds.basic/premium/unlimited are required" }, { status: 400 });
    }

    if (
      !payload?.prices ||
      typeof payload.prices?.basic !== "number" ||
      typeof payload.prices?.premium !== "number" ||
      typeof payload.prices?.unlimited !== "number"
    ) {
      console.error('Validation error: prices are required numbers');
      return Response.json({ error: "prices.basic/premium/unlimited are required numbers" }, { status: 400 });
    }

    if (
      !payload?.licenses ||
      typeof payload.licenses?.basic !== "string" ||
      typeof payload.licenses?.premium !== "string" ||
      typeof payload.licenses?.unlimited !== "string"
    ) {
      console.error('Validation error: licenses are required');
      return Response.json({ error: "licenses.basic/premium/unlimited are required" }, { status: 400 });
    }

    console.log('Validation passed, creating beat data...');
    const now = Date.now();
    const beatData = {
      id: payload.id || `beat_${now}`,
      title: payload.title,
      youtubeUrl: payload.youtubeUrl,
      thumbnailUrl: extractThumbnail(payload.youtubeUrl),
      slug: payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      whopProductIds: payload.whopProductIds,
      whopPurchaseUrls: payload.whopPurchaseUrls,
      prices: payload.prices,
      licenses: payload.licenses,
      assets: {
        basicFiles: payload.assets?.basicFiles ?? [],
        premiumFiles: payload.assets?.premiumFiles ?? [],
        unlimitedFiles: payload.assets?.unlimitedFiles ?? [],
      },
      createdAt: new Date(now).toISOString(),
      listed: payload.listed ?? false,
    };

    // Try MongoDB first, fallback to memory storage
    try {
      console.log('Attempting to save to MongoDB...');
      const { createBeat } = await import("@/lib/mongodb");
      const beat = await createBeat(beatData);
      console.log('Beat saved successfully to MongoDB:', beat.id);
      
      return Response.json({ 
        success: true, 
        id: beat.id, 
        beat: beat,
        message: "Beat created successfully in MongoDB database"
      });
    } catch (mongoError: unknown) {
      console.log('MongoDB failed, using fallback storage:', (mongoError as Error).message);
      
      // Fallback to memory storage
      fallbackBeats.unshift(beatData);
      console.log('Beat saved to fallback storage:', beatData.id);
      
      return Response.json({ 
        success: true, 
        id: beatData.id, 
        beat: beatData,
        message: "Beat created successfully (fallback storage)",
        note: "Using fallback storage - MongoDB will work when configured"
      });
    }

  } catch (error: any) {
    console.error("Failed to save beat:", error);
    console.error("Error stack:", error.stack);
    return Response.json({ 
      error: error.message || "Failed to save beat",
      details: error.stack 
    }, { status: 500 });
  }
}