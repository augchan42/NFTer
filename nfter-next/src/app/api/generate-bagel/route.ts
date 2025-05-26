import { NextResponse } from "next/server";
import Replicate from "replicate";
import fs from "fs";
import path from "path";

// Initialize Replicate client
if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error("REPLICATE_API_TOKEN environment variable is not set");
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: "Replicate API token not configured" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const prompt = formData.get("prompt") as string;

    if (!prompt) {
      return NextResponse.json(
        { error: "No prompt provided" },
        { status: 400 }
      );
    }

    // Read base.png from the assets directory
    const baseImagePath = path.join(
      process.cwd(),
      "src",
      "assets",
      "hippo",
      "base.png"
    );
    const baseImageBuffer = fs.readFileSync(baseImagePath);
    const base64Image = baseImageBuffer.toString("base64");
    const dataUrl = `data:image/png;base64,${base64Image}`;

    console.log("Starting prediction with prompt:", prompt);

    // Create prediction with webhook only in production
    const prediction = await replicate.predictions.create({
      version:
        "7dd8def79e503990740db4704fa81af995d440fefe714958531d7044d2757c9c",
      input: {
        prompt:
          prompt +
          " The final image must be exactly square with 1:1 aspect ratio.",
        image: dataUrl,
        guidance_scale: 8.5,
        negative_prompt:
          "distorted, ugly, deformed, disfigured, rectangular, non-square, stretched",
        width: 1024,
        height: 1024,
        output_format: "png",
        aspect_ratio: "1:1",
        num_inference_steps: 50,
      },
      ...(process.env.NODE_ENV === "production" && {
        webhook: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/replicate`,
        webhook_events_filter: ["completed"],
      }),
    });

    console.log("Prediction started:", prediction.id);

    return NextResponse.json({
      prediction_id: prediction.id,
      status: prediction.status,
      prompt: prompt,
    });
  } catch (err) {
    console.error("API error:", err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
