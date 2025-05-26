import { NextResponse } from "next/server";

// Keep track of SSE connections
const clients = new Map<string, ReadableStreamController<Uint8Array>>();

export async function POST(request: Request) {
  try {
    const prediction = await request.json();
    console.log("Received webhook for prediction:", prediction.id);

    // Get the SSE controller for this prediction
    const controller = clients.get(prediction.id);
    if (controller) {
      try {
        // Send the prediction result to the client
        controller.enqueue(
          new TextEncoder().encode(`data: ${JSON.stringify(prediction)}\n\n`)
        );
        controller.close();
        clients.delete(prediction.id);
      } catch (error) {
        console.error("Error sending SSE update:", error);
        clients.delete(prediction.id);
      }
    }

    // Always return success to Replicate
    return new Response(null, { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    // Still return 200 to Replicate even if we have an error
    return new Response(null, { status: 200 });
  }
}

// SSE endpoint to establish connection
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const predictionId = searchParams.get("id");

  if (!predictionId) {
    return NextResponse.json(
      { error: "No prediction ID provided" },
      { status: 400 }
    );
  }

  const stream = new ReadableStream({
    start(controller) {
      // Store the controller for this prediction
      clients.set(predictionId, controller);

      // Clean up if the client disconnects
      request.signal.addEventListener("abort", () => {
        clients.delete(predictionId);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
