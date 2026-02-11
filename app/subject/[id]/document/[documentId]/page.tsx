import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getDocument } from "@/app/actions/documents";
import { StoryGenerator } from "@/components/stories/StoryGenerator";
import { QuestionGenerator } from "@/components/stories/QuestionGenerator";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function DocumentPage({
  params,
}: {
  params: { id: string; documentId: string };
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const document = await getDocument(params.documentId);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Link
            href={`/subject/${params.id}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={18} />
            Back to Subject
          </Link>
          <h1 className="heading-2">{document.title}</h1>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {document.sections.map((section, index) => (
            <div key={section.id} className="card-base p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="heading-3">
                    {section.title || `Section ${section.sectionNumber}`}
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1">
                    Part {index + 1} of {document.sections.length}
                  </p>
                </div>
              </div>

              {/* Original Content */}
              <div className="mb-8 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <h4 className="text-sm font-semibold text-neutral-900 mb-3">
                  📄 Original Content
                </h4>
                <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap line-clamp-4">
                  {section.content}
                </p>
              </div>

              {/* Story Section */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-neutral-900 mb-4">
                  ✨ AI Story
                </h4>
                <StoryGenerator sectionId={section.id} subjectId={params.id} />
              </div>

              {/* Questions Section */}
              <div>
                <h4 className="text-lg font-semibold text-neutral-900 mb-4">
                  ❓ Practice Questions
                </h4>
                <QuestionGenerator
                  sectionId={section.id}
                  subjectId={params.id}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-12">
          <Link href={`/subject/${params.id}`} className="btn-secondary">
            ← Back to Subject
          </Link>
        </div>
      </main>
    </div>
  );
}
