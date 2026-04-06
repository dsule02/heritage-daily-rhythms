"use client";

import { useHeritage } from "@/context/HeritageContext";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";

export default function ProfileSwitcher() {
  const { state, setActiveChild } = useHeritage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeChild = state.children.find((c) => c.id === state.activeChildId) || state.children[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!activeChild) return null;

  return (
    <div className="relative mb-6 z-10" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-bedtime-surface px-4 py-2 rounded-full border border-bedtime-muted/20 text-bedtime-text font-medium active:scale-95 transition-transform"
      >
        <div className="w-6 h-6 rounded-full bg-bedtime-gold/20 flex items-center justify-center text-bedtime-gold text-sm">
          {activeChild.name.charAt(0)}
        </div>
        <span>{activeChild.name}</span>
        <ChevronDown size={16} className={clsx("text-bedtime-muted transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-bedtime-surface border border-bedtime-muted/20 rounded-xl shadow-lg overflow-hidden py-1">
          {state.children.map((child) => (
            <button
              key={child.id}
              onClick={() => {
                setActiveChild(child.id);
                setIsOpen(false);
              }}
              className={clsx(
                "w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-bedtime-muted/10 transition-colors",
                child.id === activeChild.id ? "text-bedtime-gold" : "text-bedtime-text"
              )}
            >
              <div className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                child.id === activeChild.id ? "bg-bedtime-gold/20 text-bedtime-gold" : "bg-bedtime-muted/10 text-bedtime-muted"
              )}>
                {child.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{child.name}</span>
                <span className="text-xs text-bedtime-muted">{child.age === 0 ? "Infant" : `Age ${child.age}`}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
