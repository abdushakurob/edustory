import { getAllStories } from "@/app/actions/stories";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface StoryWithRelations {
    id: string;
    subjectId: string;
    sectionId: string;
    narrative: string;
    keyPoints: unknown;
    summary: string | null;
    createdAt: Date;
    updatedAt: Date;
    subject: {
        title: string;
    };
    section: {
        title: string | null;
        document: {
            id: string;
        };
    };
}

export default async function StoriesPage() {
    const stories = (await getAllStories()) as unknown as StoryWithRelations[];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Stories</h1>
                    <p className="text-neutral-500">Your generated learning narratives</p>
                </div>
            </div>

            {stories.length === 0 ? (
                <GlassPanel className="p-12 text-center border-dashed border-2 border-neutral-200 bg-neutral-50/30">
                    <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                        <BookOpen className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h3 className="font-medium text-neutral-900">No stories yet</h3>
                    <p className="text-sm text-neutral-500 mb-6 max-w-sm mx-auto">
                        Upload a document to a subject to generate your first learning story.
                    </p>
                    <Link
                        href="/dashboard/library"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                        Go to Library
                    </Link>
                </GlassPanel>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stories.map((story) => (
                        <Link key={story.id} href={`/dashboard/subject/${story.subjectId}/document/${story.section.document.id}`}>
                            <GlassPanel className="h-full hover:scale-[1.02] transition-all duration-200 group cursor-pointer relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="p-6 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                                            {story.subject.title}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-neutral-400">
                                            <Clock className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(story.updatedAt), { addSuffix: true })}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-neutral-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                                            {story.section.title || "Untitled Section"}
                                        </h3>
                                        <p className="text-sm text-neutral-500 line-clamp-3">
                                            {story.summary || story.narrative.substring(0, 150)}
                                        </p>
                                    </div>

                                    <div className="pt-4 flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                        Read Story <ArrowRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            </GlassPanel>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
