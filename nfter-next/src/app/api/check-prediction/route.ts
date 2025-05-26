import { NextResponse } from "next/server";
import Replicate from "replicate";

if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error("REPLICATE_API_TOKEN environment variable is not set");
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const predictionId = searchParams.get("id");

    if (!predictionId) {
      return NextResponse.json(
        { error: "No prediction ID provided" },
        { status: 400 }
      );
    }

    const prediction = await replicate.predictions.get(predictionId);
    return NextResponse.json(prediction);
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
