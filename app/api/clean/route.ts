import { NextResponse } from "next/server";
import { cleanData } from "@/lib/clean";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const hasText = body.rawData && typeof body.rawData === "string";
    const hasImage = body.imageData && typeof body.imageData === "string";

    if (!hasText && !hasImage) {
      return NextResponse.json(
        { error: "rawData or imageData is required" },
        { status: 400 }
      );
    }

    const result = await cleanData({
      rawData: body.rawData || "",
      imageData: body.imageData,
      mimeType: body.mimeType,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
