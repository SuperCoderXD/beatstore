import { NextRequest } from "next/server";
import { getWhopSdk } from "@/lib/whop-sdk";
import { createBeat, getBeats, BeatRecord } from "@/lib/mongodb";

// Extract YouTube thumbnail
const extractThumbnail = (youtubeUrl: string) => {
  const videoId = youtubeUrl.split('v=')[1]?.split('&')[0];
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
};

export async function GET() {
  try {
    const beats = await getBeats();
    return Response.json({ success: true, beats });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
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
    const payload = await request.json();

    if (!payload?.title || typeof payload.title !== "string") {
      return Response.json({ error: "title is required" }, { status: 400 });
    }

    if (!payload?.youtubeUrl || typeof payload.youtubeUrl !== "string") {
      return Response.json({ error: "youtubeUrl is required" }, { status: 400 });
    }

    if (
      !payload?.whopProductIds ||
      typeof payload.whopProductIds?.basic !== "string" ||
      typeof payload.whopProductIds?.premium !== "string" ||
      typeof payload.whopProductIds?.unlimited !== "string"
    ) {
      return Response.json({ error: "whopProductIds.basic/premium/unlimited are required" }, { status: 400 });
    }

    if (
      !payload?.prices ||
      typeof payload.prices?.basic !== "number" ||
      typeof payload.prices?.premium !== "number" ||
      typeof payload.prices?.unlimited !== "number"
    ) {
      return Response.json({ error: "prices.basic/premium/unlimited are required numbers" }, { status: 400 });
    }

    if (
      !payload?.licenses ||
      typeof payload.licenses?.basic !== "string" ||
      typeof payload.licenses?.premium !== "string" ||
      typeof payload.licenses?.unlimited !== "string"
    ) {
      return Response.json({ error: "licenses.basic/premium/unlimited are required" }, { status: 400 });
    }

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

    const beat = await createBeat(beatData);

    return Response.json({ 
      success: true, 
      id: beat.id, 
      beat,
      message: "Beat created successfully in MongoDB database"
    });

  } catch (error: any) {
    console.error("Failed to save beat:", error);
    return Response.json({ 
      error: error.message || "Failed to save beat" 
    }, { status: 500 });
  }
}