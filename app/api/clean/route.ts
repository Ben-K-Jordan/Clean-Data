import { NextResponse } from "next/server";
import { cleanData } from "@/lib/clean";
import { CleanRequest } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body: CleanRequest = await request.json();

    if (!body.rawData || typeof body.rawData !== "string") {
      return NextResponse.json(
        { error: "rawData is required" },
        { status: 400 }
      );
    }

    const result = await cleanData({
      rawData: body.rawData,
      mode: body.mode || "mock",
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
