import DashboardLayout from "@/components/layout/DashboardLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Play, Clock, MoreHorizontal, Plus } from "lucide-react";

export default function Home() {
  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
            Welcome back, Alex
          </h1>
          <p className="text-neutral-500 mt-1">
            Continue where you left off or start a new story.
          </p>
        </div>
        <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Story
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Recents Section */}
        <div className="col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-800">
              Continue Learning
            </h2>
            <button className="text-sm text-primary font-medium hover:text-primary/80 transition-colors">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <GlassPanel
                key={i}
                hoverEffect
                className="p-4 flex items-center gap-4 cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-lg bg-neutral-100 flex items-center justify-center text-2xl shadow-inner">
                  {i === 1 ? "🧬" : i === 2 ? "⚛️" : "🌍"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-900 group-hover:text-primary transition-colors">
                    {i === 1
                      ? "Introduction to Molecular Biology"
                      : i === 2
                        ? "Quantum Physics Basics"
                        : "Global Climate Systems"}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      12m left
                    </span>
                    <span>•</span>
                    <span>Updated 2h ago</span>
                  </div>
                </div>
                <button className="p-2 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-600 transition-colors">
                  <Play className="w-5 h-5 fill-current" />
                </button>
              </GlassPanel>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">
              Your Library
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <GlassPanel
                  key={i}
                  hoverEffect
                  className="p-5 flex flex-col gap-4 cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <div className="font-bold">Ch</div>
                    </div>
                    <button className="text-neutral-400 hover:text-neutral-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900 line-clamp-1">
                      Chapter 4: Neural Networks
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      24 pages • PDF
                    </p>
                  </div>
                  <div className="w-full bg-neutral-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${Math.random() * 100}%` }}
                    />
                  </div>
                </GlassPanel>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar / Stats */}
        <div className="col-span-4 space-y-6">
          <GlassPanel className="p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">
              Weekly Progress
            </h3>
            <div className="flex items-end gap-2 h-32 justify-between px-2">
              {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group">
                  <div
                    className="w-8 bg-blue-100 rounded-t-lg relative group-hover:bg-blue-200 transition-colors"
                    style={{ height: `${h}%` }}
                  >
                    <div
                      className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all duration-500"
                      style={{ height: `${h * 0.4}%` }}
                    />
                  </div>
                  <span className="text-xs text-neutral-400 font-medium">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </span>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-900">
                Quick Actions
              </h3>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-neutral-50 text-sm font-medium text-neutral-700 transition-colors flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  +
                </div>
                Upload Document
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-neutral-50 text-sm font-medium text-neutral-700 transition-colors flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                  ?
                </div>
                Take a Quiz
              </button>
            </div>
          </GlassPanel>
        </div>
      </div>
    </DashboardLayout>
  );
}

