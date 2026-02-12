import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getSubject } from "@/app/actions/subjects";
import { getDocuments } from "@/app/actions/documents";
import { FileUpload } from "@/components/documents/FileUpload";
import Link from "next/link";
import { ArrowLeft, FileText, BookOpen } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";

export default async function SubjectPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const subject = await getSubject(params.id);
  const documents = await getDocuments(params.id);

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="border-b border-white/10 bg-glass-surface/30 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-4 text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">{subject.title}</h1>
                <span className="px-3 py-1 bg-blue-100/50 text-blue-700 border border-blue-200/50 rounded-full text-xs font-medium backdrop-blur-sm">
                  {subject.theme}
                </span>
              </div>
              {subject.description && (
                <p className="text-neutral-500 max-w-2xl">{subject.description}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <GlassPanel className="p-6 space-y-4">
              <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BookOpen size={16} />
                </div>
                Add Content
              </h3>
              <p className="text-sm text-neutral-500">
                Upload PDFs, documents, or create new stories to add to this subject.
              </p>
              <FileUpload subjectId={params.id} />
            </GlassPanel>
          </div>

          {/* Documents List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Documents</h2>
              <span className="text-sm text-neutral-500">{documents.length} items</span>
            </div>

            {documents.length === 0 ? (
              <GlassPanel className="p-12 text-center text-neutral-500 flex flex-col items-center justify-center border-dashed border-2 border-white/40 bg-white/20">
                <div className="w-16 h-16 rounded-full bg-neutral-100/50 flex items-center justify-center mb-4">
                  <FileText size={32} className="opacity-40" />
                </div>
                <p className="font-medium">No documents yet</p>
                <p className="text-sm mt-1">Upload one to get started</p>
              </GlassPanel>
            ) : (
              <div className="grid gap-4">
                {documents.map((doc: any) => (
                  <Link
                    key={doc.id}
                    href={`/dashboard/subject/${params.id}/document/${doc.id}`}
                    className="block group"
                  >
                    <GlassPanel hoverEffect className="p-5 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <FileText size={20} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">
                              {doc.title}
                            </h3>
                            <p className="text-xs text-neutral-500 mt-1">
                              {doc.sections?.length || 0} sections • {doc.fileType.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium px-2 py-1 bg-blue-50 rounded-full">
                          View Story →
                        </span>
                      </div>
                    </GlassPanel>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
