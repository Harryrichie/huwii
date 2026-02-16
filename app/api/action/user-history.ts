'use server'

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// GET RECENT: For the Sidebar (Limited to 10-20)
export async function getRecentSessions() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return [];

    const user = await db.user.findUnique({
      where: { clerkId },
      select: { id: true }
    });

    if (!user) return [];

    return await db.chatSession.findMany({
      where: { userId: user.id },
      include: {
        history: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 20, // Increased to 20 for a better sidebar
    });
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

// SEARCH: For the Search Page (No Limit, deep search)
export async function searchChatHistory(query: string) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId || !query) return [];

    const user = await db.user.findUnique({
      where: { clerkId },
      select: { id: true }
    });

    if (!user) return [];

    return await db.chatSession.findMany({
      where: {
        userId: user.id,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          {
            history: {
              some: {
                OR: [
                  { formData: { contains: query, mode: 'insensitive' } },
                  { aiResponse: { contains: query, mode: 'insensitive' } }
                ]
              }
            }
          }
        ]
      },
      include: {
        history: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
}

// SESSION HISTORY: Fetch specific chat messages
export async function getSessionHistory(sessionId: string) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return null;

        const user = await db.user.findUnique({
            where: { clerkId },
            select: { id: true }
        });

        if (!user) return null;

        return await db.chatSession.findUnique({
            where: {
                id: sessionId,
                userId: user.id,
            },
            include: {
                history: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });
    } catch (error) {
        console.error("Database Error:", error);
        return null;
    }
}