let editingQuestionId = null;

function showCustomAlert(message) {
    const modal = document.getElementById("custom-alert");
    const msg = document.getElementById("custom-alert-message");
    const okBtn = document.getElementById("custom-alert-ok");

    if (!modal || !msg || !okBtn) return;

    msg.innerHTML = message;
    modal.classList.remove("hidden");

    const close = () => {
        modal.classList.add("hidden");
        okBtn.removeEventListener("click", close);
    };

    okBtn.addEventListener("click", close);
    modal.addEventListener("click", close);
}

// ================== HOME PAGE ==================
let questionHistoryAll = [];
let questionHistorySubject = {};

function hideElement(element) {
    const el = document.getElementById(element).style.display = "none";
}

async function initHomePage() {
    const reviewAllSubButton = document.getElementById("review-all-sub-btn");
    const reviewSubsButton = document.getElementById("review-subs-btn");
    const container = document.getElementById("home-questions-container");

    if (!reviewAllSubButton || !reviewSubsButton || !container) return;

    reviewAllSubButton.onclick = async () => {
        await showRandomQuestion(container, "all");
        hideElement("start-review-label"); // Hide the start review label
    };

    reviewSubsButton.onclick = async () => {
        hideElement("start-review-label"); // Hide the start review label
        const subjects = await getSubjects();
        const validSubjects = [];

        for (const s of subjects) {
            const qs = await getQuestionsBySubject(s.id);
            if (qs.length >= 3) validSubjects.push(s);
        }

        validSubjects.sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
        );

        if (validSubjects.length === 0) {
            showCustomAlert("No subjects have at least 3 questions.");
            return;
        }

        // Show modal
        const modal = document.getElementById("select-subject-modal");
        const input = document.getElementById("select-subject-input");
        const list = document.getElementById("select-subject-list");
        const cancelBtn = document.getElementById("cancel-select-subject");
        const okBtn = document.getElementById("ok-select-subject");

        modal.classList.remove("hidden");
        input.value = "";
        list.innerHTML = "";

        let selectedSubjects = new Set(); // <-- multiple selections

        // Populate list
        function updateList(filter = "") {
            list.innerHTML = "";
            const filtered = validSubjects.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()));
            filtered.forEach(s => {
                const li = document.createElement("li");
                li.textContent = s.name;
                li.className = "p-2 cursor-pointer hover:bg-purple-500 hover:text-white rounded";

                // Highlight selected subjects
                if (selectedSubjects.has(s.id)) {
                    li.classList.add("bg-purple-500", "text-white");
                }

                li.onclick = () => {
                    if (selectedSubjects.has(s.id)) {
                        selectedSubjects.delete(s.id);
                    } else {
                        selectedSubjects.add(s.id);
                    }
                    updateList(input.value); // refresh highlighting
                };
                list.appendChild(li);
            });
        }

        updateList();

        input.oninput = (e) => {
            updateList(e.target.value);
        };

        cancelBtn.onclick = () => {
            modal.classList.add("hidden");
        };

        okBtn.onclick = async () => {
            if (selectedSubjects.size === 0) {
                showCustomAlert("Select at least one subject.");
                return;
            }

            // Reset queue
            questionQueue = [];
            lastQuestionId = null;

            modal.classList.add("hidden");

            // Pass array of IDs to showRandomQuestion
            await showRandomQuestion(container, "multiple", Array.from(selectedSubjects));
        };
    };


}

// ================== HOME PAGE RANDOM QUEUE ==================
let questionQueue = [];
let lastQuestionId = null;

// Get next question in random order, without repeating until all are done
async function showRandomQuestion(container, mode = "all", subjectIds = null) {
    let questions = [];

    if (mode === "all") {
        const subjects = await getSubjects();
        for (const s of subjects) {
            const qs = await getQuestionsBySubject(s.id);
            if (qs.length >= 3) questions.push(...qs);
        }
        if (questions.length === 0) {
            showCustomAlert("No subjects have at least 3 questions.");
            return;
        }
    } else if (mode === "subject") {
        const qs = await getQuestionsBySubject(subjectIds); // old single subject
        if (qs.length < 3) {
            container.innerHTML = `<p class="text-red-500">This subject must have at least 3 questions.</p>`;
            return;
        }
        questions = qs;
    } else if (mode === "multiple") {
        for (const id of subjectIds) {
            const qs = await getQuestionsBySubject(id);
            if (qs.length >= 3) questions.push(...qs);
        }
        if (questions.length === 0) {
            container.innerHTML = `<p class="text-red-500">Selected subjects do not have enough questions.</p>`;
            return;
        }
    }

    // Initialize or refill the queue if empty
    if (questionQueue.length === 0 || questionQueue.every(q => q.used)) {
        questionQueue = questions.map(q => ({ ...q, used: false }));
    }

    const unused = questionQueue.filter(q => !q.used);
    let q;
    do {
        q = unused[Math.floor(Math.random() * unused.length)];
    } while (unused.length > 1 && q.id === lastQuestionId);

    lastQuestionId = q.id;
    questionQueue.find(qq => qq.id === q.id).used = true;

    displayQuestion(container, q, mode, subjectIds);
}


let lastQuestionCorrect = false;

// Display question
function displayQuestion(container, question, mode, subjectId) {


    container.innerHTML = `
        <div class="p-4 border rounded-md shadow-md dark:border-neutral-700 dark:bg-neutral-800">
            <h3 class="font-semibold mb-4 whitespace-pre-wrap">${question.questionText}</h3>
            <form id="home-answer-form" class="flex flex-col gap-2">
                <input type="text" placeholder="Type your answer here..." class="w-full p-2 border rounded dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" required />
                <button type="submit" class="mt-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">Submit</button>
            </form>
        </div>
    `;
    
    const form = document.getElementById("home-answer-form");
    const ansInput = form.querySelector("input");

    if (lastQuestionCorrect) ansInput.focus();
    
    form.onsubmit = async (e) => {
        e.preventDefault(); // Prevent page reload on Enter

        const userAnswer = ansInput.value.trim();
        if (!userAnswer) return showCustomAlert("Enter an answer!");

        // Answer must match the case exactly
        if (userAnswer === question.answer) {
            lastQuestionCorrect = true;
            await showRandomQuestion(container, mode, subjectId); // correct -> next immediately
        } else {
            lastQuestionCorrect = false;

            // Show alert and wait for it to close before moving on
            await new Promise((resolve) => {
                const modal = document.getElementById("custom-alert");
                const okBtn = document.getElementById("custom-alert-ok");
                const msg = document.getElementById("custom-alert-message");

                msg.innerHTML = `Wrong! Correct answer:<br><b><u>${question.answer}</u></b>`;
                modal.classList.remove("hidden");

                const close = () => {
                    modal.classList.add("hidden");
                    okBtn.removeEventListener("click", close);
                    resolve(); // allow next question
                };

                okBtn.addEventListener("click", close);
            });

            // After alert closes, show next question
            await showRandomQuestion(container, mode, subjectId);
        }
    };
}

// ================== SUBJECTS ==================
async function populateSubjects() {
    const container = document.getElementById("subjects-list");
    if (!container) return;

    const subjects = await getSubjects();

    // Sort alphabetically by name
    subjects.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

    container.innerHTML = "";

    subjects.forEach(subject => {
        const div = document.createElement("div");
        div.className = "flex flex-row gap-2 mb-2";

        const input = document.createElement("input");
        input.type = "text";
        input.value = subject.name;
        input.className = "flex-1 p-2 border rounded dark:border-neutral-700 dark:bg-neutral-800 dark:text-white";

        input.onchange = async () => {
            const newName = input.value.trim();
            if (!newName) return showCustomAlert("Name cannot be empty");

            const allSubjects = await getSubjects();
            const duplicate = allSubjects.some(s => s.name.toLowerCase() === newName.toLowerCase() && s.id !== subject.id);

            if (duplicate) {
                showCustomAlert("A subject with this name already exists!");
                input.value = subject.name;
                return;
            }

            await updateSubject(subject.id, newName);
            await populateSubjects();
            await populateSubjectSelect();
        };

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.className = "bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded";
        delBtn.onclick = async () => {
            if (!confirm("Delete this subject?")) return;
            await deleteSubject(subject.id);
            await populateSubjects();
            await populateSubjectSelect();
        };

        div.appendChild(input);
        div.appendChild(delBtn);
        container.appendChild(div);
    });
}

function initSubjectsPage() {
    const addBtn = document.getElementById("add-subject-btn");
    const input = document.getElementById("new-subject-name");
    if (!addBtn || !input) return;

    addBtn.onclick = async () => {
        const name = input.value.trim();
        if (!name) return showCustomAlert("Enter a subject name");
        try {
            await addSubject(name);
            input.value = "";
            await populateSubjects();
            await populateSubjectSelect(); // <-- make sure this is here
        } catch (e) {
            alert(e);
        }
    };

    populateSubjects();
}

// ================== QUESTIONS ==================
async function populateSubjectSelect() {
    const input = document.getElementById("subject-search");
    const dropdown = document.getElementById("subject-dropdown");
    const select = document.getElementById("subject-select");

    if (!input || !dropdown || !select) return;

    let subjects = await getSubjects();
    subjects.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

    function updateDropdown(filter = "") {
        dropdown.innerHTML = "";

        const filtered = subjects.filter(sub => sub.name.toLowerCase().includes(filter.toLowerCase()));
        filtered.forEach(sub => {
            const li = document.createElement("li");
            li.textContent = sub.name;
            li.className = "p-2 cursor-pointer hover:bg-purple-500 hover:text-white truncate";
            li.title = sub.name;

            li.onclick = () => {
                input.value = sub.name;
                input.dataset.id = sub.id;
                select.value = sub.id; // update hidden select
                dropdown.classList.add("hidden");
                populateQuestions(); // refresh questions for selected subject
            };

            dropdown.appendChild(li);
        });

        dropdown.classList.toggle("hidden", filtered.length === 0);
    }

    updateDropdown();

    input.addEventListener("input", (e) => updateDropdown(e.target.value));
    input.addEventListener("focus", () => updateDropdown(input.value));
    input.addEventListener("blur", () => setTimeout(() => dropdown.classList.add("hidden"), 200));

    // Populate hidden select (for forms or fallback)
    select.innerHTML = `<option value="">-- Choose Subject --</option>`;
    subjects.forEach(sub => {
        const opt = document.createElement("option");
        opt.value = sub.id;
        opt.textContent = sub.name;
        select.appendChild(opt);
    });
}

async function populateQuestions() {
    const list = document.getElementById("questions-list");
    const select = document.getElementById("subject-select");
    if (!list || !select) return;

    const subjectId = Number(document.getElementById("subject-search").dataset.id);
    if (!subjectId) {
        list.innerHTML = "";
        return;
    }

    const questions = await getQuestions(subjectId);
    list.innerHTML = "";

    questions.forEach(q => {
        const div = document.createElement("div");
        div.className = "flex flex-col p-2 border rounded dark:border-neutral-700 dark:bg-neutral-800 dark:text-white";

        const text = document.createElement("div");
        text.textContent = q.questionText;
        text.className = "mb-1 whitespace-pre-wrap";

        const ans = document.createElement("div");
        ans.className = "mb-2 text-sm text-neutral-500 dark:text-neutral-400 whitespace-pre-wrap";
        ans.textContent = "Answer: " + q.answer;

        const btnDiv = document.createElement("div");
        btnDiv.className = "flex gap-2";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded";
        editBtn.onclick = () => openQuestionModal(q);

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.className = "bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded";
        delBtn.onclick = async () => {
            if (!confirm("Delete this question?")) return;
            await deleteQuestion(q.id);
            populateQuestions();
        };

        btnDiv.appendChild(editBtn);
        btnDiv.appendChild(delBtn);

        div.appendChild(text);
        div.appendChild(ans);
        div.appendChild(btnDiv);

        list.appendChild(div);
    });
}

function openQuestionModal(question = null) {
    editingQuestionId = question ? question.id : null;
    const modal = document.getElementById("question-modal");
    const questionTextarea = document.getElementById("question-text");
    const answerInput = document.getElementById("answer-text"); // now input

    modal.classList.remove("hidden");
    questionTextarea.value = question ? question.questionText : "";
    answerInput.value = question ? question.answer : "";
}

function setupQuestionModal() {
    const modal = document.getElementById("question-modal");
    const cancelBtn = document.getElementById("cancel-question");
    const saveBtn = document.getElementById("save-question");

    cancelBtn.onclick = () => modal.classList.add("hidden");

    saveBtn.onclick = async () => {
        const subjectId = Number(document.getElementById("subject-select").value);

        const questionText = document.getElementById("question-text").value.trim();
        if (!questionText) return showCustomAlert("Enter a question");

        const answerText = document.getElementById("answer-text").value.trim();
        if (!answerText) return showCustomAlert("Enter an answer");

        if (editingQuestionId) {
            await updateQuestion(editingQuestionId, questionText, answerText);
        } else {
            await addQuestion(subjectId, questionText, answerText);
        }

        modal.classList.add("hidden");
        populateQuestions();
    };
}

function initQuestionsPage() {
    const select = document.getElementById("subject-select");
    const addBtn = document.getElementById("add-question-btn");
    if (!select || !addBtn) return;

    populateSubjectSelect().then(() => populateQuestions());

    // Open question modal only if a subject is selected
    addBtn.onclick = () => {
        const input = document.getElementById("subject-search");
        const subjectId = Number(input.dataset.id); // <- check the actual selected subject

        if (!subjectId) {
            return showCustomAlert("Select a subject first");
        }

        // open empty modal for adding new question
        openQuestionModal();
    };

    select.onchange = populateQuestions;
    setupQuestionModal();
}

async function clearSubjectSearchInput() {
    const input = document.getElementById("subject-search");
    input.value = "";
    input.dataset.id = "";
    questionQueue = [];
    lastQuestionId = null;
    await populateQuestions();
}

// ================== INIT ==================
document.addEventListener("DOMContentLoaded", async () => {
    const waitForDB = () => new Promise(res => {
        const check = () => db ? res() : setTimeout(check, 50);
        check();
    });
    await waitForDB();

    await populateSubjects();
    await populateSubjectSelect();

    const initialPage = getPageFromURL();
    setPage(initialPage, false);

    document.getElementById("import-file")?.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        await importSubjects(file);
        e.target.value = ""; // Reset input
    });

});