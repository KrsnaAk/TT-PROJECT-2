// --- State Management ---
let notes = JSON.parse(localStorage.getItem('notes_app_data')) || [];
let editingNoteId = null;

// --- DOM Elements ---
const noteInput = document.getElementById('noteInput') as HTMLTextAreaElement;
const addNoteBtn = document.getElementById('addNoteBtn');
const notesContainer = document.getElementById('notesContainer');
const noteCount = document.getElementById('noteCount');
const yearSpan = document.getElementById('year');

// Set current year
if (yearSpan) yearSpan.textContent = new Date().getFullYear().toString();

// --- Core Functions ---

/*
 * Save notes to LocalStorage
 */
function saveNotes() {
    localStorage.setItem('notes_app_data', JSON.stringify(notes));
    renderNotes();
}

/*
 * Add a new note
 */
function addNote() {
    const content = noteInput.value.trim();
    
    // 5. Error Handling: Prevent empty notes
    if (!content) {
        alert('Error: You cannot save an empty note!');
        return;
    }

    const newNote = {
        id: Date.now().toString(),
        content: content
    };

    notes.unshift(newNote);
    noteInput.value = '';
    saveNotes();
}

/*
 * Delete a note
 */
function deleteNote(id: string) {
    notes = notes.filter(n => n.id !== id);
    saveNotes();
}

/*
 * Start editing a note
 */
function startEdit(id: string) {
    editingNoteId = id;
    renderNotes();
}

/*
 * Update note content
 */
function updateNote(id: string, newContent: string) {
    if (!newContent.trim()) {
        alert('Content cannot be empty.');
        return;
    }
    
    notes = notes.map(n => n.id === id ? { ...n, content: newContent } : n);
    editingNoteId = null;
    saveNotes();
}

/*
 * Cancel editing
 */
function cancelEdit() {
    editingNoteId = null;
    renderNotes();
}

/*
 * Main Render Function
 * Rebuilds the notes list in the UI based on current state.
 */
function renderNotes() {
    if (!notesContainer || !noteCount) return;

    noteCount.textContent = notes.length.toString();

    if (notes.length === 0) {
        notesContainer.innerHTML = `
            <div class="col-span-full bg-white rounded-2xl p-16 text-center border-2 border-dashed border-slate-200 flex flex-col items-center">
                <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-slate-700 mb-2">Your collection is empty</h3>
                <p class="text-slate-400 max-w-xs mx-auto">Use the panel to the left to create your first note and get started.</p>
            </div>
        `;
        return;
    }

    notesContainer.innerHTML = '';

    notes.forEach(note => {
        const isEditing = editingNoteId === note.id;
        const card = document.createElement('div');
        card.className = "group bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-slate-200 transition-all duration-300 flex flex-col h-full overflow-hidden";
        
        if (isEditing) {
            card.innerHTML = `
                <div class="h-1.5 w-full bg-indigo-500"></div>
                <div class="p-6 flex flex-col h-full">
                    <textarea id="edit-area-${note.id}" class="flex-grow w-full p-3 bg-slate-50 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-4 text-slate-700 leading-relaxed font-medium" rows="4">${note.content}</textarea>
                    <div class="flex gap-2">
                        <button onclick="window.app.saveEdit('${note.id}')" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm">Save Changes</button>
                        <button onclick="window.app.cancelEdit()" class="bg-slate-200 hover:bg-slate-300 text-slate-700 px-5 py-2 rounded-lg text-sm font-bold transition-colors">Cancel</button>
                    </div>
                </div>
            `;
        } else {
            card.innerHTML = `
                <div class="h-1.5 w-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="p-6 flex flex-col h-full">
                    <div class="flex-grow">
                        <p class="text-slate-700 whitespace-pre-wrap leading-relaxed break-words font-medium text-[15px]">${escapeHtml(note.content)}</p>
                    </div>
                    <div class="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">
                        <div class="flex gap-3">
                            <button onclick="window.app.startEdit('${note.id}')" class="flex items-center gap-1.5 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-md text-sm font-bold transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                Edit
                            </button>
                            <button onclick="window.app.deleteNote('${note.id}')" class="flex items-center gap-1.5 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm font-bold transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
        notesContainer.appendChild(card);
    });
}

/*
 * Utility: Escape HTML to prevent XSS
 */
function escapeHtml(text: string) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// --- Global API for Inline Event Handlers ---
// Using window assignment to allow onclick handlers to work without a bundler mapping
(window as any).app = {
    deleteNote,
    startEdit,
    cancelEdit,
    saveEdit: (id: string) => {
        const area = document.getElementById(`edit-area-${id}`) as HTMLTextAreaElement;
        if (area) updateNote(id, area.value);
    }
};

// --- Event Listeners ---
addNoteBtn?.addEventListener('click', addNote);

// Allow Enter to add note (if not Shift+Enter)
noteInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addNote();
    }
});

// Initialize app
renderNotes();