"use client";

import { useState, useRef, MouseEvent } from "react";
import { useHeritage } from "@/context/HeritageContext";
import { BadgeCheck, CheckCircle, Circle, Lock, BookOpen } from "lucide-react";
import curriculumData from "@/data/curriculum.json";
import { Curriculum } from "@/types";
import CurriculumDrawer from "@/components/CurriculumDrawer";

const curriculum = curriculumData.curriculum as unknown as Curriculum;

export default function LearningPage() {
  const { isHydrated, activeProfile } = useHeritage();
  
  const chapters = Object.entries(curriculum).map(([id, mod]) => ({ id, ...mod }));
  const [selectedChapId, setSelectedChapId] = useState<string>(chapters[0].id);
  const [lockedModalOpen, setLockedModalOpen] = useState(false);
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);

  // Carousel Drag-to-Scroll State
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  if (!isHydrated || !activeProfile) {
    return (
      <main className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="text-gray-400">Loading...</div>
      </main>
    );
  }

  const isChapterUnlocked = (chapIndex: number) => {
    if (chapIndex === 0) return true;
    const firstLessonUnlockDay = chapters[chapIndex].lessons[0].unlockDay;
    return activeProfile.currentDay >= firstLessonUnlockDay;
  };

  const selectedChapter = chapters.find((c) => c.id === selectedChapId) || chapters[0];

  const totalLessonsInChapter = selectedChapter.lessons.length;
  const completedLessonsInChapter = selectedChapter.lessons.filter(l => 
    activeProfile.completedLessons.includes(l.id)
  ).length;
  const progressPercent = Math.round((completedLessonsInChapter / totalLessonsInChapter) * 100);

  const handleLessonClick = (lessonId: string, isLocked: boolean) => {
    if (isLocked) {
      setLockedModalOpen(true);
    } else {
      setOpenLessonId(lessonId);
    }
  };

  // Drag-to-scroll Handlers
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault(); // Prevent default text selection
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 pt-safe px-6 pb-24 max-w-md mx-auto relative">
      {/* A. Header */}
      <h1 className="text-3xl font-serif text-amber-500 mb-8 mt-8">
        Catechism Basic Teachings of Faith
      </h1>

      {/* B. Chapter Selection (Carousel) */}
      <div 
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`-mx-6 px-6 mb-8 overflow-x-auto flex space-x-4 touch-pan-x select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {chapters.map((chap, index) => {
          const unlocked = isChapterUnlocked(index);
          const isSelected = selectedChapId === chap.id;

          return (
            <button
              key={chap.id}
              onClick={() => setSelectedChapId(chap.id)}
              className={`flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all min-h-[44px] ${
                isSelected
                  ? "bg-gray-800 border-amber-500"
                  : unlocked
                  ? "bg-gray-800 border-transparent hover:border-gray-700"
                  : "bg-gray-800/50 border-transparent opacity-50"
              }`}
            >
              {!unlocked && <Lock size={16} className="text-gray-500" />}
              <span className={`font-medium ${isSelected ? "text-white" : "text-gray-300"}`}>
                Chapter {index + 1}: {chap.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* C. Progress Bar */}
      <div className="mb-10 bg-gray-800 rounded-2xl p-5 border border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-300 font-medium text-sm tracking-wide">
            {completedLessonsInChapter}/{totalLessonsInChapter} Lessons
          </span>
          <BadgeCheck className="text-amber-500" size={24} />
        </div>
        <div className="h-2.5 w-full bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* D. Vertical Lesson Timeline */}
      <div className="relative pl-4">
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-700" />

        <div className="space-y-6">
          {selectedChapter.lessons.map((lesson) => {
            const isCompleted = activeProfile.completedLessons.includes(lesson.id);
            const isCurrent = !isCompleted && lesson.unlockDay <= activeProfile.currentDay;
            const isLocked = !isCompleted && !isCurrent;

            return (
              <div key={lesson.id} className="relative flex items-center gap-6">
                <div className="relative z-10 flex items-center justify-center bg-gray-900 py-2">
                  {isCompleted ? (
                    <CheckCircle className="text-amber-500 fill-amber-500/20" size={20} />
                  ) : isCurrent ? (
                    <Circle className="text-amber-500" size={20} />
                  ) : (
                    <Circle className="text-gray-600" size={20} />
                  )}
                </div>

                <button 
                  onClick={() => handleLessonClick(lesson.id, isLocked)}
                  className={`flex-1 text-left rounded-2xl p-4 border transition-all active:scale-[0.98] ${
                    isLocked 
                      ? "bg-gray-800/50 border-transparent opacity-50" 
                      : isCurrent
                      ? "bg-gray-800 border-amber-500/30 shadow-lg shadow-black/20"
                      : "bg-gray-800 border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <BookOpen size={14} className={isCurrent ? "text-amber-500" : "text-gray-400"} />
                    <span className={`text-xs font-semibold uppercase tracking-wider ${
                      isCurrent ? "text-amber-500" : "text-gray-400"
                    }`}>
                      Lesson {lesson.unlockDay}
                    </span>
                  </div>
                  <h3 className={`font-medium ${isLocked ? "text-gray-400" : "text-white"}`}>
                    {lesson.title}
                  </h3>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <CurriculumDrawer 
        lessonId={openLessonId} 
        isOpen={openLessonId !== null} 
        onClose={() => setOpenLessonId(null)} 
      />

      {lockedModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-3xl p-6 w-full max-w-sm border border-gray-700 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="text-amber-500" size={24} />
              <h2 className="text-xl font-semibold text-amber-500">Locked</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-8">
              Keep completing lessons to unlock this part of the journey.
            </p>
            <button
              onClick={() => setLockedModalOpen(false)}
              className="w-full bg-amber-500 text-gray-900 font-semibold py-3.5 rounded-xl min-h-[44px] active:scale-95 transition-transform"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
