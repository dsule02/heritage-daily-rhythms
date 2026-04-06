"use client";

import { Check, Info } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Ritual } from "@/types";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RitualItemProps {
  ritual: Ritual;
  isCompleted: boolean;
  onToggle: (id: string) => void;
  onOpenModule?: (moduleId: string) => void;
}

export default function RitualItem({ ritual, isCompleted, onToggle, onOpenModule }: RitualItemProps) {
  return (
    <div
      className="w-full flex items-center justify-between p-4 mb-3 rounded-xl bg-bedtime-surface border border-transparent"
    >
      {ritual.actionLink ? (
        <a
          href={ritual.actionLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "text-lg transition-colors flex-1 text-left",
            isCompleted ? "text-bedtime-muted line-through" : "text-bedtime-text underline decoration-bedtime-gold/50 underline-offset-4"
          )}
        >
          {ritual.title}
        </a>
      ) : ritual.moduleId && onOpenModule ? (
        <button
          onClick={() => onOpenModule(ritual.moduleId!)}
          className={cn(
            "text-lg transition-colors flex flex-1 items-center gap-2 text-left active:scale-[0.98]",
            isCompleted ? "text-bedtime-muted line-through" : "text-bedtime-text text-bedtime-gold"
          )}
        >
          {ritual.title}
          <Info size={18} className="text-bedtime-gold/70" />
        </button>
      ) : (
        <button
          onClick={() => onToggle(ritual.id)}
          className={cn(
            "text-lg transition-colors flex-1 text-left",
            isCompleted ? "text-bedtime-muted line-through" : "text-bedtime-text"
          )}
        >
          {ritual.title}
        </button>
      )}
      
      <button
        onClick={() => onToggle(ritual.id)}
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all min-w-[44px] min-h-[44px] ml-4 active:scale-[0.98]",
          isCompleted
            ? "bg-bedtime-gold border-bedtime-gold"
            : "border-bedtime-muted/50 bg-transparent active:border-bedtime-muted/80"
        )}
        aria-pressed={isCompleted}
        aria-label={`Mark ${ritual.title} as ${isCompleted ? 'incomplete' : 'complete'}`}
      >
        {isCompleted && <Check size={20} className="text-bedtime-dark" strokeWidth={3} />}
      </button>
    </div>
  );
}
