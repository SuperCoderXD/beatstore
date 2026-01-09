import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export interface BeatRecord {
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
  whopPurchaseUrls?: {
    basic?: string;
    premium?: string;
    unlimited?: string;
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
  listed?: boolean;
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "beats.json");

export async function readBeats(): Promise<BeatRecord[]> {
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

export async function writeBeats(beats: BeatRecord[]) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(beats, null, 2), "utf8");
}

export async function GET() {
  try {
    const beats = await readBeats();
    return Response.json({ success: true, beats });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// Extract YouTube thumbnail
const extractThumbnail = (youtubeUrl: string) => {
  const videoId = youtubeUrl.split('v=')[1]?.split('&')[0];
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
};

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
    const beat: BeatRecord = {
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
      listed: payload.listed ?? false, // Default to false
    };

    const beats = await readBeats();
    beats.unshift(beat);
    await writeBeats(beats);

    return Response.json({ success: true, id: beat.id, beat });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}