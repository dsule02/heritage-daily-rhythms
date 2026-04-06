"use client";

import { useHeritage } from "@/context/HeritageContext";
import { Flame } from "lucide-react";
import { clsx } from "clsx";

export default function ProgressWidget() {
  const { calculateStreak, getLast7DaysProgress, isHydrated } = useHeritage();

  if (!isHydrated) return null;

  const streak = calculateStreak();
  const progress = getLast7DaysProgress();

  return (
    <div className="bg-bedtime-surface p-5 rounded-2xl mb-8 flex flex-col gap-4 shadow-sm border border-transparent">
      <div className="flex items-center justify-between">
        <h3 className="text-bedtime-text font-medium text-lg">Your Progress</h3>
        <div className="flex items-center gap-1.5 text-bedtime-gold font-bold bg-bedtime-gold/10 px-3 py-1.5 rounded-full">
          <Flame size={18} className="fill-bedtime-gold text-bedtime-gold" />
          <span>{streak} Day Streak</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center px-1 mt-2">
        {progress.map((isCompleted, i) => (
          <div 
            key={i} 
            className={clsx(
              "w-8 h-8 rounded-full border-2 transition-colors",
              isCompleted 
                ? "bg-bedtime-gold border-bedtime-gold" 
                : "border-bedtime-muted/30 bg-transparent"
            )}
            aria-label={isCompleted ? "Day completed" : "Day missed"}
          />
        ))}
      </div>
    </div>
  );
}
