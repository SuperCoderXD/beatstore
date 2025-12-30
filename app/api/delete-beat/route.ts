import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getWhopSdk } from "@/lib/whop-sdk";

interface BeatRecord {
  id: string;
  title: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  slug?: string;
  whopProductIds: {
    basic: string;
    premium: string;
    unlimited: string;
  };
  prices: {
    basic: number;
    premium: number;
    unlimited: number;
  };
  licenses: {
    basic: string;
    premium: string;
    unlimited: string;
  };
  assets: {
    basicFiles: string[];
    premiumFiles: string[];
    unlimitedFiles: string[];
  };
  createdAt: string;
}

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "beats.json");

async function readBeats(): Promise<BeatRecord[]> {
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    return JSON.parse(raw);
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return [];
    }
    throw err;
  }
}

async function writeBeats(beats: BeatRecord[]) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(beats, null, 2), "utf8");
}

async function deleteWhopProduct(productId: string): Promise<boolean> {
  try {
    const whopsdk = getWhopSdk();
    await whopsdk.products.delete(productId);
    return true;
  } catch (error: any) {
    console.error(`Failed to delete Whop product ${productId}:`, error);
    // Don't throw error, just log it and continue
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { beatId, whopProductIds } = await request.json();

    if (!beatId || typeof beatId !== "string") {
      return Response.json({ error: "beatId is required" }, { status: 400 });
    }

    if (!whopProductIds || typeof whopProductIds !== "object") {
      return Response.json({ error: "whopProductIds is required" }, { status: 400 });
    }

    // Read current beats
    const beats = await readBeats();
    
    // Find the beat to delete
    const beatIndex = beats.findIndex(beat => beat.id === beatId);
    if (beatIndex === -1) {
      return Response.json({ error: "Beat not found" }, { status: 404 });
    }

    const beatToDelete = beats[beatIndex];

    // Attempt to delete Whop products
    const deletedProducts: string[] = [];
    const productIds = [
      whopProductIds.basic,
      whopProductIds.premium,
      whopProductIds.unlimited
    ];

    for (const productId of productIds) {
      if (productId && productId !== "") {
        const deleted = await deleteWhopProduct(productId);
        if (deleted) {
          deletedProducts.push(productId);
        }
      }
    }

    // Remove beat from database
    beats.splice(beatIndex, 1);
    await writeBeats(beats);

    return Response.json({ 
      success: true, 
      message: "Beat deleted successfully",
      deletedProducts,
      deletedProductsCount: deletedProducts.length
    });

  } catch (error: any) {
    console.error("Failed to delete beat:", error);
    return Response.json({ 
      error: error.message || "Failed to delete beat" 
    }, { status: 500 });
  }
}
