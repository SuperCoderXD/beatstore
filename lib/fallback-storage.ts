// Shared fallback storage for immediate functionality
export let fallbackBeats: any[] = [];

// Helper to sync fallback storage across APIs
export function addBeatToFallback(beat: any) {
  fallbackBeats.unshift(beat);
  console.log('Beat added to fallback storage:', beat.id);
}

export function findBeatInFallback(beatId: string) {
  return fallbackBeats.find(beat => beat.id === beatId);
}

export function updateBeatInFallback(beatId: string, updates: any) {
  const beatIndex = fallbackBeats.findIndex(beat => beat.id === beatId);
  if (beatIndex !== -1) {
    fallbackBeats[beatIndex] = { ...fallbackBeats[beatIndex], ...updates };
    console.log('Beat updated in fallback storage:', beatId);
    return fallbackBeats[beatIndex];
  }
  return null;
}

export function getAllFallbackBeats() {
  return fallbackBeats;
}
