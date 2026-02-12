import { LoginForm } from "@/components/auth/LoginForm";
import { Navbar } from "@/components/layout/Navbar";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Brand Side (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-neutral-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent"></div>

        <div className="relative z-10 max-w-lg">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-8 backdrop-blur-sm border border-blue-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Turn your documents into <span className="text-blue-400">interactive stories</span>.
          </h2>
          <p className="text-lg text-neutral-400 leading-relaxed">
            Join thousands of students who are learning faster and retaining more with Edustory's AI-powered narrative generation.
          </p>

          <div className="mt-12 flex items-center gap-4 text-sm text-neutral-500 font-medium">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-neutral-900 bg-neutral-800"></div>
              ))}
            </div>
            <span>Used by 10,000+ students</span>
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
                Welcome back
              </h1>
              <p className="text-neutral-500">
                Please enter your details to sign in
              </p>
            </div>

            <div className="bg-white p-0 lg:p-0">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
