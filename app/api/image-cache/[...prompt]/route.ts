import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ prompt: string[] }> }
) {
  try {
    // 1. Handle Next.js 15 Async Params
    const resolvedParams = await params;
    const promptArray = resolvedParams.prompt;
    const prompt = promptArray.map(p => decodeURIComponent(p)).join('/');

    // 2. Cloudflare Credentials
    const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
    const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
    
    // Using Flux-1-schnell on Cloudflare
    const MODEL = "@cf/black-forest-labs/flux-1-schnell";
    const URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${MODEL}`;

    if (!ACCOUNT_ID || !API_TOKEN) {
      return NextResponse.json({ error: "Cloudflare credentials missing" }, { status: 500 });
    }

    // 3. Request to Cloudflare Workers AI
    const response = await fetch(URL, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    // 4. Return the image binary
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}