import { NextRequest } from "next/server";
import { getBeats, updateBeat } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const { beatId } = await request.json();
    
    console.log('=== LIST BEAT API CALLED ===');
    console.log('Looking for beatId:', beatId);

    if (!beatId) {
      return Response.json({ error: "beatId is required" }, { status: 400 });
    }

    // Update beat to mark as listed
    const updatedBeat = await updateBeat(beatId, { listed: true });
    
    if (!updatedBeat) {
      return Response.json({ error: "Beat not found" }, { status: 404 });
    }

    return Response.json({ 
      success: true, 
      message: "Beat listed successfully in MongoDB",
      beat: updatedBeat
    });

  } catch (error: any) {
    console.error("Error listing beat:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
