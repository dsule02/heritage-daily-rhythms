export type AgeCategory = "child" | "toddler";

export interface Profile {
  name: string;
  ageCategory: AgeCategory;
  currentDay: number;
  completedLessons: string[];
  streak: number;
  lastCompletionDate?: string;
}

export interface SundayNote {
  id: string;
  date: string;
  topic: string;
  translation: string;
}

export interface AppState {
  profiles: Record<string, Profile>;
  activeProfileId: string;
  sundayNotes: SundayNote[];
}

export interface Lesson {
  id: string;
  unlockDay: number;
  title: string;
  coreTruths: string[];
  ageCallout: {
    basics: string;
  };
}

export interface Chapter {
  title: string;
  lessons: Lesson[];
}

export interface Curriculum {
  [chapterId: string]: Chapter;
}
