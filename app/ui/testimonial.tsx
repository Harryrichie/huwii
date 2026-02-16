import Image from "next/image"
import { Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Content Manager",
    content: "Hawii AI has revolutionized our workflow. We're producing 3x more content in half the time.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
  },
  {
    name: "Mark Thompson",
    role: "Startup Founder",
    content: "The quality of the writing is outstanding. It sounds just like a human wrote it, but faster.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces",
  },
  {
    name: "Emily Chen",
    role: "Social Media Specialist",
    content: "I can't imagine managing my clients' accounts without this tool. It's a game changer.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces",
  },
  {
    name: "David Miller",
    role: "Freelance Writer",
    content: "Finally, an AI that understands nuance. My clients are happier than ever.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
  },
  {
    name: "Lisa Wong",
    role: "Marketing Director",
    content: "The ROI we've seen since switching to Hawii is incredible. Highly recommended.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
  },
   {
    name: "James Wilson",
    role: "Blogger",
    content: "It helps me overcome writer's block instantly. A must-have tool.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
  },
]

export default function Testimonial() {
  return (
    <section id="testimonials" className="w-full py-20 bg-gray-950 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      <div className="container px-4 md:px-6 mx-auto relative z-10 mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-6">
            Loved by Creators Worldwide
          </h2>
          <p className="text-gray-400 md:text-xl">
            Join thousands of satisfied users who have transformed their content creation process with our AI tools.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 relative z-10">
        {/* First Row - Moving Left */}
        <div className="flex overflow-hidden group">
          <div className="flex gap-6 animate-scroll">
            {[...testimonials, ...testimonials].map((testimonial, i) => (
              <TestimonialCard key={`row1-${i}`} {...testimonial} />
            ))}
          </div>
        </div>

        {/* Second Row - Moving Right */}
        <div className="flex overflow-hidden group">
          <div className="flex gap-6 animate-scroll-reverse">
            {[...testimonials, ...testimonials].map((testimonial, i) => (
              <TestimonialCard key={`row2-${i}`} {...testimonial} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
          width: max-content;
        }
        .animate-scroll-reverse {
          animation: scroll 40s linear infinite reverse;
          width: max-content;
        }
        .group:hover .animate-scroll,
        .group:hover .animate-scroll-reverse {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}

function TestimonialCard({ name, role, content, image }: { name: string, role: string, content: string, image: string }) {
  return (
    <div className="w-[350px] md:w-[450px] flex-shrink-0 p-8 rounded-2xl bg-gray-900/40 border border-gray-800 backdrop-blur-sm hover:bg-gray-800/60 transition-all duration-300 hover:border-gray-700 hover:shadow-2xl hover:shadow-indigo-500/10">
      <div className="flex items-start gap-4 mb-6">
        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-500/20 group-hover:border-indigo-500/50 transition-colors">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="text-white font-semibold text-lg">{name}</h4>
          <p className="text-indigo-400 text-sm">{role}</p>
        </div>
        <Quote className="w-8 h-8 text-gray-700 ml-auto" />
      </div>
      <p className="text-gray-300 leading-relaxed text-lg">
        {content}
      </p>
    </div>
  )
}
