"use client";

import { useHeritage } from "@/context/HeritageContext";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";

export default function ProfileSwitcher() {
  const { state, activeProfile, setActiveProfile } = useHeritage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!activeProfile) return null;

  const profileIds = Object.keys(state.profiles);

  return (
    <div className="relative z-10" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#1e1e1e] px-4 py-2 rounded-full border border-bedtime-muted/20 text-bedtime-text font-medium active:scale-95 transition-transform"
      >
        <div className="w-6 h-6 rounded-full bg-bedtime-gold/20 flex items-center justify-center text-bedtime-gold text-sm">
          {activeProfile.name.charAt(0)}
        </div>
        <span>{activeProfile.name}</span>
        <ChevronDown size={16} className={clsx("text-bedtime-muted transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-[#1e1e1e] border border-bedtime-muted/20 rounded-xl shadow-lg overflow-hidden py-1">
          {profileIds.map((pid) => {
            const profile = state.profiles[pid];
            return (
              <button
                key={pid}
                onClick={() => {
                  setActiveProfile(pid);
                  setIsOpen(false);
                }}
                className={clsx(
                  "w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-bedtime-muted/10 transition-colors",
                  pid === state.activeProfileId ? "text-bedtime-gold" : "text-bedtime-text"
                )}
              >
                <div className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                  pid === state.activeProfileId ? "bg-bedtime-gold/20 text-bedtime-gold" : "bg-bedtime-muted/10 text-bedtime-muted"
                )}>
                  {profile.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{profile.name}</span>
                  <span className="text-xs text-bedtime-muted capitalize">{profile.ageCategory}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
