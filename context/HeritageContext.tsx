"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AppState, Ritual, Child, SundayNote } from "@/types";

interface HeritageContextType {
  state: AppState;
  isHydrated: boolean;
  toggleRitual: (ritualId: string) => void;
  getTodayCompletions: () => string[];
  calculateStreak: () => number;
  getLast7DaysProgress: () => boolean[];
  setActiveChild: (childId: string) => void;
  addSundayNote: (note: Omit<SundayNote, "id" | "date">) => void;
}

export const getDailyProverbLink = () => {
  const day = new Date().getDate();
  return `https://www.bible.com/bible/111/PRO.${day}.NIV`;
};

const defaultRituals: Ritual[] = [
  { id: "m1", title: "Morning Affirmation", timeOfDay: "morning" },
  { id: "m2", title: "Read a Proverb", timeOfDay: "morning", actionLink: getDailyProverbLink() },
  { id: "m3", title: "Pray for the day", timeOfDay: "morning" },
  { id: "e1", title: "Read Bible Storybook", timeOfDay: "evening" },
  { id: "e2", title: "Sing Amazing Grace", timeOfDay: "evening" },
  { id: "e3", title: "Sing Jesus Loves Me", timeOfDay: "evening" },
  { id: "e4", title: "The Blessing Prayer", timeOfDay: "evening" },
  { id: "e5", title: "Teach Faith Foundation", timeOfDay: "evening", moduleId: "module_1" },
];

const defaultChildren: Child[] = [
  { id: "c1", name: "Luka", age: 3 },
  { id: "c2", name: "Mila", age: 0 }, // Age 0 for Infant
];

const initialState: AppState = {
  children: defaultChildren,
  activeChildId: "c1",
  dailyRituals: defaultRituals,
  completions: {},
  sundayNotes: [],
};

const HeritageContext = createContext<HeritageContextType | undefined>(undefined);

export function HeritageProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Hydration: load from localStorage on mount
    const stored = localStorage.getItem("heritage_state");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Merge stored state with defaults to ensure we have rituals if missing
        setState({
          ...initialState,
          ...parsed,
          dailyRituals: parsed.dailyRituals?.length ? parsed.dailyRituals : defaultRituals,
        });
      } catch (e) {
        console.error("Failed to parse localStorage state", e);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Save to localStorage whenever state changes, but only after initial hydration
    if (isHydrated) {
      localStorage.setItem("heritage_state", JSON.stringify(state));
    }
  }, [state, isHydrated]);

  const getTodayDateString = () => {
    // Returns local date string in YYYY-MM-DD format
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const toggleRitual = (ritualId: string) => {
    const today = getTodayDateString();
    
    setState((prev: AppState) => {
      const todayCompletions = prev.completions[today] || [];
      const isCompleted = todayCompletions.includes(ritualId);
      
      const newCompletions = isCompleted
        ? todayCompletions.filter((id: string) => id !== ritualId)
        : [...todayCompletions, ritualId];
        
      return {
        ...prev,
        completions: {
          ...prev.completions,
          [today]: newCompletions,
        },
      };
    });
  };

  const getTodayCompletions = () => {
    const today = getTodayDateString();
    return state.completions[today] || [];
  };

  const getPastDateString = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const isDayCompleted = (dateStr: string) => {
    const eveningRitualIds = state.dailyRituals
      .filter((r) => r.timeOfDay === "evening")
      .map((r) => r.id);
    const dayCompletions = state.completions[dateStr] || [];
    return eveningRitualIds.some((id) => dayCompletions.includes(id));
  };

  const calculateStreak = () => {
    let currentStreak = 0;
    let daysAgo = 0;
    
    if (isDayCompleted(getPastDateString(0))) {
      currentStreak++;
      daysAgo = 1;
    } else {
      daysAgo = 1;
    }

    while (true) {
      if (isDayCompleted(getPastDateString(daysAgo))) {
        currentStreak++;
        daysAgo++;
      } else {
        break;
      }
    }
    
    return currentStreak;
  };

  const getLast7DaysProgress = () => {
    const progress = [];
    for (let i = 6; i >= 0; i--) {
      progress.push(isDayCompleted(getPastDateString(i)));
    }
    return progress;
  };

  const setActiveChild = (childId: string) => {
    setState((prev) => ({ ...prev, activeChildId: childId }));
  };

  const addSundayNote = (note: Omit<SundayNote, "id" | "date">) => {
    const newNote: SundayNote = {
      ...note,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      sundayNotes: [newNote, ...(prev.sundayNotes || [])],
    }));
  };

  return (
    <HeritageContext.Provider value={{ state, isHydrated, toggleRitual, getTodayCompletions, calculateStreak, getLast7DaysProgress, setActiveChild, addSundayNote }}>
      {children}
    </HeritageContext.Provider>
  );
}

export function useHeritage() {
  const context = useContext(HeritageContext);
  if (context === undefined) {
    throw new Error("useHeritage must be used within a HeritageProvider");
  }
  return context;
}
