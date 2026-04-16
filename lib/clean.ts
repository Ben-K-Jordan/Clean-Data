import { CleanRequest, CleanResult } from "./types";
import { mockClean } from "./mock-clean";
import { mockImageClean } from "./mock-image-clean";
import { aiClean } from "./ai-clean";

export async function cleanData(request: CleanRequest): Promise<CleanResult> {
  const hasApiKey = !!process.env.ANTHROPIC_API_KEY;

  // Image uploads
  if (request.imageData) {
    if (hasApiKey) {
      return aiClean(request.rawData, request.imageData, request.mimeType);
    }
    // Mock mode: return hardcoded image scan results
    return mockImageClean();
  }

  // Text: use AI if API key is available, otherwise mock
  if (hasApiKey) {
    return aiClean(request.rawData);
  }

  return mockClean(request.rawData);
}
