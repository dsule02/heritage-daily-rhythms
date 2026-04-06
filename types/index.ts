export interface Child {
  id: string;
  name: string;
  age: number;
}

export type TimeOfDay = 'morning' | 'evening';

export interface Ritual {
  id: string;
  title: string;
  timeOfDay: TimeOfDay;
  actionLink?: string;
  moduleId?: string;
}

export interface CompletionState {
  // Key is date string (YYYY-MM-DD), value is array of completed ritual IDs
  [date: string]: string[];
}

export interface SundayNote {
  id: string;
  date: string;
  topic: string;
  translation: string;
}

export interface AppState {
  children: Child[];
  activeChildId?: string;
  dailyRituals: Ritual[];
  completions: CompletionState;
  sundayNotes: SundayNote[];
}
