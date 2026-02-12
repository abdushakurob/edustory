import { getSubjects } from "@/app/actions/subjects";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Library, Folder, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CreateSubjectModal } from "@/components/dashboard/CreateSubjectModal";

interface Document {
    id: string;
    title: string;
    createdAt: Date;
}

interface SubjectWithDocs {
    id: string;
    title: string;
    updatedAt: Date;
    documents: Document[];
}

export default async function LibraryPage() {
    const subjects = (await getSubjects()) as unknown as SubjectWithDocs[];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">Library</h1>
                    <p className="text-neutral-500">Manage your subjects and documents</p>
                </div>
                <CreateSubjectModal>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                        <Plus className="w-4 h-4" />
                        New Subject
                    </button>
                </CreateSubjectModal>
            </div>

            {subjects.length === 0 ? (
                <GlassPanel className="p-12 text-center border-dashed border-2 border-neutral-200 bg-neutral-50/30">
                    <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                        <Library className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h3 className="font-medium text-neutral-900">Library is empty</h3>
                    <p className="text-sm text-neutral-500 mb-6 max-w-sm mx-auto">
                        Create your first subject to start organizing your documents and generating stories.
                    </p>
                    <CreateSubjectModal>
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors">
                            <Plus className="w-4 h-4" />
                            Create Subject
                        </button>
                    </CreateSubjectModal>
                </GlassPanel>
            ) : (
                <div className="space-y-6">
                    {subjects.map((subject) => (
                        <div key={subject.id} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Link href={`/dashboard/subject/${subject.id}`} className="flex items-center gap-3 group">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Folder className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                                            {subject.title}
                                        </h3>
                                        <p className="text-xs text-neutral-500">
                                            {subject.documents.length} documents • Updated {formatDistanceToNow(new Date(subject.updatedAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                </Link>
                                <Link
                                    href={`/dashboard/subject/${subject.id}`}
                                    className="text-sm font-medium text-blue-600 hover:underline"
                                >
                                    View Subject
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {subject.documents.map((doc) => (
                                    <Link key={doc.id} href={`/dashboard/subject/${subject.id}`}>
                                        <GlassPanel className="p-4 hover:border-blue-200 transition-colors cursor-pointer flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-neutral-50 text-neutral-400">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-neutral-900 truncate text-sm">
                                                    {doc.title}
                                                </p>
                                                <p className="text-xs text-neutral-500 mt-1">
                                                    {formatDistanceToNow(new Date(doc.createdAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </GlassPanel>
                                    </Link>
                                ))}
                                <Link href={`/dashboard/subject/${subject.id}`}>
                                    <GlassPanel className="p-4 border-dashed border-2 border-neutral-100 hover:border-blue-200 transition-colors cursor-pointer flex items-center justify-center gap-2 h-full min-h-[80px] text-neutral-400 hover:text-blue-600">
                                        <Plus className="w-4 h-4" />
                                        <span className="text-sm font-medium">Add Document</span>
                                    </GlassPanel>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
