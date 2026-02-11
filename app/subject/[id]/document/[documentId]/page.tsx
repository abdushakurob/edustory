import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getDocument } from "@/app/actions/documents";
import { StoryGenerator } from "@/components/stories/StoryGenerator";
import { QuestionGenerator } from "@/components/stories/QuestionGenerator";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DocumentClient from "./DocumentClient";

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
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Link
            href={`/subject/${params.id}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={18} />
            Back to Subject
          </Link>
          <h1 className="heading-2">{document.title}</h1>
          <p className="text-neutral-600 mt-2">
            Learn through engaging stories and practice questions
          </p>
        </div>
      </header>

      <DocumentClient
        document={document}
        subjectId={params.id}
        sections={document.sections}
      />
    </div>
  );
}
