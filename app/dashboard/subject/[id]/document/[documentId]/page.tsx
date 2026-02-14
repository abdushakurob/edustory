import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getDocument } from "@/app/actions/documents";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DocumentClient from "./DocumentClient";
import ReprocessButton from "./ReprocessButton";

export default async function DocumentPage({
  params,
}: {
  params: { id: string; documentId: string };
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  let document;
  try {
    document = await getDocument(params.documentId);
  } catch {
    redirect(`/dashboard/subject/${params.id}`);
  }

  if (!document) {
    redirect(`/dashboard/subject/${params.id}`);
  }

  const hasSections = document.sections && document.sections.length > 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="border-b border-white/10 bg-glass-surface/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Link
            href={`/dashboard/subject/${params.id}`}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-4 text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to Subject
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">{document.title}</h1>
          <p className="text-neutral-500 mt-2">
            {hasSections ? "Interactive Story Mode" : "Document Processing"}
          </p>
        </div>
      </header>

      {hasSections ? (
        <DocumentClient
          subjectId={params.id}
          sections={document.sections}
        />
      ) : (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
              <ArrowLeft size={24} className="text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900">
              No sections found
            </h2>
            <p className="text-neutral-500 max-w-md mx-auto">
              This document was uploaded but no sections were created. This can happen if the text extraction failed during upload.
            </p>
            <div className="pt-2">
              <ReprocessButton
                documentId={params.documentId}
                subjectId={params.id}
              />
            </div>
            <p className="text-xs text-neutral-400 pt-2">
              If reprocessing doesn&apos;t work, try deleting and re-uploading the document.
            </p>
          </div>
        </main>
      )}
    </div>
  );
}
