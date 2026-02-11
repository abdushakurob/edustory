import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-neutral-100">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center space-y-6 mb-16">
          <h1 className="heading-1 text-5xl">
            Learn Better with{" "}
            <span className="text-blue-600">StoryMind AI</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Transform your study materials into engaging narratives. Upload
            documents, watch them become interactive stories, and master the
            content through intelligent questions.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login" className="btn-primary px-8 py-3 text-lg">
              Sign In
            </Link>
            <Link href="/register" className="btn-secondary px-8 py-3 text-lg">
              Get Started
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="card-base p-8 space-y-4">
            <div className="text-4xl">📚</div>
            <h3 className="heading-3">Upload Documents</h3>
            <p className="text-neutral-600">
              Upload PDFs, Word docs, presentations, or images. We'll extract
              everything.
            </p>
          </div>
          <div className="card-base p-8 space-y-4">
            <div className="text-4xl">✨</div>
            <h3 className="heading-3">AI Transforms Content</h3>
            <p className="text-neutral-600">
              Gemini converts academic material into compelling narratives.
            </p>
          </div>
          <div className="card-base p-8 space-y-4">
            <div className="text-4xl">🎯</div>
            <h3 className="heading-3">Quiz & Master</h3>
            <p className="text-neutral-600">
              Interactive questions reinforce learning with personalized
              feedback.
            </p>
          </div>
        </div>

        <div className="card-base p-12 space-y-8">
          <h2 className="heading-2 text-center">How It Works</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900">
                  Create a Subject
                </h4>
                <p className="text-neutral-600">
                  Biology, Physics, History - organize your learning by topic.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900">
                  Upload Materials
                </h4>
                <p className="text-neutral-600">
                  Add any document or image. We extract and organize the
                  content.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900">
                  Generate Stories
                </h4>
                <p className="text-neutral-600">
                  AI creates narrative explanations that make content stick.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900">
                  Practice & Learn
                </h4>
                <p className="text-neutral-600">
                  Answer questions and get personalized feedback to solidify
                  knowledge.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
