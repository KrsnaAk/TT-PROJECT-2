
import React, { useState } from 'react';

interface NoteFormProps {
  onAdd: (content: string) => void;
}

/**
 * NoteForm Component
 * A polished interface for creating new notes with validation.
 */
const NoteForm: React.FC<NoteFormProps> = ({ onAdd }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 5. Error Handling: Check if input is empty
    if (content.trim() === '') {
      alert('Error: You cannot save an empty note!');
      return;
    }

    onAdd(content);
    setContent('');
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200"
    >
      <div className="flex items-center gap-2 mb-6 text-indigo-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <h2 className="text-xl font-bold text-slate-800">New Entry</h2>
      </div>

      <div className="relative">
        <textarea
          placeholder="Capture your thoughts..."
          className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all duration-300 resize-none mb-6 min-h-[160px] text-slate-700 leading-relaxed"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="group relative w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform active:scale-95 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
      >
        <span>Add Note</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </form>
  );
};

export default NoteForm;
