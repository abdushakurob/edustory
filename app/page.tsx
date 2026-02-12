import { Navbar } from "@/components/layout/Navbar";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ArrowRight, Sparkles, Upload, Zap, GraduationCap, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-50/50 rounded-full blur-3xl -z-10 opacity-60"></div>

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.1]">
            Turn your documents into <br />
            <span className="text-blue-600">captivating stories.</span>
          </h1>

          <p className="text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            StoryMind transforms dry academic papers, PDFs, and lecture notes into
            engaging narratives, helping you learn faster and retain more.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="group bg-blue-600 text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2 hover:-translate-y-1"
            >
              Start Learning for Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 rounded-xl font-medium text-neutral-600 hover:bg-neutral-50 transition-all border border-neutral-200 hover:border-neutral-300"
            >
              Sign In
            </Link>
          </div>

          <div className="pt-12 text-sm text-neutral-400 flex items-center justify-center gap-8">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" /> 10k+ Students
            </span>
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> AI-Powered
            </span>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6 bg-neutral-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">How StoryMind Works</h2>
            <p className="text-neutral-500 max-w-lg mx-auto">Three simple steps to transform your learning experience.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Upload, title: "1. Upload", desc: "Drop your PDF, Word doc, or notes into the platform." },
              { icon: Zap, title: "2. Transform", desc: "Our AI instantly converts structured text into an engaging narrative." },
              { icon: GraduationCap, title: "3. Master", desc: "Read the story, take quizzes, and track your retention." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">{item.title}</h3>
                <p className="text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-neutral-900">Why learn with stories?</h2>
              <div className="space-y-6">
                {[
                  { title: "Better Retention", desc: "Humans are wired for stories. We remember narratives 22x better than facts alone." },
                  { title: "Contextual Understanding", desc: "See how concepts connect in real-world scenarios rather than isolated definitions." },
                  { title: "Active Engagement", desc: "Stop passively reading. Interact with characters and problem-solving scenarios." }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0 mt-1">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900">{feature.title}</h3>
                      <p className="text-neutral-500 mt-1">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
              <GlassPanel className="p-8 border-neutral-200">
                <div className="flex items-center gap-3 mb-6 border-b border-neutral-100 pb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">🧬</div>
                  <div>
                    <h4 className="font-bold text-neutral-900">Cellular Respiration</h4>
                    <p className="text-xs text-neutral-500">Biology • Chapter 4</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    "Imagine the cell as a bustling city," the professor began. "The mitochondria is the power plant, working tirelessly..."
                  </p>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-xs font-medium text-blue-800 mb-2">Pop Quiz</p>
                    <p className="text-sm text-blue-900 font-medium">What is the primary function of the mitochondria?</p>
                  </div>
                </div>
              </GlassPanel>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

