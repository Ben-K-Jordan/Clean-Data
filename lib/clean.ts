import { CleanRequest, CleanResult } from "./types";
import { mockClean } from "./mock-clean";
import { aiClean } from "./ai-clean";

export async function cleanData(request: CleanRequest): Promise<CleanResult> {
  if (request.mode === "ai") {
    return aiClean(request.rawData);
  }
  return mockClean(request.rawData);
}
