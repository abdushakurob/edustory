"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

interface ProgressStepperProps {
  sections: Array<{
    id: string;
    title: string;
    sectionNumber: number;
  }>;
  currentIndex: number;
  onSectionChange: (index: number) => void;
  completedSections: Set<string>;
}

export function ProgressStepper({
  sections,
  currentIndex,
  onSectionChange,
  completedSections,
}: ProgressStepperProps) {
  const completionPercentage = Math.round(
    (completedSections.size / sections.length) * 100,
  );

  return (
    <div className="bg-white border-b border-neutral-200 sticky top-14 lg:top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Progress Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-neutral-900">
              Your Learning Progress
            </h3>
            <span className="text-sm font-semibold text-blue-600">
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Section Steps */}
        <div className="overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {sections.map((section, index) => {
              const isCompleted = completedSections.has(section.id);
              const isCurrent = index === currentIndex;

              return (
                <button
                  key={section.id}
                  onClick={() => onSectionChange(index)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${isCurrent
                      ? "bg-blue-600 text-white shadow-md"
                      : isCompleted
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    {isCompleted && <Check size={16} />}
                    <span>
                      {section.title || `Section ${section.sectionNumber}`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SectionNavigatorProps {
  currentIndex: number;
  totalSections: number;
  onNext: () => void;
  onPrevious: () => void;
  isLastSection: boolean;
  isFirstSection: boolean;
}

export function SectionNavigator({
  currentIndex,
  totalSections,
  onNext,
  onPrevious,
  isLastSection,
  isFirstSection,
}: SectionNavigatorProps) {
  return (
    <div className="flex items-center justify-between mt-12 pt-8 border-t border-neutral-200">
      <button
        onClick={onPrevious}
        disabled={isFirstSection}
        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm transition-all ${isFirstSection
            ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
            : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
          }`}
      >
        <ChevronLeft size={20} />
        Previous
      </button>

      <div className="text-center">
        <p className="text-sm text-neutral-600">
          Section {currentIndex + 1} of {totalSections}
        </p>
      </div>

      <button
        onClick={onNext}
        disabled={isLastSection}
        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm transition-all ${isLastSection
            ? "bg-green-100 text-green-800 hover:bg-green-200"
            : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
      >
        {isLastSection ? (
          <>
            <Check size={20} />
            Completed
          </>
        ) : (
          <>
            Next
            <ChevronRight size={20} />
          </>
        )}
      </button>
    </div>
  );
}
