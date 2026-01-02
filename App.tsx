
import React, { useState, useEffect, useCallback } from 'react';
import { Note } from './types';
import NoteForm from './components/NoteForm';
import NoteCard from './components/NoteCard';

/**
 * Main Application Component
 * Manages global state and provides a modern, responsive layout.
 */
const App: React.FC = () => {
  // 1. Storage: Initialize state from LocalStorage
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes_app_data');
    return saved ? JSON.parse(saved) : [];
  });

  // 1. Storage: Persist notes to LocalStorage
  useEffect(() => {
    localStorage.setItem('notes_app_data', JSON.stringify(notes));
  }, [notes]);

  /**
   * 1. Create Note Functionality
   */
  const handleAddNote = useCallback((content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      content,
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
  }, []);

  /**
   * 3. Delete Note Functionality
   */
  const handleDeleteNote = useCallback((id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  }, []);

  /**
   * 4. Edit Note Functionality
   */
  const handleUpdateNote = useCallback((id: string, updatedContent: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, content: updatedContent } : note
      )
    );
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-16">
        {/* Header Section */}
        <header className="mb-12 text-center md:text-left border-b border-slate-200 pb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-3">
            Minor Project by AKSHAT
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Notes<span className="text-indigo-600">Master</span>
          </h1>
          <p className="mt-3 text-slate-500 text-lg max-w-2xl">
            A minimalist workspace to capture, refine, and manage your daily notes efficiently.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Note Creation Form (Sticky for better UX) */}
          <section className="lg:col-span-4 lg:sticky lg:top-8 order-2 lg:order-1">
            <NoteForm onAdd={handleAddNote} />
          </section>

          {/* Right Column: Notes Display */}
          <section className="lg:col-span-8 order-1 lg:order-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                Collections
                <span className="text-sm font-medium bg-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full">
                  {notes.length}
                </span>
              </h2>
            </div>

            {/* 2. Display Notes Logic */}
            {notes.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center border-2 border-dashed border-slate-200 flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Your collection is empty</h3>
                <p className="text-slate-400 max-w-xs mx-auto">Use the panel to the left to create your first note and get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onDelete={handleDeleteNote}
                    onUpdate={handleUpdateNote}
                  />
                ))}
              </div>
            )}
          </section>
        </main>

        <footer className="mt-20 pt-8 border-t border-slate-200 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
          <p>Built with HTML, Tailwind CSS, and JavaScript</p>
          <p className="font-medium">&copy; {new Date().getFullYear()} NoteMaster Pro</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
