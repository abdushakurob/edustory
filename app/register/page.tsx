import { LoginForm } from "@/components/auth/LoginForm";
import { Navbar } from "@/components/layout/Navbar";
import { Sparkles, Brain, BookOpen } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Brand Side (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-neutral-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent"></div>

        <div className="relative z-10 max-w-lg space-y-12">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-8 backdrop-blur-sm border border-emerald-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Start your journey to <br /><span className="text-emerald-400">smarter learning</span>.
            </h2>
            <p className="text-lg text-neutral-400 leading-relaxed">
              Create an account to unlock AI-powered storytelling, quizzes, and progress tracking for all your study materials.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Brain className="w-6 h-6 text-emerald-400 mb-3" />
              <h3 className="text-white font-medium mb-1">Active Recall</h3>
              <p className="text-sm text-neutral-400">Boost retention with smart quizzes</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <BookOpen className="w-6 h-6 text-blue-400 mb-3" />
              <h3 className="text-white font-medium mb-1">Story Mode</h3>
              <p className="text-sm text-neutral-400">Turn boring docs into narratives</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 sm:px-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
                Create an account
              </h1>
              <p className="text-neutral-500">
                Enter your details to get started
              </p>
            </div>

            <div className="bg-white p-0 lg:p-0">
              <LoginForm isRegister />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
