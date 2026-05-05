import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export interface BeatRecord {
  id: string;
  title: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  slug?: string;
  listed: boolean;
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

// Extract YouTube thumbnail
const extractThumbnail = (youtubeUrl: string) => {
  const videoId = youtubeUrl.split('v=')[1]?.split('&')[0];
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
};

export async function GET() {
  try {
    const beats = await readBeats();
    // Only return listed beats
    const listedBeats = beats.filter(beat => beat.listed);
    return Response.json({ success: true, beats: listedBeats });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
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

    const now = Date.now();
    const beat: BeatRecord = {
      id: `beat_${now}`,
      title: payload.title,
      youtubeUrl: payload.youtubeUrl,
      thumbnailUrl: extractThumbnail(payload.youtubeUrl),
      slug: payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      listed: payload.listed || false,
      createdAt: new Date(now).toISOString(),
    };

    const beats = await readBeats();
    beats.unshift(beat);
    await writeBeats(beats);

    return Response.json({ success: true, id: beat.id, beat });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
