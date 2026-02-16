import { Newspaper, Globe, Mail, Image, PenTool, Search } from "lucide-react"

const features = [
  {
    icon: Newspaper,
    title: "Blog Posts",
    description: "Create SEO-optimized blog posts that rank high on search engines.",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    hoverBorder: "group-hover:border-blue-200",
    delay: "0ms"
  },
  {
    icon: Globe,
    title: "Social Media",
    description: "Generate engaging captions and hashtags for all your social platforms.",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    hoverBorder: "group-hover:border-purple-200",
    delay: "100ms"
  },
  {
    icon: Mail,
    title: "Email Marketing",
    description: "Write personalized emails that get opened and clicked.",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    hoverBorder: "group-hover:border-green-200",
    delay: "200ms"
  },
  {
    icon: Image,
    title: "Image Studio",
    description: "Never run out of content ideas with our AI-powered brainstorming tool.",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    hoverBorder: "group-hover:border-yellow-200",
    delay: "300ms"
  },
  {
    icon: PenTool,
    title: "Copywriting",
    description: "Craft compelling ad copy that converts visitors into customers.",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    hoverBorder: "group-hover:border-red-200",
    delay: "400ms"
  },
  {
    icon: Search,
    title: "SEO Analysis",
    description: "Analyze and optimize your content for maximum visibility.",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    hoverBorder: "group-hover:border-indigo-200",
    delay: "500ms"
  },
]

export default function Features() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-4">
            Everything You Need to Create Content
          </h2>
          <p className="text-gray-500 md:text-xl max-w-[800px] mx-auto">
            Our AI-powered platform provides a comprehensive suite of tools to supercharge your content creation process.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ${feature.hoverBorder} animate-fade-in-up`}
              style={{
                animationDelay: feature.delay,
                animationFillMode: 'both'
              }}
            >
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-xl ${feature.iconBg} ${feature.iconColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  )
}