// ================== EXPORT ==================
async function exportSubjects() {
    const subjects = await getSubjects();

    // Sort subjects alphabetically by name
    subjects.sort((a, b) => a.name.localeCompare(b.name));

    const data = [];
    for (const subject of subjects) {
        const questions = await getQuestionsBySubject(subject.id);
        data.push({
            name: subject.name,
            questions: questions.map(q => ({
                questionText: q.questionText,
                answer: q.answer
            }))
        });
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });

    // Generate timestamped filename
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const hh = String(hours).padStart(2, "0");
    const filename = `quizcet_questions-${yyyy}-${mm}-${dd}_${hh}-${minutes}-${ampm}.json`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// ================== IMPORT ==================
async function importSubjects(file) {
    if (!file) return;
    const text = await file.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch (e) {
        return showCustomAlert("Invalid JSON file");
    }

    for (const s of data) {
        if (!s.name || !Array.isArray(s.questions)) continue;

        try {
            // Add subject only if it doesn't exist
            const existingSubjects = await getSubjects();
            let existing = existingSubjects.find(sub => sub.name.toLowerCase() === s.name.toLowerCase());
            let subjectId;
            if (existing) {
                subjectId = existing.id;
            } else {
                subjectId = await addSubject(s.name);
            }

            // Add questions
            for (const q of s.questions) {
                if (!q.questionText || !q.answer) continue;

                // Check if question already exists in this subject
                const existingQuestions = await getQuestionsBySubject(subjectId);
                const duplicate = existingQuestions.some(eq => eq.questionText === q.questionText);
                if (!duplicate) {
                    await addQuestion(subjectId, q.questionText, q.answer);
                }

                // Force remove any duplicates after import
                await removeDuplicateQuestions(subjectId);
            }

        } catch (e) {
            console.error("Error importing subject:", s.name, e);
        }
    }

    showCustomAlert("Import complete!");
    // Refresh UI
    if (document.getElementById("subjects-list")) await populateSubjects();
    if (document.getElementById("subject-select")) await populateSubjectSelect();
    if (document.getElementById("questions-list")) await populateQuestions();
}

async function clearAllData() {
    if (!confirm("Are you sure you want to delete ALL subjects and questions? This cannot be undone.")) return;

    const subjects = await getSubjects();
    for (const s of subjects) {
        await deleteSubject(s.id);
    }

    showCustomAlert("All subjects and questions have been deleted.");
    window.location.reload();
}

// ================== EXPORT (Text) ==================
async function exportSubjectsAsText() {
    const subjects = await getSubjects();

    // Sort subjects alphabetically by name
    subjects.sort((a, b) => a.name.localeCompare(b.name));

    const data = [];
    for (const subject of subjects) {
        const questions = await getQuestionsBySubject(subject.id);
        data.push({
            name: subject.name,
            questions: questions.map(q => ({
                questionText: q.questionText,
                answer: q.answer
            }))
        });
    }

    // Compact JSON text
    const jsonText = JSON.stringify(data); // no spaces or line breaks

    // Copy to clipboard
    try {
        await navigator.clipboard.writeText(jsonText);
        showCustomAlert("Subjects and questions copied to clipboard!");
    } catch (err) {
        console.error("Failed to copy:", err);
        showCustomAlert("Could not copy to clipboard. Here is the JSON:\n\n" + jsonText);
    }
}

// ================== IMPORT (Text) ==================
async function importSubjectsFromText() {
    const jsonText = prompt("Paste your JSON text here:");

    if (!jsonText) return showCustomAlert("No input provided.");

    let data;
    try {
        data = JSON.parse(jsonText);
    } catch (e) {
        return showCustomAlert("Invalid JSON. Please check your input.");
    }

    // Reuse the same import logic as file import
    for (const s of data) {
        if (!s.name || !Array.isArray(s.questions)) continue;

        try {
            const existingSubjects = await getSubjects();
            let existing = existingSubjects.find(sub => sub.name.toLowerCase() === s.name.toLowerCase());
            let subjectId;
            if (existing) {
                subjectId = existing.id;
            } else {
                subjectId = await addSubject(s.name);
            }

            for (const q of s.questions) {
                if (!q.questionText || !q.answer) continue;

                const existingQuestions = await getQuestionsBySubject(subjectId);
                const duplicate = existingQuestions.some(eq => eq.questionText === q.questionText);
                if (!duplicate) {
                    await addQuestion(subjectId, q.questionText, q.answer);
                }
            }
        } catch (e) {
            console.error("Error importing subject:", s.name, e);
        }
    }

    showCustomAlert("Import from text complete!");
    // Refresh UI
    if (document.getElementById("subjects-list")) await populateSubjects();
    if (document.getElementById("subject-select")) await populateSubjectSelect();
    if (document.getElementById("questions-list")) await populateQuestions();
}

// ================ MISC =============================
// Remove duplicate questions by questionText for a subject
async function removeDuplicateQuestions(subjectId) {
    const questions = await getQuestions(subjectId);
    const seen = new Set();

    for (const q of questions) {
        if (seen.has(q.questionText)) {
            await deleteQuestion(q.id); // delete duplicate
            console.log("Deleted duplicate question:", q.questionText);
        } else {
            seen.add(q.questionText);
        }
    }
}

// ================== EXPORT SELECTED ==================
async function exportSelectedSubjects() {
    const subjects = await getSubjects();
    if (subjects.length === 0) return showCustomAlert("No subjects available.");

    // Sort subjects alphabetically by name
    subjects.sort((a, b) => a.name.localeCompare(b.name));

    // Show modal for multi-selection
    const modalId = "export-select-subject-modal";
    let modal = document.getElementById(modalId);

    if (!modal) {
        modal = document.createElement("div");
        modal.id = modalId;
        modal.className = "fixed inset-0 bg-black/50 flex items-center justify-center z-50 hidden";
        modal.innerHTML = `
            <div class="bg-white dark:bg-neutral-900 p-6 rounded-lg w-full max-w-md md:max-w-lg lg:max-w-2xl">
                <h3 class="text-lg font-bold mb-4 text-purple-600 dark:text-purple-400">Select Subjects to Export</h3>
                <input type="text" id="export-subject-input" placeholder="Type subject name..." 
                    class="w-full p-2 mb-4 border rounded dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                <ul id="export-subject-list" class="max-h-48 overflow-y-auto mb-4 border rounded dark:border-neutral-700 dark:bg-neutral-800"></ul>
                <div class="flex justify-end gap-2">
                    <button id="export-cancel-btn" class="px-4 py-2 bg-neutral-500 text-white rounded hover:bg-neutral-600">Cancel</button>
                    <button id="export-ok-btn" class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">Export</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const input = modal.querySelector("#export-subject-input");
    const list = modal.querySelector("#export-subject-list");
    const cancelBtn = modal.querySelector("#export-cancel-btn");
    const okBtn = modal.querySelector("#export-ok-btn");

    modal.classList.remove("hidden");
    input.value = "";
    list.innerHTML = "";

    let selectedSubjects = new Set();

    function updateList(filter = "") {
        list.innerHTML = "";
        const filtered = subjects.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()));
        filtered.forEach(s => {
            const li = document.createElement("li");
            li.textContent = s.name;
            li.className = "p-2 cursor-pointer hover:bg-purple-500 hover:text-white rounded";

            if (selectedSubjects.has(s.id)) li.classList.add("bg-purple-500", "text-white");

            li.onclick = () => {
                if (selectedSubjects.has(s.id)) selectedSubjects.delete(s.id);
                else selectedSubjects.add(s.id);
                updateList(input.value);
            };
            list.appendChild(li);
        });
    }

    updateList();

    input.oninput = (e) => updateList(e.target.value);
    cancelBtn.onclick = () => modal.classList.add("hidden");

    okBtn.onclick = async () => {
        if (selectedSubjects.size === 0) {
            showCustomAlert("Select at least one subject to export.");
            return;
        }

        const data = [];
        for (const id of selectedSubjects) {
            const s = subjects.find(sub => sub.id === id);
            if (!s) continue;
            const questions = await getQuestionsBySubject(s.id);
            data.push({
                name: s.name,
                questions: questions.map(q => ({ questionText: q.questionText, answer: q.answer }))
            });
        }

        // Generate timestamped filename
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        const hh = String(hours).padStart(2, "0");
        const filename = `quizcet_selected_subjects_questions-${yyyy}-${mm}-${dd}_${hh}-${minutes}-${ampm}.json`;

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);

        modal.classList.add("hidden");
    };
}

async function exportSelectedSubjectsAsText() {
    const subjects = await getSubjects();
    if (subjects.length === 0) return showCustomAlert("No subjects available.");

    // Sort subjects alphabetically by name
    subjects.sort((a, b) => a.name.localeCompare(b.name));

    // Same modal as above, just reuse it
    const modalId = "export-select-subject-modal";
    let modal = document.getElementById(modalId);

    if (!modal) {
        // Recreate modal if needed (same as above)
        await exportSelectedSubjects(); // ensures modal exists
        modal = document.getElementById(modalId);
    }

    const input = modal.querySelector("#export-subject-input");
    const list = modal.querySelector("#export-subject-list");
    const cancelBtn = modal.querySelector("#export-cancel-btn");
    const okBtn = modal.querySelector("#export-ok-btn");

    modal.classList.remove("hidden");
    input.value = "";
    list.innerHTML = "";

    let selectedSubjects = new Set();

    function updateList(filter = "") {
        list.innerHTML = "";
        const filtered = subjects.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()));
        filtered.forEach(s => {
            const li = document.createElement("li");
            li.textContent = s.name;
            li.className = "p-2 cursor-pointer hover:bg-purple-500 hover:text-white rounded";

            if (selectedSubjects.has(s.id)) li.classList.add("bg-purple-500", "text-white");

            li.onclick = () => {
                if (selectedSubjects.has(s.id)) selectedSubjects.delete(s.id);
                else selectedSubjects.add(s.id);
                updateList(input.value);
            };
            list.appendChild(li);
        });
    }

    updateList();
    input.oninput = (e) => updateList(e.target.value);
    cancelBtn.onclick = () => modal.classList.add("hidden");

    okBtn.onclick = async () => {
        if (selectedSubjects.size === 0) {
            showCustomAlert("Select at least one subject to export.");
            return;
        }

        const data = [];
        for (const id of selectedSubjects) {
            const s = subjects.find(sub => sub.id === id);
            if (!s) continue;
            const questions = await getQuestionsBySubject(s.id);
            data.push({
                name: s.name,
                questions: questions.map(q => ({ questionText: q.questionText, answer: q.answer }))
            });
        }

        const jsonText = JSON.stringify(data);
        try {
            await navigator.clipboard.writeText(jsonText);
            showCustomAlert("Selected subjects copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy:", err);
            showCustomAlert("Could not copy to clipboard. Here is the JSON:\n\n" + jsonText);
        }

        modal.classList.add("hidden");
    };
}