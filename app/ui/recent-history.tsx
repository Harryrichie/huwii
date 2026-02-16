'use client'
import { getRecentSessions } from "@/app/api/action/user-history";
import { MessageSquare, Clock, ImageIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

interface SessionHistory {
  imageUrl: string | null;
}

interface ChatSession {
  id: string;
  title: string | null;
  updatedAt: string | Date;
  history: SessionHistory[];
}

export default function HistorySidebar() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const loadData = async () => {
      const data = await getRecentSessions();
      // Create a map to ensure unique sessions by ID
      const uniqueSessions = Array.from(new Map(data.map(session => [session.id, session])).values());
      setSessions(uniqueSessions);
    };

    loadData();

    const handleRefresh = () => loadData();
    window.addEventListener('refresh-history', handleRefresh);
    
    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('refresh-history', handleRefresh);
    };
  }, [isLoaded, user]);

  return (
    <div className="p-4 bg-gray-50 h-full flex flex-col overflow-hidden">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Clock size={20} /> Recent Chats
      </h2>
      
      <div className="flex-1 space-y-3 overflow-y-auto min-h-0">
        {sessions.map((session) => {
          const lastHistory = session.history?.[0];
          const isImage = !!lastHistory?.imageUrl;
          const href = `/dashboard/chat/${session.id}`;

          return (
            <Link 
              key={session.id} 
              href={href}
              className="group flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-gray-200 transition-all bg-white/50"
            >
              {/* Thumbnail Preview */}
              <div className="relative w-12 h-12 shrink-0 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                {isImage ? (
                  <Image 
                    src={lastHistory?.imageUrl || ""} 
                    alt="Preview" 
                    fill 
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <MessageSquare size={18} className="text-blue-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-gray-700">
                  {session.title || "Untitled Chat"}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                  {isImage && <ImageIcon size={10} />}
                  <span>{new Date(session.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}