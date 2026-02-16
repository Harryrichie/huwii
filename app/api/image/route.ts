import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    
    // Cloudflare Credentials
    const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
    const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

    if (!ACCOUNT_ID || !API_TOKEN) {
      return NextResponse.json({ error: "Cloudflare credentials missing" }, { status: 500 });
    }

    const formData = await req.formData();
    const prompt = formData.get("prompt") as string;
    const sessionId = formData.get("sessionId") as string;
    const imageFile = formData.get("image") as File | null;

    if (!prompt) return NextResponse.json({ error: "Prompt required" }, { status: 400 });

    const isEditing = !!(imageFile && imageFile.size > 0);
    
    // Model Selection
    // Text-to-Image: @cf/bytedance/stable-diffusion-xl-lightning (Very fast)
    // Image-to-Image: @cf/runwayml/stable-diffusion-v1-5-img2img
    const model = isEditing 
      ? "@cf/runwayml/stable-diffusion-v1-5-img2img" 
      : "@cf/bytedance/stable-diffusion-xl-lightning";

    const URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${model}`;

    let body: any = { prompt };

    if (isEditing) {
      const bytes = await imageFile!.arrayBuffer();
      // Cloudflare expects the image as an array of unsigned 8-bit integers
      body.image = [...new Uint8Array(bytes)];
      body.strength = 0.5; // Controls how much the original image is changed (0.0 to 1.0)
    }

    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudflare API Error:", errorText);
      return NextResponse.json({ error: "Cloudflare AI failed" }, { status: response.status });
    }

    // Cloudflare returns the image as a binary stream (PNG)
    const imageBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);

    // --- DATABASE LOGIC (REMAINING AS IS) ---
    let finalSessionId = sessionId;
    if (clerkId) {
      const user = await db.user.findUnique({ where: { clerkId } });
      if (user) {
        const chatSession = await db.chatSession.upsert({
          where: { id: (sessionId && sessionId.length > 10) ? sessionId : '00000000-0000-0000-0000-000000000000' },
          update: { updatedAt: new Date() },
          create: { userId: user.id, title: prompt.substring(0, 30) }
        });
        finalSessionId = chatSession.id;
        
        await db.history.create({
          data: {
            userId: user.id,
            sessionId: finalSessionId,
            templateSlug: isEditing ? 'image-edit' : 'image-gen',
            formData: prompt,
            aiResponse: "Generated successfully via Cloudflare",
            imageUrl: `data:image/png;base64,${buffer.toString('base64')}`
          }
        });
      }
    }

    return new NextResponse(buffer, {
      headers: { 
        'Content-Type': 'image/png',
        'X-Session-Id': finalSessionId || ''
      }
    });

  } catch (error: any) {
    console.error("Route Crash:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}