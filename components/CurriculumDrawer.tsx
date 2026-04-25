"use client";

import { useHeritage } from "@/context/HeritageContext";
import { X, CheckCircle2 } from "lucide-react";
import curriculumData from "@/data/curriculum.json";
import { Curriculum } from "@/types";

const curriculum = curriculumData.curriculum as unknown as Curriculum;

export interface CurriculumDrawerProps {
  lessonId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CurriculumDrawer({ lessonId, isOpen, onClose }: CurriculumDrawerProps) {
  const { activeProfile, completeLesson } = useHeritage();

  if (!isOpen || !lessonId) return null;

  // Find the lesson
  let activeLesson = null;
  let activeChapterTitle = "";
  for (const [chapId, chapter] of Object.entries(curriculum)) {
    const lesson = chapter.lessons.find((l) => l.id === lessonId);
    if (lesson) {
      activeLesson = lesson;
      activeChapterTitle = chapter.title;
      break;
    }
  }

  if (!activeLesson) return null;

  const handleComplete = () => {
    completeLesson(activeLesson.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col justify-end">
      <div className="bg-gray-900 w-full h-[90vh] rounded-t-3xl overflow-hidden flex flex-col relative">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800 pt-safe">
          <div>
            <span className="text-amber-500 text-xs font-semibold uppercase tracking-widest block mb-1">
              {activeChapterTitle}
            </span>
            <h2 className="text-xl font-serif text-white">
              Day {activeLesson.unlockDay}: {activeLesson.title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-gray-800 rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 pb-safe">
          
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">Core Truths</h3>
            <ul className="space-y-4">
              {activeLesson.coreTruths.map((truth, idx) => {
                return (
                  <li key={idx} className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2.5 shrink-0" />
                    <p className="text-gray-200 leading-relaxed text-lg font-serif">
                      {truth}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 mb-8">
            <h3 className="text-xs font-semibold text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              The Basics
            </h3>
            <p className="text-amber-100/90 leading-relaxed text-lg font-serif">
              {activeLesson.ageCallout.basics}
            </p>
          </div>

          {/* Footer Citation */}
          <p className="text-xs text-gray-600 text-center italic mb-12">
            Source: Orthodox Catechism: Basic Teachings of the Orthodox Faith | Greek Orthodox Archdiocese of Canada
          </p>

          <button
            onClick={handleComplete}
            className="w-full bg-amber-500 text-gray-900 font-bold py-4 rounded-full flex items-center justify-center gap-2 active:scale-[0.98] transition-transform min-h-[44px]"
          >
            <CheckCircle2 size={20} />
            Complete Lesson
          </button>
        </div>

      </div>
    </div>
  );
}
