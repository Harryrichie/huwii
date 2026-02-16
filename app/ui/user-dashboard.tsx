"use client"
import { useRouter } from "next/navigation"
import { userWhom } from "@/app/api/action/current-user"
import { useCompletion } from "@ai-sdk/react"
import { useUser } from "@clerk/nextjs"
import { useState, useRef, useEffect } from "react"
import {getSessionHistory } from "@/app/api/action/user-history"
import { 
  FileText, 
  Image as ImageIcon, 
  Zap,
  User,
  Bot,
  Send,
  Copy,
  Check,
  Mail,
  Download
} from "lucide-react"
import ReactMarkdown from 'react-markdown'
import Image from "next/image"

interface HistoryItem {
  formData: string;
  aiResponse: string | null;
  imageUrl?: string | null;
}

// Separate Component for Copy Button
function CopyToClipboardButton({ textToCopy }: { textToCopy: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md bg-gray-50 text-gray-500 hover:bg-gray-200 transition-all focus:outline-none"
      aria-label="Copy message"
    >
      {isCopied ? (
        <Check className="h-3.5 w-3.5 text-green-600" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

interface UserDashboardProps {
  sessionId?: string;
}

export default function UserDashboard({ sessionId }: UserDashboardProps) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string; imageUrl?: string }[]>([])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 1. Hand-off to Image Page Logic
  const handleGenerateImageFromContent = async (content: string) => {
    try {
      const response = await fetch('/api/completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `Create a highly descriptive image prompt based on this content: ${content}`,
          type: 'image-prompt' 
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let visualPrompt = '';

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        visualPrompt += decoder.decode(value);
      }

      sessionStorage.removeItem('huwii-image-session-id');
      sessionStorage.removeItem('huwii-image-messages');
      router.push(`/dashboard/image-generator?prompt=${encodeURIComponent(visualPrompt)}`);
    } catch (error) {
      console.error("Failed to generate image prompt:", error);
    }
  };

  useEffect(() => {
    userWhom()
  }, []);

  // Load chat history from session storage on mount
  useEffect(() => {
    if (!isLoaded) return;

    if (sessionId) {
      if (!user) return;
      const fetchHistory = async () => {
        const session = await getSessionHistory(sessionId);
        if (session && session.history) {
          const chatHistory = session.history.flatMap((h: HistoryItem) => {
            const messages: { role: 'user' | 'assistant'; content: string; imageUrl?: string }[] = [];
            messages.push({ role: 'user' as const, content: h.formData });
            const hasImage = h.imageUrl && h.imageUrl !== "null" && h.imageUrl !== "undefined" && h.imageUrl.trim() !== "";
            if (h.aiResponse != null || hasImage) {
              messages.push({ role: 'assistant' as const, content: h.aiResponse || "", imageUrl: hasImage ? h.imageUrl! : undefined });
            }
            return messages;
          });
          setMessages(chatHistory);
        }
      };
      fetchHistory();
    } else {
      setTimeout(() => {
        const savedMessages = sessionStorage.getItem('huwii-chat-history');
        if (savedMessages) {
          try {
            setMessages(JSON.parse(savedMessages));
          } catch (error) {
            console.error("Failed to load chat history:", error);
          }
        }
      }, 0);
    }
  }, [sessionId, isLoaded, user]);

  // Save chat history to session storage whenever it changes
  useEffect(() => {
    if (messages.length > 0 && !sessionId) { // Only save new/temporary chats
      sessionStorage.setItem('huwii-chat-history', JSON.stringify(messages));
    }
  }, [messages, sessionId]);

  useEffect(() => {
    const handleNewChat = () => {
      setMessages([])
      setInput("")
      sessionStorage.removeItem('huwii-chat-history');
      // If we are in a session-specific page, a "new chat" should redirect to the main chat page
      if (sessionId) {
        router.push('/dashboard/chat');
      }
    }
    window.addEventListener('new-chat', handleNewChat)
    return () => window.removeEventListener('new-chat', handleNewChat)
  }, [sessionId, router])

  const { completion, complete, isLoading, } = useCompletion({
    api: '/api/completion',
    streamProtocol: 'text',
    body: {
        sessionId: sessionId,
    },
    onFinish: (prompt, completion) => {
      setMessages(prev => [...prev, { role: 'assistant', content: completion }]);
      window.dispatchEvent(new Event('refresh-history'));
    },
  });

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!input.trim() || isLoading) return

    const prompt = input
    const lowerCasePrompt = prompt.toLowerCase();

    if (lowerCasePrompt.includes("image") || lowerCasePrompt.includes("picture")) {
      sessionStorage.removeItem('huwii-image-session-id');
      sessionStorage.removeItem('huwii-image-messages');
      router.push(`/dashboard/image-generator?prompt=${encodeURIComponent(prompt)}`);
      setInput("");
      return;
    }

    setMessages(prev => [...prev, { role: 'user', content: prompt }])
    setInput("")
    await complete(prompt)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, completion])

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-gray-50">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 && !completion && (
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold text-gray-900">What would you like to create today?</h1>
              <p className="mt-2 text-gray-600">Generate content and images instantly with HUWII.</p>
            </div>
          )}

          {/* Render Past Messages */}
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
              {m.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <Bot className="h-5 w-5" />
                </div>
              )}
              <div className={`group relative max-w-[80%] rounded-2xl text-sm ${
                m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none px-4 py-3 shadow-sm' 
                  : m.imageUrl 
                    ? 'rounded-bl-none' 
                    : 'text-gray-900 ring-1 ring-gray-200 rounded-bl-none px-4 py-3 shadow-sm'
              }`}>
                {m.role === 'user' 
                  ? (
                    <div className="space-y-2">
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    </div>
                  ) : (
                    <>
                      {m.imageUrl ? (
                        <div className="relative w-72 h-72 md:w-98 md:h-100 lg:w-100 lg:h-105 rounded-xl overflow-hidden shadow-sm group">
                          <Image 
                            src={m.imageUrl} 
                            alt="AI Generated Content" 
                            fill 
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                          <a 
                            href={m.imageUrl} 
                            download={`huwii-generated-${i}.png`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white text-gray-700 hover:text-indigo-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                            title="Download Image"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>
                      ) : (
                        <>
                          <div className="prose prose-sm max-w-none font-sans text-slate-700 leading-relaxed bg-white">
                            <ReactMarkdown>{m.content}</ReactMarkdown>
                          </div>
                          <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <CopyToClipboardButton textToCopy={m.content} />
                            <button
                              onClick={() => handleGenerateImageFromContent(m.content)}
                              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors text-xs font-medium"
                            >
                              <ImageIcon className="h-3.5 w-3.5" />
                              Generate Image
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  )}
              </div>
              {m.role === 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                  <User className="h-5 w-5" />
                </div>
              )}
            </div>
          ))}

          {/* Render Active Stream */}
          {isLoading && (
            <div className="flex gap-4 justify-start animate-fade-in-up">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <Bot className="h-5 w-5" />
              </div>
              <div className="group relative max-w-[80%] rounded-2xl px-4 py-3 text-sm bg-white text-gray-900 ring-1 ring-gray-200 rounded-bl-none shadow-sm">
                {completion ? (
                  <>
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{completion}</ReactMarkdown>
                    </div>
                    <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-2">
                       <CopyToClipboardButton textToCopy={completion} />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-1 h-5 px-1">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                  </div>
                )}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                className="block w-full resize-none border-0 bg-transparent p-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm outline-none"
                placeholder="Describe what you want to create..."
                rows={2}
              />
              <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2 bg-gray-50">
                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={() => setInput("Write a professional email about ")}
                    className="flex items-center gap-1 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 text-xs font-medium transition-colors"
                    title="Generate Email"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="hidden sm:inline">Email</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setInput("Write a blog post about ")}
                    className="flex items-center gap-1 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 text-xs font-medium transition-colors"
                    title="Generate Blog Post"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Blog</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => router.push('/dashboard/image-generator')}
                    className="flex items-center gap-1 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 text-xs font-medium transition-colors"
                    title="Generate Image"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Image</span>
                  </button>
                </div>
                <button 
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading || !input.trim()}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? <Zap className="h-4 w-4 animate-pulse" /> : <Send className="h-4 w-4" />}
                  {isLoading ? 'Generating...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}