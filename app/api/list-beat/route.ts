import { NextRequest } from "next/server";
import { readBeats, writeBeats } from "@/app/api/save-beat/route";

export async function POST(request: NextRequest) {
  try {
    const { beatId } = await request.json();
    
    console.log('=== LIST BEAT API CALLED ===');
    console.log('Looking for beatId:', beatId);

    if (!beatId) {
      return Response.json({ error: "beatId is required" }, { status: 400 });
    }

    // Read all beats
    const beats = await readBeats();
    console.log('Available beats:', beats.map(b => b.id));
    
    // Find and update the beat
    const beatIndex = beats.findIndex(beat => beat.id === beatId);
    console.log('Found beat at index:', beatIndex);
    
    if (beatIndex === -1) {
      return Response.json({ error: "Beat not found" }, { status: 404 });
    }

    // Mark as listed
    beats[beatIndex].listed = true;
    
    // Save back to file
    await writeBeats(beats);

    return Response.json({ 
      success: true, 
      message: "Beat listed successfully" 
    });

  } catch (error: any) {
    console.error("Error listing beat:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
