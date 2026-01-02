// Notes Management Web Application - Vanilla JavaScript
// Strictly adhering to project specifications: No Frameworks, LocalStorage Persistence.

/**
 * Type Definitions
 */
interface Note {
    id: string;
    content: string;
}

/**
 * State Management
 */
// Explicitly typed to resolve VS Code errors
let notes: Note[] = JSON.parse(localStorage.getItem('college_project_notes') || '[]');
let editingId: string | null = null;

/**
 * DOM Elements
 */
const noteInput = document.getElementById('noteInput') as HTMLTextAreaElement;
const addNoteBtn = document.getElementById('addNoteBtn');
const notesContainer = document.getElementById('notesContainer');
const warningMsg = document.getElementById('warningMsg');
const noteStats = document.getElementById('noteStats');

/**
 * Core Logic Functions
 */

const saveToStorage = () => {
    localStorage.setItem('college_project_notes', JSON.stringify(notes));
};

const updateStats = () => {
    if (noteStats) {
        noteStats.textContent = `${notes.length} Note${notes.length === 1 ? '' : 's'}`;
    }
};

const renderNotes = () => {
    if (!notesContainer) return;
    notesContainer.innerHTML = '';

    if (notes.length === 0) {
        notesContainer.innerHTML = `
            <div class="col-span-full py-20 text-center bg-white border-2 border-dashed border-slate-200 rounded-2xl">
                <p class="text-slate-400 font-medium">No notes available. Start adding some!</p>
            </div>
        `;
        updateStats();
        return;
    }

    notes.forEach((note: Note) => {
        const isEditing = editingId === note.id;
        
        const card = document.createElement('div');
        card.className = 'note-card bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[160px]';
        
        if (isEditing) {
            card.innerHTML = `
                <textarea 
                    id="edit-input-${note.id}" 
                    class="w-full p-3 bg-slate-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 flex-grow text-slate-700"
                >${note.content}</textarea>
                <div class="flex gap-2">
                    <button onclick="window.app.saveEdit('${note.id}')" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all">Save</button>
                    <button onclick="window.app.cancelEdit()" class="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold transition-all">Cancel</button>
                </div>
            `;
        } else {
            card.innerHTML = `
                <div class="flex-grow mb-4">
                    <p class="text-slate-700 whitespace-pre-wrap break-words leading-relaxed">${escapeHtml(note.content)}</p>
                </div>
                <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button onclick="window.app.startEdit('${note.id}')" class="text-blue-600 hover:text-blue-800 text-sm font-bold transition-colors">Edit</button>
                    <button onclick="window.app.deleteNote('${note.id}')" class="text-red-600 hover:text-red-800 text-sm font-bold transition-colors">Delete</button>
                </div>
            `;
        }
        notesContainer.appendChild(card);
    });

    updateStats();
};

const addNote = () => {
    const content = noteInput.value.trim();

    if (!content) {
        warningMsg?.classList.remove('hidden');
        noteInput.classList.add('border-red-300');
        return;
    }

    warningMsg?.classList.add('hidden');
    noteInput.classList.remove('border-red-300');

    const newNote: Note = {
        id: Date.now().toString(),
        content: content
    };

    notes.unshift(newNote);
    saveToStorage();
    noteInput.value = '';
    renderNotes();
};

const deleteNote = (id: string) => {
    notes = notes.filter((n: Note) => n.id !== id);
    saveToStorage();
    renderNotes();
};

const startEdit = (id: string) => {
    editingId = id;
    renderNotes();
};

const saveEdit = (id: string) => {
    const input = document.getElementById(`edit-input-${id}`) as HTMLTextAreaElement;
    if (input) {
        const newContent = input.value.trim();
        if (newContent) {
            notes = notes.map((n: Note) => 
                n.id === id ? { ...n, content: newContent } : n
            );
            editingId = null;
            saveToStorage();
            renderNotes();
        } else {
            alert('Note cannot be empty!');
        }
    }
};

const cancelEdit = () => {
    editingId = null;
    renderNotes();
};

/**
 * Security: Simple HTML Escaping
 */
function escapeHtml(text: string) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Expose functions to global scope for HTML onclick handlers
 */
(window as any).app = {
    deleteNote,
    startEdit,
    saveEdit,
    cancelEdit
};

/**
 * Initialize Event Listeners
 */
addNoteBtn?.addEventListener('click', addNote);

// Initial Render
renderNotes();