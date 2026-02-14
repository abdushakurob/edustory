import { GlassPanel } from "@/components/ui/GlassPanel";
import { Play, Clock, Plus, BookOpen } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { getSubjects } from "@/app/actions/subjects";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const subjects = await getSubjects();

  const recentDocuments = subjects
    .flatMap((subject: any) =>
      subject.documents.map((doc: any) => ({
        ...doc,
        subjectTitle: subject.title,
        subjectTheme: subject.theme,
      })),
    )
    .sort(
      (a: any, b: any) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 3);

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Welcome back, {session.name || "there"}
          </h1>
          <p className="text-neutral-500 mt-1 text-sm sm:text-base">
            Continue where you left off or start a new story.
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2 self-start sm:self-auto text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          New Story
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Recents Section */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          {/* Continue Learning */}
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-base sm:text-lg font-semibold text-neutral-800">
              Continue Learning
            </h2>

            {recentDocuments.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {recentDocuments.map((doc: any) => (
                  <Link
                    key={doc.id}
                    href={`/dashboard/subject/${doc.subjectId}/document/${doc.id}`}
                  >
                    <GlassPanel
                      hoverEffect
                      className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4 cursor-pointer group"
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-blue-50/50 flex items-center justify-center text-xs sm:text-sm font-bold text-blue-600 shadow-sm border border-white/50 shrink-0">
                        {doc.title.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-neutral-900 group-hover:text-primary transition-colors truncate text-sm sm:text-base">
                          {doc.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-500 truncate">
                          {doc.subjectTitle} &bull; {doc.subjectTheme}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Updated{" "}
                            {new Date(doc.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="hidden sm:block p-2 bg-white/50 rounded-full text-primary opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                        <Play className="w-5 h-5 fill-current" />
                      </div>
                    </GlassPanel>
                  </Link>
                ))}
              </div>
            ) : (
              <GlassPanel className="p-6 sm:p-8 text-center border-dashed border-2 border-neutral-200 bg-neutral-50/30">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-400" />
                </div>
                <h3 className="font-medium text-neutral-900">
                  No stories yet
                </h3>
                <p className="text-sm text-neutral-500 mb-4">
                  Upload a document to generate your first story
                </p>
                <Link
                  href="/dashboard/new"
                  className="text-primary font-medium hover:underline text-sm"
                >
                  Create your first story &rarr;
                </Link>
              </GlassPanel>
            )}
          </div>

          {/* Library Section */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-neutral-800 mb-4">
              Your Library
            </h2>
            {subjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {subjects.map((subject: any) => (
                  <Link
                    key={subject.id}
                    href={`/dashboard/subject/${subject.id}`}
                  >
                    <GlassPanel
                      hoverEffect
                      className="p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 cursor-pointer h-full"
                    >
                      <div className="flex justify-between items-start">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-base sm:text-lg">
                          {(subject.title || "S").charAt(0)}
                        </div>
                        <div className="px-2 py-1 rounded-full bg-neutral-100 text-xs font-medium text-neutral-500">
                          {subject.documents.length} docs
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-neutral-900 line-clamp-1 text-sm sm:text-base">
                          {subject.title}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                          {subject.theme}
                        </p>
                      </div>
                    </GlassPanel>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12 text-neutral-500 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                <p>You haven&apos;t created any subjects yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar / Stats */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          <GlassPanel className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-900">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              <Link
                href="/dashboard/new"
                className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-neutral-50 text-sm font-medium text-neutral-700 transition-colors flex items-center gap-3 border border-transparent hover:border-neutral-200"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                Upload Document
              </Link>
            </div>
          </GlassPanel>

          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-100/20">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              Did you know?
            </h4>
            <p className="text-xs text-blue-700/80 leading-relaxed">
              Reviewing your stories within 24 hours increases retention by up
              to 60%.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
