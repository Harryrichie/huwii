"use client"
import { useSearchParams, useRouter, useParams } from "next/navigation"
import { useState, useEffect, Suspense, useCallback, useRef } from "react"
import { Sparkles, Download, RefreshCw, Send, User, Bot, Image as ImageIcon, Zap, X, Lock } from "lucide-react"
import Image from "next/image"

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

interface HistoryRecord {
  formData: string;
  aiResponse: string;
  imageUrl: string | null;
}

/**
 * Utility: Converts Base64 from the browser/canvas to a Blob for FormData.
 * Used for the Image-to-Image (Pix2Pix) workflow.
 */
const dataURLtoBlob = (dataurl: string) => {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) return null;
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length; 
  const u8arr = new Uint8Array(n);
  while(n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], {type:mime});
}

function ImageStudioContent() {
  const searchParams = useSearchParams()
  const router = useRouter();
  const params = useParams();
  
  // State
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [uploadCount, setUploadCount] = useState(0)
  
  // Session Logic - Priority: URL Param > State
  const sessionIdFromPath = params?.id as string;
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sessionIdFromPath || null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const processedPrompt = useRef<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  useEffect(() => {
    const count = localStorage.getItem('huwii-upload-count')
    if (count) setUploadCount(parseInt(count, 10))
  }, [])

  // --- Handlers ---

 const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (file) {
    // Check file size (e.g., max 4MB)
    if (file.size > 4 * 1024 * 1024) {
      alert("Image too large. Please use an image under 4MB.");
      return;
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      setSelectedImage(reader.result as string)
      const newCount = uploadCount + 1
      setUploadCount(newCount)
      
      const storedData = localStorage.getItem('huwii-upload-tracker');
      let weekStart = Date.now();
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          if (parsed && parsed.weekStart) weekStart = parsed.weekStart;
        } catch (e) {}
      }
      localStorage.setItem('huwii-upload-tracker', JSON.stringify({ count: newCount, weekStart }));
    }
    reader.readAsDataURL(file)
  }
}
  const removeImage = () => {
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // --- Core Logic ---

const generateImage = useCallback(async (inputPrompt: string, isRetry = false, retryImage?: string | null) => {
    if (!inputPrompt) return;
    
    const imageToSend = isRetry ? retryImage : selectedImage;

    if (!isRetry) {
      setMessages(prev => [...prev, { role: 'user', content: inputPrompt, image: imageToSend || undefined }]);
      if (imageToSend) removeImage();
    }
    
    setIsLoading(true);
    setStatus("Huwii is refining your prompt...");

    try {
      //  Get Enhanced Prompt
      const response = await fetch('/api/completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputPrompt, type: 'image-prompt' }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let enhancedPrompt = '';
      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        enhancedPrompt += decoder.decode(value);
      }

      // 2. Generate Image via Backend
      setStatus("Generating your masterpiece...");
      const formData = new FormData();
      formData.append("prompt", enhancedPrompt);
      formData.append("originalPrompt", inputPrompt);
      const activeSessionId = sessionIdFromPath || currentSessionId;
        if (activeSessionId) {
        formData.append("sessionId", activeSessionId);
        }
      if (imageToSend) {
        const blob = dataURLtoBlob(imageToSend);
        if (blob) formData.append("image", blob, "input_image.png");
      }

      const imgResponse = await fetch(`${window.location.origin}/api/image`, {
        method: 'POST',
        body: formData,
      });

      if (imgResponse.status === 503) {
        setStatus("AI is warming up... retrying in 5s");
        setTimeout(() => generateImage(inputPrompt, true, imageToSend), 5000);
        return;
      }

      if (imgResponse.ok) {
        const sessionIdFromHeader = imgResponse.headers.get('X-Session-Id');
        
        // Fix: Smoothly update URL without refreshing
        if (sessionIdFromHeader && sessionIdFromHeader !== currentSessionId) {
          setCurrentSessionId(sessionIdFromHeader);
          const newPath = `/dashboard/image-generator/${sessionIdFromHeader}`;
          window.history.pushState(null, '', newPath);
        }

        //binary response in our current API route setup
        const blob = await imgResponse.blob();
        
        // Safety check: Ensure i didn't get an empty blob or an error JSON as a blob
        if (blob.size < 500) { 
           throw new Error("Received an invalid image file. Check API logs.");
        }

        const base64data = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });

        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "Here is your generated image based on the refined prompt.", 
          image: base64data 
        }]);

        window.dispatchEvent(new Event('refresh-history'));
      } else {
        // Detailed error parsing
        const errorData = await imgResponse.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.details?.message || "Generation failed";
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("Studio Error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error.message}. Please check your balance or try a simpler prompt.` 
      }]);
    } finally {
      setIsLoading(false);
      setStatus("");
    }
  }, [currentSessionId, selectedImage]);
  // --- Effects ---

  // Sync state if URL param changes
  useEffect(() => {
    if (sessionIdFromPath) setCurrentSessionId(sessionIdFromPath);
  }, [sessionIdFromPath]);

  // Load History
  useEffect(() => {
    const loadHistory = async () => {
      if (!currentSessionId) return;
      try {
        const response = await fetch(`/api/history?sessionId=${currentSessionId}`);
        if (!response.ok) return;
        const data = await response.json();
        if (Array.isArray(data)) {
          const historyMessages = data.flatMap((h: HistoryRecord) => ([
            { role: 'user', content: h.formData },
            { role: 'assistant', content: h.aiResponse, image: h.imageUrl || undefined }
          ])) as ChatMessage[];
          setMessages(historyMessages);
        }
      } catch (error) {
        console.error("Failed to load history:", error);
      }
    };
    loadHistory();
  }, [currentSessionId]);

  // Auto-generate from Search Params
  useEffect(() => {
    const p = searchParams?.get("prompt");
    if (p && messages.length === 0 && !isLoading && !sessionIdFromPath && processedPrompt.current !== p) {
      processedPrompt.current = p;
      generateImage(p);
      const newUrl = window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    }
  }, [searchParams, generateImage, messages.length, isLoading, sessionIdFromPath]);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      generateImage(prompt);
      setPrompt("");
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50">
      {showSubscriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 transform transition-all scale-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-xl">
                  <Lock className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Unlock Image Upload</h3>
              </div>
              <button 
                onClick={() => setShowSubscriptionModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                Upload your own reference images to guide the AI generation. This premium feature is available for Pro subscribers.
              </p>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Contact for access</p>
                <a href="mailto:huwii.ai@gmail.com" className="text-indigo-600 font-medium hover:underline">huwii.ai@gmail.com</a>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-sm shadow-indigo-200"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
        {messages.length === 0 && !isLoading && (
           <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
             <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-indigo-400" />
             </div>
             <div className="text-center">
               <h2 className="text-xl font-semibold text-slate-700">Image Studio</h2>
               <p>Describe your imagination to start creating</p>
             </div>
           </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
               <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                 <Bot className="w-5 h-5 text-indigo-600" />
               </div>
            )}
            
            <div className={`max-w-[85%] lg:max-w-[70%] space-y-3 ${msg.role === 'user' ? 'items-end flex flex-col' : 'items-start'}`}>
               {msg.role === 'user' ? (
                 <>
                   {msg.image && (
                     <div className="relative w-32 h-32 rounded-xl overflow-hidden mb-2 border border-white/20 shadow-sm">
                        <Image src={msg.image} alt="Reference" fill className="object-cover" unoptimized />
                     </div>
                   )}
                   <div className="bg-indigo-600 text-white px-5 py-3 rounded-2xl rounded-br-none shadow-md">
                     <p>{msg.content}</p>
                   </div>
                 </>
               ) : (
                 <>
                   {msg.image && (
                     <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-white group">
                        <Image src={msg.image} alt="Generated" fill className="object-cover" unoptimized />
                        <a 
                          href={msg.image} 
                          download={`huwii-${idx}.jpg`}
                          className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white text-slate-900 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                     </div>
                   )}
                   {!msg.image && msg.content && (
                     <div className="bg-red-50 border border-red-200 px-4 py-3 rounded-2xl rounded-bl-none text-red-800 text-sm shadow-sm">
                       <p>{msg.content}</p>
                     </div>
                   )}
                 </>
               )}
            </div>

            {msg.role === 'user' && (
               <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                 <User className="w-5 h-5 text-slate-500" />
               </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4 justify-start">
             <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                 <Bot className="w-5 h-5 text-indigo-600" />
             </div>
             <div className="bg-white border border-slate-200 px-5 py-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-3">
                <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                <span className="text-slate-600 text-sm animate-pulse">{status}</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 bg-white p-4">
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            {selectedImage && (
              <div className="absolute bottom-full left-0 mb-4 p-2 bg-white rounded-xl border border-gray-200 shadow-lg z-10">
                <div className="relative w-24 h-24">
                  <Image src={selectedImage} alt="Preview" fill className="object-cover rounded-lg" unoptimized />
                  <button onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
            <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
                className="block w-full resize-none border-0 bg-transparent p-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm outline-none"
                placeholder="Describe what you want to create..."
                rows={2}
              />
              <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2 bg-gray-50">
                <div className="flex items-center gap-2">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                  />
                  <button 
                    onClick={() => uploadCount < 5 ? fileInputRef.current?.click() : setShowSubscriptionModal(true)}
                    className={`p-2 rounded-lg hover:bg-gray-100 ${selectedImage ? 'text-indigo-600' : 'text-gray-400'} relative`}
                    title={uploadCount < 5 ? "Upload Image" : "Subscribe to unlock"}
                  >
                    <ImageIcon className="h-5 w-5" />
                    {uploadCount >= 5 && (
                      <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                        <Lock className="w-2.5 h-2.5 text-gray-500" />
                      </div>
                    )}
                  </button>
                  <button onClick={() => setPrompt("A futuristic city neon lights")} className="text-xs text-gray-500 hover:text-indigo-600">
                    Surprise Me
                  </button>
                </div>
                <button 
                  onClick={handleSubmit} 
                  disabled={isLoading || !prompt.trim()} 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? <Zap className="h-4 w-4 animate-pulse" /> : <Send className="h-4 w-4" />}
                  {isLoading ? 'Generating...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ImageStudioPage() {
  return (
    <Suspense fallback={<div>Loading Studio...</div>}>
      <ImageStudioContent />
    </Suspense>
  )
}