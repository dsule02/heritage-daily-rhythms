"use client";

import { useState } from "react";
import { useHeritage } from "@/context/HeritageContext";

export default function SundaysPage() {
  const { state, isHydrated, addSundayNote } = useHeritage();
  const [topic, setTopic] = useState("");
  const [translation, setTranslation] = useState("");

  if (!isHydrated) {
    return (
      <main className="min-h-screen p-6 pt-12 flex items-center justify-center">
        <div className="text-bedtime-muted">Loading...</div>
      </main>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !translation.trim()) return;
    
    addSundayNote({ topic, translation });
    setTopic("");
    setTranslation("");
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <main className="min-h-screen p-6 pt-12 pb-32 max-w-md mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-bedtime-text mb-2">The Sunday Bridge</h1>
        <p className="text-bedtime-muted">Translate Sunday's teaching into everyday family rhythms.</p>
      </header>

      <form onSubmit={handleSubmit} className="mb-12 bg-bedtime-surface p-5 rounded-2xl border border-bedtime-muted/20">
        <div className="mb-4">
          <label className="block text-bedtime-text font-medium mb-2 text-sm">
            What was the main theme at Emerge today?
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-bedtime-dark border border-bedtime-muted/30 rounded-xl p-3 text-bedtime-text focus:outline-none focus:border-bedtime-gold/50 min-h-[80px]"
            placeholder="e.g. Jesus healing the blind man..."
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-bedtime-text font-medium mb-2 text-sm">
            How do we explain this through the Great Physician/Grace framework?
          </label>
          <textarea
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            className="w-full bg-bedtime-dark border border-bedtime-muted/30 rounded-xl p-3 text-bedtime-text focus:outline-none focus:border-bedtime-gold/50 min-h-[100px]"
            placeholder="e.g. Just like a doctor fixes our eyes so we can see, Jesus heals our hearts..."
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-bedtime-gold text-bedtime-dark font-bold py-3.5 rounded-xl active:scale-[0.98] transition-transform"
        >
          Save Sunday Note
        </button>
      </form>

      <section>
        <h2 className="text-bedtime-gold font-semibold text-xl mb-4 tracking-wide">
          Archive
        </h2>
        {state.sundayNotes.length === 0 ? (
          <p className="text-bedtime-muted italic text-center py-8">No notes yet. Add your first reflection above.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {state.sundayNotes.map((note) => (
              <div key={note.id} className="bg-bedtime-surface p-5 rounded-2xl border border-transparent">
                <div className="text-bedtime-gold/70 text-xs font-semibold uppercase tracking-wider mb-2">
                  {formatDate(note.date)}
                </div>
                <h3 className="text-bedtime-text font-medium mb-3">{note.topic}</h3>
                <div className="w-8 h-1 bg-bedtime-muted/20 rounded-full mb-3" />
                <p className="text-bedtime-muted leading-relaxed text-sm">
                  {note.translation}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
