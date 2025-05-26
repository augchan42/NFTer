export async function generateImage(
  prompt: string,
  base64Image: string
): Promise<string | null> {
  try {
    const response = await fetch(
      process.env.GENERATE_BAGEL_API_ENDPOINT || "",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          image: base64Image,
        }),
      }
    );

    if (!response.ok) {
      console.error("Failed to generate image:", await response.text());
      return null;
    }

    const data = await response.json();
    return data.image_url || null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}
