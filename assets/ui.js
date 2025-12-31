let editingQuestionId = null;

// ================== HOME PAGE ==================
let questionHistoryAll = [];
let questionHistorySubject = {};

async function initHomePage() {
    const reviewAllBtn = document.getElementById("review-all-btn");
    const reviewOneBtn = document.getElementById("review-one-btn");
    const container = document.getElementById("home-questions-container");

    if (!reviewAllBtn || !reviewOneBtn || !container) return;

    reviewAllBtn.onclick = async () => {
        await showRandomQuestion(container, "all");
    };

    reviewOneBtn.onclick = async () => {
        const subjects = await getSubjects();
        const validSubjects = [];

        for (const s of subjects) {
            const qs = await getQuestionsBySubject(s.id);
            if (qs.length >= 5) validSubjects.push(s);
        }

        if (validSubjects.length === 0) {
            alert("No subjects have at least 5 questions.");
            return;
        }

        // Ask user to pick one subject
        const subjectNames = validSubjects.map(s => s.name).join("\n");
        const choice = prompt(`Select a subject:\n${subjectNames}`);
        const selected = validSubjects.find(s => s.name.toLowerCase() === (choice || "").toLowerCase());

        if (!selected) {
            alert("Invalid subject selection.");
            return;
        }

        await showRandomQuestion(document.getElementById("home-questions-container"), "subject", selected.id);
    };

}

let lastQuestionId = null;

async function showRandomQuestion(container, mode = "all", subjectId = null) {
    let questions = [];

    if (mode === "all") {
        const subjects = await getSubjects();
        const validSubjects = [];
        for (const s of subjects) {
            const qs = await getQuestionsBySubject(s.id);
            if (qs.length >= 5) validSubjects.push(...qs);
        }

        if (validSubjects.length === 0) {
            container.innerHTML = `<p class="text-red-500">No subjects have at least 5 questions.</p>`;
            return;
        }

        questions = validSubjects;

    } else if (mode === "subject") {
        const qs = await getQuestionsBySubject(subjectId);
        if (qs.length < 5) {
            container.innerHTML = `<p class="text-red-500">This subject must have at least 5 questions.</p>`;
            return;
        }
        questions = qs;
    }

    // Avoid consecutive repetition
    let q;
    do {
        q = questions[Math.floor(Math.random() * questions.length)];
    } while (questions.length > 1 && q.id === lastQuestionId);

    lastQuestionId = q.id;
    displayQuestion(container, q, mode, subjectId);
}

// Display question
function displayQuestion(container, question, mode, subjectId) {
    container.innerHTML = `
        <div class="p-4 border rounded-md shadow-md dark:border-gray-700 dark:bg-gray-800">
            <h3 class="font-semibold mb-4 whitespace-pre-wrap">${question.questionText}</h3>
            <div id="home-answer-container" class="flex flex-col gap-2">
                <input type="text" placeholder="Type your answer here..." class="w-full p-2 border rounded dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
                <button id="submit-answer-btn" class="mt-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">Submit</button>
            </div>
        </div>
    `;

    const ansInput = document.querySelector("#home-answer-container input");
    const submitBtn = document.getElementById("submit-answer-btn");

    submitBtn.onclick = async () => {
        const userAnswer = ansInput.value.trim();
        if (!userAnswer) return alert("Enter an answer!");

        if (userAnswer.toLowerCase() === question.answer.toLowerCase()) {
            alert("Correct!");
        } else {
            alert(`Wrong! Correct answer: ${question.answer}`);
        }

        // Move to next question automatically
        await showRandomQuestion(container, mode, subjectId);
    };
}

// ================== SUBJECTS ==================
async function populateSubjects() {
    const container = document.getElementById("subjects-list");
    if (!container) return;

    const subjects = await getSubjects();
    container.innerHTML = "";

    subjects.forEach(subject => {
        const div = document.createElement("div");
        div.className = "flex flex-row gap-2 mb-2";

        const input = document.createElement("input");
        input.type = "text";
        input.value = subject.name;
        input.className = "flex-1 p-2 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white";

        input.onchange = async () => {
            const newName = input.value.trim();
            if (!newName) return alert("Name cannot be empty");

            const allSubjects = await getSubjects();
            const duplicate = allSubjects.some(s => s.name.toLowerCase() === newName.toLowerCase() && s.id !== subject.id);

            if (duplicate) {
                alert("A subject with this name already exists!");
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
        if (!name) return alert("Enter a subject name");
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
    const select = document.getElementById("subject-select");
    if (!select) return;

    const subjects = await getSubjects();
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

    const subjectId = Number(select.value);
    if (!subjectId) {
        list.innerHTML = "";
        return;
    }

    const questions = await getQuestions(subjectId);
    list.innerHTML = "";

    questions.forEach(q => {
        const div = document.createElement("div");
        div.className = "flex flex-col p-2 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white";

        const text = document.createElement("div");
        text.textContent = q.questionText;
        text.className = "mb-1 whitespace-pre-wrap";

        const ans = document.createElement("div");
        ans.className = "mb-2 text-sm text-gray-300 dark:text-gray-400 whitespace-pre-wrap";
        ans.textContent = "Answer: " + q.answers[0];

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
        if (!subjectId) return alert("Select a subject first");

        const questionText = document.getElementById("question-text").value.trim();
        if (!questionText) return alert("Enter a question");

        const answerText = document.getElementById("answer-text").value.trim();
        if (!answerText) return alert("Enter an answer");

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

    select.onchange = populateQuestions;
    addBtn.onclick = () => openQuestionModal();
    setupQuestionModal();
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
});

document.getElementById("import-file")?.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    await importSubjects(file);
    e.target.value = ""; // Reset input
});
