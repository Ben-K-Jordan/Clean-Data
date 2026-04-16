import { CleanRequest, CleanResult } from "./types";
import { mockClean } from "./mock-clean";

export async function cleanData(request: CleanRequest): Promise<CleanResult> {
  return mockClean(request.rawData);
}
