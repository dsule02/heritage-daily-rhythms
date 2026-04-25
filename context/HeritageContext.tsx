"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AppState, Profile } from "@/types";

interface HeritageContextType {
  state: AppState;
  isHydrated: boolean;
  activeProfile: Profile;
  setActiveProfile: (profileId: string) => void;
  completeLesson: (lessonId: string) => void;
  getLast7DaysProgress: () => boolean[];
}

export const getDailyProverbLink = () => {
  const day = new Date().getDate();
  return `https://www.bible.com/bible/111/PRO.${day}.NIV`;
};

const initialState: AppState = {
  profiles: {
    luka: {
      name: "Luka",
      ageCategory: "child",
      currentDay: 1,
      completedLessons: [],
      streak: 0,
    },
    mila: {
      name: "Mila",
      ageCategory: "toddler",
      currentDay: 1,
      completedLessons: [],
      streak: 0,
    },
  },
  activeProfileId: "luka",
};

const HeritageContext = createContext<HeritageContextType | undefined>(undefined);

export function HeritageProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("heritage_state_v2");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setState(parsed);
      } catch (e) {
        console.error("Failed to parse localStorage state", e);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("heritage_state_v2", JSON.stringify(state));
    }
  }, [state, isHydrated]);

  const getTodayDateString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const completeLesson = (lessonId: string) => {
    const today = getTodayDateString();
    
    setState((prev) => {
      const profile = prev.profiles[prev.activeProfileId];
      if (!profile) return prev;
      
      const isAlreadyCompletedToday = profile.lastCompletionDate === today;
      const isLessonAlreadyCompleted = profile.completedLessons.includes(lessonId);

      const newStreak = isAlreadyCompletedToday ? profile.streak : profile.streak + 1;

      return {
        ...prev,
        profiles: {
          ...prev.profiles,
          [prev.activeProfileId]: {
            ...profile,
            currentDay: profile.currentDay + 1,
            completedLessons: isLessonAlreadyCompleted ? profile.completedLessons : [...profile.completedLessons, lessonId],
            streak: newStreak,
            lastCompletionDate: today,
          },
        },
      };
    });
  };

  const getLast7DaysProgress = () => {
    // This is a simplified mock for the UI since we are just tracking lastCompletionDate right now.
    // In a real app we'd track history of completions. We'll just return some true/false array based on streak for demo.
    const activeProfile = state.profiles[state.activeProfileId];
    if (!activeProfile) return Array(7).fill(false);
    
    const progress = [];
    for (let i = 6; i >= 0; i--) {
      progress.push(i < activeProfile.streak);
    }
    return progress;
  };

  const setActiveProfile = (profileId: string) => {
    setState((prev) => ({ ...prev, activeProfileId: profileId }));
  };

  const activeProfile = state.profiles[state.activeProfileId];

  return (
    <HeritageContext.Provider value={{ 
      state, 
      isHydrated, 
      activeProfile, 
      setActiveProfile, 
      completeLesson, 
      getLast7DaysProgress 
    }}>
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
