import { NextResponse } from "next/server";
import { cleanData } from "@/lib/clean";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.rawData || typeof body.rawData !== "string") {
      return NextResponse.json(
        { error: "rawData is required" },
        { status: 400 }
      );
    }

    const result = await cleanData({ rawData: body.rawData });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
