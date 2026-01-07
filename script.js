let notes = JSON.parse(localStorage.getItem("notes")) || [];
let editIndex = -1;

const noteInput = document.getElementById("noteInput");
const addBtn = document.getElementById("addBtn");
const notesContainer = document.getElementById("notesContainer");
const message = document.getElementById("message");

function renderNotes() {
  notesContainer.innerHTML = "";

  notes.forEach((note, index) => {
    const card = document.createElement("div");
    card.className =
      "note-card bg-white/20 backdrop-blur-lg border border-white/40 rounded-2xl p-4 text-white shadow";

    card.innerHTML = `
      <p class="mb-3 whitespace-pre-wrap">${note}</p>
      <div class="flex justify-between">
        <button class="px-3 py-1 rounded-lg bg-blue-400 text-gray-900 font-semibold hover:bg-blue-300"
          onclick="editNote(${index})">Edit</button>

        <button class="px-3 py-1 rounded-lg bg-red-400 text-gray-900 font-semibold hover:bg-red-300"
          onclick="deleteNote(${index})">Delete</button>
      </div>
    `;
    notesContainer.appendChild(card);
  });

  localStorage.setItem("notes", JSON.stringify(notes));
}

addBtn.addEventListener("click", () => {
  const text = noteInput.value.trim();

  if (!text) return showMessage("⚠️ Note cannot be empty", true);

  if (editIndex === -1) {
    notes.push(text);
    showMessage("✅ Note added");
  } else {
    notes[editIndex] = text;
    editIndex = -1;
    addBtn.textContent = "Add Note";
    showMessage("✏️ Note updated");
  }

  noteInput.value = "";
  renderNotes();
});

function editNote(index) {
  noteInput.value = notes[index];
  addBtn.textContent = "Update Note";
  editIndex = index;
}

function deleteNote(index) {
  notes.splice(index, 1);
  renderNotes();
  showMessage("🗑️ Note deleted");
}

function showMessage(text, error = false) {
  message.classList.remove("hidden");
  message.textContent = text;
  message.style.color = error ? "#ffb4b4" : "#c7ffb8";
  setTimeout(() => (message.classList.add("hidden")), 1500);
}

renderNotes();
