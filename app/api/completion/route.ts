import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { auth } from '@clerk/nextjs/server';
import { db } from '../../../lib/db';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});
export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response('Unauthorized', { status: 401 });

  const { prompt, type = 'content', sessionId } = await req.json();

  const user = await db.user.findUnique({ where: { clerkId } });
  let targetUser = user;

  if (!targetUser) {
    targetUser = await db.user.create({
      data: {
        clerkId: clerkId,
        email: "user@huwii.com",
      }
    });
  }

  // Define logic based on request type
  const isImageRequest = type === 'image-prompt';
  
  const systemPrompt = isImageRequest
    ? `You are an expert Image Prompt Engineer. 
       Expand the user's request into a highly detailed, 8k, cinematic visual description. 
       Output ONLY the descriptive prompt text.`
    : `You are a professional Content Strategist. Create high-performing SEO content in Markdown.`;

const result = await streamText({
  model: groq('llama-3.3-70b-versatile'),
  system: systemPrompt,
  prompt: prompt,
  onFinish: async ({ text }) => {
    // Only save history for non-image-prompt requests
    if (!isImageRequest) {
      try {
        // Ensure a Session exists
        const 
        chatSession = await db.chatSession.upsert({
          where: { id: sessionId || 'new-session' }, // If no ID, Prisma needs a way to handle this
          update: { updatedAt: new Date() },
          create: {
            userId: targetUser!.id,
            title: prompt.length > 40 ? prompt.substring(0, 30) + "...": prompt, // Auto-generate title from prompt
          }
        });

        // Link History to that Session
        await db.history.create({
          data: {
            userId: targetUser!.id,
            sessionId: chatSession.id, 
            templateSlug: 'completion',
            formData: prompt,
            aiResponse: text,
            imageUrl: null, 
          },
        });
        // ADD THIS: Manually update the session's updatedAt timestamp
     // Only update the timestamp if we actually have a sessionId
      if (sessionId) {
        await db.chatSession.update({
          where: { 
            id: sessionId 
          },
          data: { 
            updatedAt: new Date() 
          }
        });
      }
      } catch (error) {
        console.error('Database save failed:', error);
      }
    }
  },
});
  return result.toTextStreamResponse();
}