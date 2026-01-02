// Notes Management Logic - Vanilla JavaScript
// Strictly follows project specifications

// State
let notes = JSON.parse(localStorage.getItem('my_college_notes')) || [];
let currentEditingId = null;

// DOM Elements
const noteTextarea = document.getElementById('noteTextarea') as HTMLTextAreaElement;
const addBtn = document.getElementById('addBtn');
const notesList = document.getElementById('notesList');
const errorMsg = document.getElementById('errorMsg');
const noteCount = document.getElementById('noteCount');

// Modal Elements
const editModal = document.getElementById('editModal');
const editArea = document.getElementById('editArea') as HTMLTextAreaElement;
const cancelEditBtn = document.getElementById('cancelEdit');
const saveEditBtn = document.getElementById('saveEdit');

/**
 * Initialize the application
 */
function init() {
    renderNotes();
    
    addBtn?.addEventListener('click', addNote);
    cancelEditBtn?.addEventListener('click', closeEditModal);
    saveEditBtn?.addEventListener('click', saveEditedNote);

    // Auto-focus textarea on load
    noteTextarea?.focus();
}

/**
 * Add a new note
 */
function addNote() {
    const content = noteTextarea.value.trim();

    // 5. Error Handling: Warning for empty input
    if (!content) {
        errorMsg?.classList.remove('hidden');
        noteTextarea.classList.add('border-red-500');
        return;
    }

    errorMsg?.classList.add('hidden');
    noteTextarea.classList.remove('border-red-500');

    const newNote = {
        id: Date.now().toString(),
        content: content,
        date: new Date().toLocaleDateString()
    };

    notes.unshift(newNote);
    updateStorage();
    noteTextarea.value = '';
    renderNotes();
}

/**
 * Render all notes into the UI
 */
function renderNotes() {
    if (!notesList) return;
    notesList.innerHTML = '';
    noteCount!.textContent = `${notes.length} Note${notes.length === 1 ? '' : 's'}`;

    if (notes.length === 0) {
        notesList.innerHTML = `
            <div class="col-span-full py-12 text-center text-gray-400 bg-white rounded-xl border-2 border-dashed border-gray-200">
                <p>No notes found. Start by adding one above!</p>
            </div>
        `;
        return;
    }

    notes.forEach(note => {
        const card = document.createElement('div');
        card.className = 'bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow';
        card.innerHTML = `
            <div>
                <p class="text-gray-700 whitespace-pre-wrap mb-4 break-words">${escapeHtml(note.content)}</p>
            </div>
            <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <span class="text-xs text-gray-400">${note.date}</span>
                <div class="flex gap-2">
                    <button onclick="window.editNote('${note.id}')" class="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-sm font-semibold transition-colors">Edit</button>
                    <button onclick="window.deleteNote('${note.id}')" class="text-red-600 hover:bg-red-50 px-3 py-1 rounded text-sm font-semibold transition-colors">Delete</button>
                </div>
            </div>
        `;
        notesList.appendChild(card);
    });
}

/**
 * Update LocalStorage
 */
function updateStorage() {
    localStorage.setItem('my_college_notes', JSON.stringify(notes));
}

/**
 * Delete Functionality
 */
(window as any).deleteNote = function(id) {
    if (confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(n => n.id !== id);
        updateStorage();
        renderNotes();
    }
};

/**
 * Edit Functionality
 */
(window as any).editNote = function(id) {
    const note = notes.find(n => n.id === id);
    if (note) {
        currentEditingId = id;
        editArea.value = note.content;
        editModal?.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    }
};

function closeEditModal() {
    editModal?.classList.add('hidden');
    document.body.style.overflow = 'auto';
    currentEditingId = null;
}

function saveEditedNote() {
    const newContent = editArea.value.trim();
    if (!newContent) {
        alert('Note cannot be empty!');
        return;
    }

    notes = notes.map(n => n.id === currentEditingId ? { ...n, content: newContent } : n);
    updateStorage();
    closeEditModal();
    renderNotes();
}

/**
 * Utility to escape HTML and prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Start app
init();