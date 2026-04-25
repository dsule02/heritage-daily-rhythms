"use client";

import { useState } from "react";
import { useHeritage, getDailyProverbLink } from "@/context/HeritageContext";
import CurriculumDrawer from "@/components/CurriculumDrawer";
import { Book, Music, Heart, PlayCircle, X } from "lucide-react";

export default function DashboardPage() {
  const { state, isHydrated, getLast7DaysProgress } = useHeritage();
  const [openModuleId, setOpenModuleId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<"hymns" | "blessing" | null>(null);

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-[#121212] p-6 flex items-center justify-center">
        <div className="text-bedtime-muted">Loading...</div>
      </main>
    );
  }

  // Section A: Weekly Progress
  const progress = getLast7DaysProgress();
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 6);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  const weekDateRange = `${formatDate(weekStart)} - ${formatDate(today)}`;

  const currentModuleTitle = "Module 1: The Brave Doctor"; // Simplified for now, or could fetch from curriculum.json

  return (
    <main className="min-h-screen bg-[#121212] text-bedtime-text p-6 pt-12 pb-24 max-w-md mx-auto">
      
      {/* Section A: Weekly Progress */}
      <section className="mb-10">
        <h2 className="text-sm font-medium text-bedtime-muted text-center mb-4 uppercase tracking-widest">
          {weekDateRange}
        </h2>
        <div className="flex justify-center gap-3">
          {progress.map((isCompleted, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                isCompleted
                  ? "bg-bedtime-accentLight border-bedtime-accentLight"
                  : "bg-transparent border-bedtime-muted/30"
              }`}
            >
              {isCompleted && <div className="w-2 h-2 rounded-full bg-white/80" />}
            </div>
          ))}
        </div>
      </section>

      {/* Section B: Quick Actions */}
      <section className="mb-10">
        <div className="grid grid-cols-3 gap-4">
          <a
            href={getDailyProverbLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1e1e1e] flex flex-col items-center justify-center p-4 rounded-2xl aspect-square active:scale-95 transition-transform"
          >
            <Book className="text-bedtime-gold mb-2" size={28} />
            <span className="text-xs font-medium tracking-wide">Proverb</span>
          </a>
          <button
            onClick={() => setOpenModal("hymns")}
            className="bg-[#1e1e1e] flex flex-col items-center justify-center p-4 rounded-2xl aspect-square active:scale-95 transition-transform"
          >
            <Music className="text-bedtime-amber mb-2" size={28} />
            <span className="text-xs font-medium tracking-wide">Hymns</span>
          </button>
          <button
            onClick={() => setOpenModal("blessing")}
            className="bg-[#1e1e1e] flex flex-col items-center justify-center p-4 rounded-2xl aspect-square active:scale-95 transition-transform"
          >
            <Heart className="text-[#e07a5f] mb-2" size={28} />
            <span className="text-xs font-medium tracking-wide">Blessing</span>
          </button>
        </div>
      </section>

      {/* Section C: Your Program */}
      <section>
        <h2 className="font-serif text-2xl font-medium text-white mb-4 tracking-wide">
          Your program
        </h2>
        <div
          onClick={() => setOpenModuleId("module_1")}
          className="relative bg-[#1e1e1e] rounded-3xl overflow-hidden aspect-[4/3] active:scale-[0.98] transition-transform cursor-pointer shadow-lg shadow-black/20"
        >
          {/* Subtle background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-bedtime-accentLight/20 to-transparent pointer-events-none" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-xl font-medium text-white mb-6">
              {currentModuleTitle}
            </h3>
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <PlayCircle className="text-white fill-white/20" size={36} />
            </div>
            <p className="mt-4 text-sm text-bedtime-muted">Start Lesson</p>
          </div>
        </div>
      </section>

      {/* Modals for Quick Actions */}
      {openModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col justify-end">
          <div className="bg-[#1e1e1e] rounded-t-3xl w-full max-h-[85vh] overflow-y-auto p-6 relative pb-12">
            <button 
              onClick={() => setOpenModal(null)}
              className="absolute top-6 right-6 p-2 bg-white/5 rounded-full"
            >
              <X size={20} className="text-bedtime-muted" />
            </button>
            
            {openModal === "hymns" && (
              <div>
                <h2 className="text-2xl font-serif text-bedtime-gold mb-6">Evening Hymns</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Amazing Grace</h3>
                    <p className="text-bedtime-text/80 whitespace-pre-line leading-relaxed text-sm">
                      Amazing grace! How sweet the sound{"\n"}
                      That saved a wretch like me!{"\n"}
                      I once was lost, but now am found;{"\n"}
                      Was blind, but now I see.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Jesus Loves Me</h3>
                    <p className="text-bedtime-text/80 whitespace-pre-line leading-relaxed text-sm">
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
              <div>
                <h2 className="text-2xl font-serif text-[#e07a5f] mb-6">The Blessing</h2>
                <div className="space-y-6">
                  <p className="text-bedtime-text/90 leading-relaxed italic text-center text-lg">
                    "The Lord bless you and keep you;{"\n"}
                    the Lord make his face shine on you{"\n"}
                    and be gracious to you;{"\n"}
                    the Lord turn his face toward you{"\n"}
                    and give you peace."
                  </p>
                  <p className="text-bedtime-muted text-sm text-center">Numbers 6:24-26</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <CurriculumDrawer 
        moduleId={openModuleId} 
        isOpen={openModuleId !== null} 
        onClose={() => setOpenModuleId(null)} 
      />
    </main>
  );
}
