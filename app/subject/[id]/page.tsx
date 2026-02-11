import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getSubject } from "@/app/actions/subjects";
import { getDocuments } from "@/app/actions/documents";
import { FileUpload } from "@/components/documents/FileUpload";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

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
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="heading-2">{subject.title}</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {subject.theme}
              </span>
            </div>
            {subject.description && (
              <p className="text-neutral-600">{subject.description}</p>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <FileUpload subjectId={params.id} />
          </div>

          {/* Documents List */}
          <div className="lg:col-span-2">
            <h2 className="heading-3 mb-6">Documents</h2>

            {documents.length === 0 ? (
              <div className="card-base p-12 text-center text-neutral-600">
                <FileText size={48} className="mx-auto mb-4 opacity-30" />
                <p>No documents yet. Upload one to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <Link
                    key={doc.id}
                    href={`/subject/${params.id}/document/${doc.id}`}
                    className="card-base p-6 hover:shadow-md transition-smooth block"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-neutral-900">
                        {doc.title}
                      </h3>
                      <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                        {doc.fileType.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">
                      {doc.sections?.length || 0} section
                      {doc.sections?.length !== 1 ? "s" : ""}
                    </p>
                    <div className="text-sm text-blue-600 hover:underline">
                      View →
                    </div>
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
