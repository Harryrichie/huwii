import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  // Fix: params is now wrapped in a Promise
  { params }: { params: Promise<{ prompt: string[] }> }
) {
  try {
    // Await the params promise to get the actual data
    const resolvedParams = await params;
    
    // Decode and join the catch-all route segments
    const prompt = resolvedParams.prompt.map(p => decodeURIComponent(p)).join('/');
    
    const API_TOKEN = process.env.HUGGING_FACE_TOKEN;
    const MODEL_ID = "black-forest-labs/FLUX.1-schnell";
    const URL = `https://router.huggingface.co/hf-inference/models/${MODEL_ID}`;

    if (!API_TOKEN) {
      return NextResponse.json({ error: "Hugging Face token missing" }, { status: 500 });
    }

    const response = await fetch(URL, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: prompt }),
    });

    if (response.status === 503) {
      return NextResponse.json({ error: "Model is loading" }, { status: 503 });
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error("HF Router Error:", errorData);
      return NextResponse.json(errorData, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable' // Cache for a year
      },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Cache Route Crash:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}