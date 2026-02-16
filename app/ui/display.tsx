import Image from "next/image"

export default function DisplaySection() {
  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/display-bg.png"
          alt="AI Content Creator Background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="relative w-full max-w-4xl aspect-[16/9] bg-gray-950 rounded-xl border border-gray-800 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-2xl space-y-6 p-8">
                <div className="flex space-x-2 mb-8">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>

                <div className="space-y-4">
                  <div className="h-4 bg-gray-800 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-800 rounded w-1/2 animate-pulse delay-75"></div>
                  <div className="h-4 bg-gray-800 rounded w-5/6 animate-pulse delay-150"></div>
                </div>

                <div className="mt-8 p-4 rounded-lg bg-gray-900/80 border border-gray-800 backdrop-blur text-left shadow-inner">
                  <p className="font-mono text-sm text-green-400 flex items-center">
                    <span className="mr-2 text-gray-500">$</span>
                    <span className="animate-typing overflow-hidden whitespace-nowrap border-r-2 border-green-400 pr-1">
                      Generating 500 free prompts for you...
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Floating elements animation */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>
          </div>

          <div className="space-y-4 max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
              Free 500 Prompts For Users Everyday
            </h2>
            <p className="text-gray-400 md:text-xl">
              Experience the power of AI content writing without limits. Get started with daily free credits.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        .animate-typing {
          animation: typing 3s steps(40, end);
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        .animate-float {
            animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
            animation: float 8s ease-in-out infinite reverse;
        }
      `}</style>
    </section>
  )
}
