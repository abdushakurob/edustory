import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getDocument } from "@/app/actions/documents";
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

  if (!document) {
    redirect(`/dashboard/subject/${params.id}`);
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="border-b border-white/10 bg-glass-surface/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href={`/dashboard/subject/${params.id}`}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-4 text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to Subject
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">{document.title}</h1>
          <p className="text-neutral-500 mt-2">
            Interactive Story Mode
          </p>
        </div>
      </header>

      <DocumentClient
        subjectId={params.id}
        sections={document.sections}
      />
    </div>
  );
}
