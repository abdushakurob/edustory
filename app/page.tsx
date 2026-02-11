import { Navbar } from "@/components/layout/Navbar";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ArrowRight, BookOpen, Sparkles, Brain } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
            <Sparkles className="w-3 h-3" />
            <span>New: AI-Powered Story Generation</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900">
            Turn documents into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
              captivating stories.
            </span>
          </h1>

          <p className="text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            StoryMind transforms your dry academic papers and documents into
            engaging narratives, helping you learn faster and retain more.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="group bg-blue-600 text-white px-8 py-3.5 rounded-xl font-medium text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
            >
              Start Learning
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-3.5 rounded-xl font-medium text-neutral-600 hover:bg-neutral-100 transition-all">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-neutral-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <GlassPanel className="p-8 space-y-4 border-white/60 bg-white/40">
              <div className="w-12 h-12 rounded-xl bg-blue-100/50 text-blue-600 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900">Smart Upload</h3>
              <p className="text-neutral-500 leading-relaxed">
                Drag and drop your PDFs, Word docs, or slides. We instantly analyze and structure the content for you.
              </p>
            </GlassPanel>

            <GlassPanel className="p-8 space-y-4 border-white/60 bg-white/40">
              <div className="w-12 h-12 rounded-xl bg-emerald-100/50 text-emerald-600 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900">Narrative AI</h3>
              <p className="text-neutral-500 leading-relaxed">
                Our advanced AI rewrites complex topics into clear, engaging stories that are easy to understand.
              </p>
            </GlassPanel>

            <GlassPanel className="p-8 space-y-4 border-white/60 bg-white/40">
              <div className="w-12 h-12 rounded-xl bg-purple-100/50 text-purple-600 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900">Active Recall</h3>
              <p className="text-neutral-500 leading-relaxed">
                Test your knowledge with auto-generated quizzes and interactive flashcards tailored to your content.
              </p>
            </GlassPanel>
          </div>
        </div>
      </section>
    </div>
  );
}

