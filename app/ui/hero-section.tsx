import Link from "next/link"
import Image from "next/image"
import { Sparkles, ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-48 bg-gray-950 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="flex flex-col justify-center space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 text-sm font-medium text-indigo-300 bg-indigo-900/30 rounded-full border border-indigo-500/30 w-fit mx-auto lg:mx-0 animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2" />
              <span>AI-Powered Content Creation</span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight animate-slide-up">
              Create Content <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Faster Than Ever
              </span>
            </h1>
            
            <p className="max-w-[600px] text-gray-400 md:text-xl mx-auto lg:mx-0 animate-slide-up delay-100">
              Unleash your creativity with our advanced AI. Generate high-quality blog posts, social media captions, and marketing copy in seconds, not hours.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up delay-200">
              <Link
                className="inline-flex h-12 items-center justify-center rounded-full bg-white text-gray-950 px-8 text-base font-medium shadow-lg shadow-indigo-500/20 transition-all hover:bg-gray-100 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                href="/signup"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                className="inline-flex h-12 items-center justify-center rounded-full border border-gray-800 bg-gray-950/50 backdrop-blur-sm px-8 text-base font-medium text-gray-300 shadow-sm transition-all hover:bg-gray-900 hover:text-white hover:border-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700"
                href="#features"
              >
                Learn More
              </Link>
            </div>
            
            <div className="pt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500 animate-fade-in delay-300">
              <div className="flex -space-x-2">
                 {[1,2,3,4].map((i) => (
                   <div key={i} className={`w-8 h-8 rounded-full border-2 border-gray-950 bg-gray-800 flex items-center justify-center overflow-hidden`}>
                      {/* Using standard img tag to avoid next/image config issues for external domains in this snippet */}
                      <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" width={100} height={100} className="w-full h-full object-cover" unoptimized />
                   </div>
                 ))}
              </div>
              <p>Trusted by 10,000+ creators</p>
            </div>
          </div>

          <div className="relative lg:h-[600px] flex items-center justify-center animate-float">
            {/* Abstract AI Illustration */}
            <div className="relative w-full max-w-[500px] aspect-square">
               {/* Central glowing orb */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full blur-3xl opacity-40 animate-pulse-slow"></div>
               
               <svg className="w-full h-full" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Orbiting rings */}
                  <circle cx="250" cy="250" r="180" stroke="url(#grad1)" strokeWidth="1" strokeOpacity="0.3" className="animate-spin-slow" strokeDasharray="10 10" />
                  <circle cx="250" cy="250" r="140" stroke="url(#grad1)" strokeWidth="1" strokeOpacity="0.5" className="animate-spin-reverse-slower" strokeDasharray="4 8" />
                  
                  {/* Central Hexagon */}
                  <path d="M250 150 L336.6 200 L336.6 300 L250 350 L163.4 300 L163.4 200 Z" fill="rgba(30, 41, 59, 0.5)" stroke="url(#grad1)" strokeWidth="2" className="animate-pulse-slow" />
                  
                  {/* Floating Elements / Nodes */}
                  <g className="animate-float-delayed">
                    <rect x="340" y="120" width="60" height="60" rx="12" fill="#1e293b" stroke="#818cf8" strokeWidth="2" />
                    <path d="M355 150 L385 150" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                    <path d="M355 160 L375 160" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                  </g>

                  <g className="animate-float-delayed-2">
                    <rect x="80" y="280" width="70" height="50" rx="12" fill="#1e293b" stroke="#c084fc" strokeWidth="2" />
                    <circle cx="115" cy="305" r="10" fill="#c084fc" opacity="0.8" />
                  </g>

                  <g className="animate-float">
                     <rect x="360" y="320" width="50" height="50" rx="10" fill="#1e293b" stroke="#f472b6" strokeWidth="2" />
                     <path d="M375 345 L385 335 L395 345" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                  
                  {/* Connecting Lines */}
                  <path d="M250 250 L370 150" stroke="url(#grad1)" strokeWidth="1" strokeOpacity="0.3" className="animate-draw" />
                  <path d="M250 250 L115 305" stroke="url(#grad1)" strokeWidth="1" strokeOpacity="0.3" className="animate-draw delay-75" />
                  <path d="M250 250 L385 345" stroke="url(#grad1)" strokeWidth="1" strokeOpacity="0.3" className="animate-draw delay-150" />

                  {/* Central Icon */}
                  <path d="M235 230 L250 220 L265 230 L265 260 L250 270 L235 260 Z" fill="#818cf8" filter="url(#glow)" />
               </svg>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-delayed-2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse-slower {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes draw {
          from { stroke-dasharray: 0 1000; }
          to { stroke-dasharray: 1000 0; }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite 1s; }
        .animate-float-delayed-2 { animation: float-delayed-2 8s ease-in-out infinite 2s; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; transform-origin: 250px 250px; }
        .animate-spin-reverse-slower { animation: spin-reverse-slower 30s linear infinite; transform-origin: 250px 250px; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-1000 { animation-delay: 1000ms; }
      `}</style>
    </section>
  )
}
