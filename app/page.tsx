"use client";

import { useState } from "react";
import Link from "next/link";
import { useHeritage, getDailyProverbLink } from "@/context/HeritageContext";
import CurriculumDrawer from "@/components/CurriculumDrawer";
import ProfileSwitcher from "@/components/ProfileSwitcher";
import { Book, Music, Heart, PlayCircle, X } from "lucide-react";
import curriculumData from "@/data/curriculum.json";
import { Curriculum } from "@/types";

const curriculum = curriculumData.curriculum as unknown as Curriculum;

export default function DashboardPage() {
  const { isHydrated, activeProfile, getLast7DaysProgress } = useHeritage();
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<"hymns" | "blessing" | null>(null);

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </main>
    );
  }

  const progress = getLast7DaysProgress();
  
  // Find current module and lesson based on active profile's currentDay
  let currentChapterTitle = "Foundations of Faith & God";
  let nextLesson = curriculum["chapter_1"]?.lessons[0] || curriculum["module_1"]?.lessons[0];
  let currentChapterId = "chapter_1";

  for (const [chapId, chapter] of Object.entries(curriculum)) {
    const lesson = chapter.lessons.find((l) => l.unlockDay === activeProfile.currentDay);
    if (lesson) {
      currentChapterTitle = chapter.title;
      nextLesson = lesson;
      currentChapterId = chapId;
      break;
    }
  }

  // If beyond all lessons, show the last one
  if (!nextLesson) {
    const chaps = Object.values(curriculum);
    const lastChap = chaps[chaps.length - 1];
    nextLesson = lastChap.lessons[lastChap.lessons.length - 1];
    currentChapterTitle = lastChap.title;
  }

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-6 pt-safe pb-safe max-w-md mx-auto">
      <div className="flex justify-between items-center mb-8 mt-4">
        <ProfileSwitcher />
      </div>
      
      {/* Section 1: Weekly Progress */}
      <section className="mb-10">
        <h2 className="text-sm font-medium text-gray-400 text-center mb-4 uppercase tracking-widest">
          7-Day Streak
        </h2>
        <div className="flex justify-center gap-3">
          {progress.map((isCompleted, i) => (
            <div
              key={i}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                isCompleted
                  ? "bg-amber-500/10 border-amber-500"
                  : "bg-transparent border-gray-700"
              }`}
            >
              {isCompleted && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Quick Actions */}
      <section className="mb-10">
        <div className="grid grid-cols-3 gap-4">
          <a
            href={getDailyProverbLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 flex flex-col items-center justify-center p-4 rounded-2xl aspect-square active:scale-95 transition-transform min-h-[44px] min-w-[44px]"
          >
            <Book className="text-amber-500 mb-2" size={28} />
            <span className="text-xs font-medium tracking-wide text-gray-300">Proverb</span>
          </a>
          <button
            onClick={() => setOpenModal("hymns")}
            className="bg-gray-800 flex flex-col items-center justify-center p-4 rounded-2xl aspect-square active:scale-95 transition-transform min-h-[44px] min-w-[44px]"
          >
            <Music className="text-amber-500 mb-2" size={28} />
            <span className="text-xs font-medium tracking-wide text-gray-300">Hymns</span>
          </button>
          <button
            onClick={() => setOpenModal("blessing")}
            className="bg-gray-800 flex flex-col items-center justify-center p-4 rounded-2xl aspect-square active:scale-95 transition-transform min-h-[44px] min-w-[44px]"
          >
            <Heart className="text-amber-500 mb-2" size={28} />
            <span className="text-xs font-medium tracking-wide text-gray-300">Blessing</span>
          </button>
        </div>
      </section>

      {/* Section 3: Your Program */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl font-medium text-white tracking-wide">
            Your Program
          </h2>
          <Link href="/learning" className="text-amber-500 font-medium text-sm flex items-center justify-center min-h-[44px] min-w-[44px]">
            See path
          </Link>
        </div>
        <div
          onClick={() => setOpenLessonId(nextLesson.id)}
          className="relative bg-gray-800 rounded-3xl overflow-hidden aspect-[4/3] active:scale-[0.98] transition-transform cursor-pointer shadow-lg shadow-black/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <span className="text-amber-500 text-sm font-medium mb-2 uppercase tracking-wider">
              {currentChapterTitle}
            </span>
            <h3 className="text-2xl font-medium text-white mb-6">
              Day {nextLesson.unlockDay}: {nextLesson.title}
            </h3>
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-sm border border-white/10">
              <PlayCircle className="text-amber-500 fill-amber-500/20" size={36} />
            </div>
            <p className="mt-4 text-sm text-gray-400 font-medium">Begin Lesson</p>
          </div>
        </div>
      </section>

      {/* Modals for Quick Actions */}
      {openModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col justify-end">
          <div className="bg-gray-900 rounded-t-3xl w-full max-h-[85vh] overflow-y-auto p-6 relative pb-12 pt-safe">
            <button 
              onClick={() => setOpenModal(null)}
              className="absolute top-6 right-6 p-3 bg-white/5 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X size={20} className="text-gray-400" />
            </button>
            
            {openModal === "hymns" && (
              <div className="pt-8">
                <h2 className="text-2xl font-serif text-amber-500 mb-6">Evening Hymns</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Amazing Grace</h3>
                    <p className="text-gray-300 whitespace-pre-line leading-relaxed text-sm">
                      Amazing grace! How sweet the sound{"\n"}
                      That saved a wretch like me!{"\n"}
                      I once was lost, but now am found;{"\n"}
                      Was blind, but now I see.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Jesus Loves Me</h3>
                    <p className="text-gray-300 whitespace-pre-line leading-relaxed text-sm">
                      Jesus loves me! This I know,{"\n"}
                      For the Bible tells me so.{"\n"}
                      Little ones to Him belong;{"\n"}
                      They are weak, but He is strong.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {openModal === "blessing" && (
              <div className="pt-8">
                <h2 className="text-2xl font-serif text-amber-500 mb-6">The Blessing</h2>
                <div className="space-y-6">
                  <p className="text-gray-200 leading-relaxed italic text-center text-lg">
                    "The Lord bless you and keep you;{"\n"}
                    the Lord make his face shine on you{"\n"}
                    and be gracious to you;{"\n"}
                    the Lord turn his face toward you{"\n"}
                    and give you peace."
                  </p>
                  <p className="text-gray-500 text-sm text-center">Numbers 6:24-26</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {openLessonId && (
        <CurriculumDrawer 
          lessonId={openLessonId} 
          isOpen={true} 
          onClose={() => setOpenLessonId(null)} 
        />
      )}
    </main>
  );
}
