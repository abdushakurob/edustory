"use client";

import { useState } from "react";
import { StoryGenerator } from "@/components/stories/StoryGenerator";
import { QuestionGenerator } from "@/components/stories/QuestionGenerator";
import {
  ProgressStepper,
  SectionNavigator,
} from "@/components/progress/ProgressStepper";

interface Section {
  id: string;
  title?: string;
  sectionNumber: number;
  content: string;
}

interface DocumentClientProps {
  document: any;
  subjectId: string;
  sections: Section[];
}

export default function DocumentClient({
  document,
  subjectId,
  sections,
}: DocumentClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    new Set(),
  );

  const currentSection = sections[currentIndex];
  const isFirstSection = currentIndex === 0;
  const isLastSection = currentIndex === sections.length - 1;

  const handleNext = () => {
    if (!isLastSection) {
      setCurrentIndex(currentIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (!isFirstSection) {
      setCurrentIndex(currentIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSectionChange = (index: number) => {
    setCurrentIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const markSectionComplete = (sectionId: string) => {
    setCompletedSections((prev) => new Set([...prev, sectionId]));
  };

  return (
    <>
      {/* Progress Stepper */}
      <ProgressStepper
        sections={sections}
        currentIndex={currentIndex}
        onSectionChange={handleSectionChange}
        completedSections={completedSections}
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="card-base p-8 md:p-10">
          {/* Section Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                    {currentIndex + 1}
                  </span>
                  <h2 className="heading-3">
                    {currentSection.title ||
                      `Section ${currentSection.sectionNumber}`}
                  </h2>
                </div>
                <p className="text-sm text-neutral-500">
                  Learn the core concepts through an engaging story
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <div className="flex-1 bg-neutral-200 rounded-full h-1">
                <div
                  className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / sections.length) * 100}%`,
                  }}
                />
              </div>
              <span className="font-medium">
                {currentIndex + 1} / {sections.length}
              </span>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Original Content */}
            <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">📄</span>
                <h3 className="font-semibold text-neutral-900">
                  Source Material
                </h3>
              </div>
              <p className="text-neutral-700 leading-relaxed text-sm line-clamp-5">
                {currentSection.content}
              </p>
            </div>

            {/* Story Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <h3 className="heading-4">Learn Through Stories</h3>
              </div>
              <p className="text-sm text-neutral-600 mb-4">
                We'll explain this concept through an engaging Nigerian story
              </p>
              <StoryGenerator
                sectionId={currentSection.id}
                subjectId={subjectId}
                onGenerated={() => markSectionComplete(currentSection.id)}
              />
            </div>

            {/* Questions Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">❓</span>
                <h3 className="heading-4">Test Your Understanding</h3>
              </div>
              <p className="text-sm text-neutral-600 mb-4">
                Practice questions to reinforce what you've learned
              </p>
              <QuestionGenerator
                sectionId={currentSection.id}
                subjectId={subjectId}
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <SectionNavigator
          currentIndex={currentIndex}
          totalSections={sections.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isLastSection={isLastSection}
          isFirstSection={isFirstSection}
        />

        {/* Footer Message */}
        {isLastSection && completedSections.size === sections.length && (
          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 text-center">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              🎉 Congratulations!
            </h3>
            <p className="text-green-700">
              You've completed all sections of this document. Great job on your
              learning journey!
            </p>
          </div>
        )}
      </main>
    </>
  );
}
