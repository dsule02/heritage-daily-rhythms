"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import curriculumData from "@/data/curriculum.json";
import { clsx } from "clsx";

interface Module {
  id: string;
  title: string;
  theme: string;
  targetAge: string;
  talkingPoints: string[];
}

interface CurriculumDrawerProps {
  moduleId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CurriculumDrawer({ moduleId, isOpen, onClose }: CurriculumDrawerProps) {
  const [moduleData, setModuleData] = useState<Module | null>(null);

  useEffect(() => {
    if (moduleId) {
      const data = curriculumData.find((m) => m.id === moduleId);
      if (data) setModuleData(data as Module);
    }
  }, [moduleId]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-40 transition-opacity backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div 
        className={clsx(
          "fixed bottom-0 left-0 right-0 z-50 bg-bedtime-surface rounded-t-3xl border-t border-bedtime-muted/20 shadow-2xl transition-transform transform duration-300 ease-out max-h-[85vh] flex flex-col",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="flex justify-center p-3" onClick={onClose}>
          <div className="w-12 h-1.5 bg-bedtime-muted/30 rounded-full" />
        </div>
        
        {moduleData && (
          <div className="px-6 pb-12 overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-sm font-semibold text-bedtime-gold tracking-wider uppercase mb-1">
                  {moduleData.title}
                </h2>
                <h3 className="text-2xl font-bold text-bedtime-text">
                  {moduleData.theme}
                </h3>
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-bedtime-muted/10 rounded-full text-bedtime-muted hover:text-bedtime-text transition-colors"
                aria-label="Close drawer"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4 mt-8">
              <h4 className="font-medium text-bedtime-muted uppercase text-xs tracking-widest mb-4">
                Talking Points
              </h4>
              <ul className="space-y-4">
                {moduleData.talkingPoints.map((point, index) => (
                  <li key={index} className="flex gap-4 items-start">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-bedtime-gold/10 text-bedtime-gold text-sm font-medium shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-bedtime-text leading-relaxed">
                      {point}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-10 p-4 rounded-xl bg-bedtime-gold/5 border border-bedtime-gold/10">
              <p className="text-sm text-bedtime-muted text-center">
                Target Age: <span className="font-medium text-bedtime-gold">{moduleData.targetAge}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
