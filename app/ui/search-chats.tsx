"use client"

import { Search, X, MessageSquare, Clock, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { searchChatHistory } from "@/app/api/action/user-history"
import Link from "next/link"

interface SearchResult {
  id: string;
  title: string | null;
  updatedAt: Date;
  history: { formData: string }[];
}

export default function SearchChats() {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Debounce search to save database resources
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length > 0) {
        setIsLoading(true)
        try {
          const data = await searchChatHistory(searchTerm)
          setResults(data)
        } catch (error) {
          console.error("Search failed:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Search Chats</h1>
        
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search all conversations..."
            className="w-full rounded-full border border-gray-300 bg-white py-3 pl-12 pr-12 text-lg focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <div className="space-y-4">
            {searchTerm === "" ? (
              <div className="text-center py-12 text-gray-500">
                <p>Type a keyword to search your entire history.</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No results found for {searchTerm}</p>
              </div>
            ) : (
              results.map((session) => (
                <Link 
                  key={session.id} 
                  href={`/dashboard/chat/${session.id}`}
                  className="block p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-all border border-gray-100 group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 text-indigo-600 font-medium text-xs uppercase tracking-wider">
                      <MessageSquare size={16} />
                      <span>Chat Session</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={12} />
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {/* Title from your schema */}
                  <h3 className="text-lg font-bold text-[#1f1f1f] mb-2 group-hover:text-indigo-600 transition-colors">
                    {session.title}
                  </h3>
                  
                  {/* Sneak peek of the actual message content */}
                  <p className="text-[#444746] text-sm line-clamp-2 italic bg-slate-50 p-2 rounded-lg">
                    {session.history[0]?.formData || "Open chat to view details..."}
                  </p>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  )
}