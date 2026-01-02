
import React, { useState } from 'react';
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
}

/**
 * NoteCard Component
 * Displays note content with a modern "lift" animation and clear CRUD actions.
 */
const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(note.content);

  const handleUpdate = () => {
    if (editValue.trim() === '') {
      alert('Content cannot be empty.');
      return;
    }
    onUpdate(note.id, editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(note.content);
    setIsEditing(false);
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-slate-200 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Visual Accent */}
      <div className="h-1.5 w-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="p-6 flex flex-col h-full">
        {isEditing ? (
          <div className="flex flex-col h-full">
            <textarea
              className="flex-grow w-full p-3 bg-slate-50 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-4 text-slate-700 leading-relaxed font-medium"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              rows={4}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-5 py-2 rounded-lg text-sm font-bold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-grow">
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed break-words font-medium text-[15px]">
                {note.content}
              </p>
            </div>
            
            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-md text-sm font-bold transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => onDelete(note.id)}
                  className="flex items-center gap-1.5 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm font-bold transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
