"use client";

import { useState } from "react";
import { useHeritage } from "@/context/HeritageContext";
import RitualItem from "@/components/RitualItem";
import ProgressWidget from "@/components/ProgressWidget";
import ProfileSwitcher from "@/components/ProfileSwitcher";
import CurriculumDrawer from "@/components/CurriculumDrawer";

export default function DashboardPage() {
  const { state, isHydrated, toggleRitual, getTodayCompletions } = useHeritage();
  const [openModuleId, setOpenModuleId] = useState<string | null>(null);

  if (!isHydrated) {
    return (
      <main className="min-h-screen p-6 pt-12 flex items-center justify-center">
        <div className="text-bedtime-muted">Loading...</div>
      </main>
    );
  }

  const todayCompletions = getTodayCompletions();
  
  const morningRituals = state.dailyRituals.filter((r) => r.timeOfDay === "morning");
  const eveningRituals = state.dailyRituals.filter((r) => r.timeOfDay === "evening");

  const handleOpenModule = (moduleId: string) => {
    setOpenModuleId(moduleId);
  };

  const renderSection = (title: string, rituals: typeof state.dailyRituals) => {
    if (rituals.length === 0) return null;
    
    return (
      <section className="mb-8">
        <h2 className="text-bedtime-gold font-semibold text-xl mb-4 tracking-wide">
          {title}
        </h2>
        <div className="flex flex-col gap-2">
          {rituals.map((ritual) => (
            <RitualItem
              key={ritual.id}
              ritual={ritual}
              isCompleted={todayCompletions.includes(ritual.id)}
              onToggle={toggleRitual}
              onOpenModule={handleOpenModule}
            />
          ))}
        </div>
      </section>
    );
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  const currentDayOfWeek = new Date().getDay(); // 0 is Sunday, 1 is Monday, 2 is Tuesday
  const showSundayReflection = (currentDayOfWeek === 1 || currentDayOfWeek === 2) && state.sundayNotes.length > 0;
  const latestSundayNote = state.sundayNotes[0];

  return (
    <main className="min-h-screen p-6 pt-12 pb-24 max-w-md mx-auto">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-bedtime-text mb-2">Today</h1>
          <p className="text-bedtime-muted">{today}</p>
        </div>
      </header>

      <ProfileSwitcher />
      <ProgressWidget />

      {showSundayReflection && (
        <div className="bg-bedtime-gold/10 border border-bedtime-gold/20 p-5 rounded-2xl mb-8">
          <h3 className="text-bedtime-gold font-semibold text-sm tracking-wider uppercase mb-2">Sunday Reflection</h3>
          <p className="text-bedtime-text/90 leading-relaxed text-sm">
            {latestSundayNote.translation}
          </p>
        </div>
      )}

      {renderSection("Morning Rhythms", morningRituals)}
      {renderSection("Evening Rhythms", eveningRituals)}

      <CurriculumDrawer 
        moduleId={openModuleId} 
        isOpen={openModuleId !== null} 
        onClose={() => setOpenModuleId(null)} 
      />
    </main>
  );
}
