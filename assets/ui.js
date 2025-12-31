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

        const subjectNames = validSubjects.map(s => s.name).join("\n");
        const choice = prompt(`Select a subject:\n${subjectNames}`);
        const selected = validSubjects.find(s => s.name.toLowerCase() === (choice || "").toLowerCase());

        if (!selected) {
            alert("Invalid subject selection.");
            return;
        }

        await showRandomQuestion(container, "subject", selected.id);
    };
}


// showRandomQuestion
async function showRandomQuestion(container, mode = "all", subjectId = null) {
    let questions = [];
    if (mode === "all") {
        const subjects = await getSubjects();
        for (const s of subjects) {
            const qs = await getQuestionsBySubject(s.id);
            questions.push(...qs);
        }

        if (questions.length === 0) {
            container.innerHTML = `<p class="text-red-500">No questions available. Add some first!</p>`;
            return;
        }

        // Exclude already asked questions
        const remaining = questions.filter(q => !questionHistoryAll.includes(q.id));
        const pool = remaining.length > 0 ? remaining : (questionHistoryAll = [], questions); // reset history if exhausted
        const q = pool[Math.floor(Math.random() * pool.length)];
        questionHistoryAll.push(q.id);
        displayQuestion(container, q);

    } else if (mode === "subject") {
        const qs = await getQuestionsBySubject(subjectId);
        if (qs.length < 5) {
            container.innerHTML = `<p class="text-red-500">This subject must have at least 5 questions.</p>`;
            return;
        }

        if (!questionHistorySubject[subjectId]) questionHistorySubject[subjectId] = [];
        const remaining = qs.filter(q => !questionHistorySubject[subjectId].includes(q.id));
        const pool = remaining.length > 0 ? remaining : (questionHistorySubject[subjectId] = [], qs);
        const q = pool[Math.floor(Math.random() * pool.length)];
        questionHistorySubject[subjectId].push(q.id);
        displayQuestion(container, q);
    }
}

// displayQuestion
function displayQuestion(container, question) {
    container.innerHTML = `
        <div class="p-4 border rounded-md shadow-md dark:border-gray-700 dark:bg-gray-800">
            <h3 class="font-semibold mb-4">${question.question}</h3>
            <div id="home-answer-container"></div>
            <button id="show-answer-btn" class="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Show Answer</button>
        </div>
    `;

    const ansContainer = document.getElementById("home-answer-container");
    generateAnswerInputs(question.type, question.answer, ansContainer);

    document.getElementById("show-answer-btn").onclick = () => {
        alert("Answer: " + question.answer.join(", "));
    };
}

let editingQuestionId = null;

// ================== SUBJECTS ==================
async function populateSubjects() {
    const container = document.getElementById("subjects-list");
    if (!container) return;

    const subjects = await getSubjects();
    container.innerHTML = "";

    subjects.forEach(subject => {
        const div = document.createElement("div");
        div.className = "flex flex-row gap-2";

        const input = document.createElement("input");
        input.type = "text";
        input.value = subject.name;
        input.className = "flex-1 p-2 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white";

        input.onchange = async () => {
            const newName = input.value.trim();
            if (!newName) return alert("Name cannot be empty");

            const allSubjects = await getSubjects();
            const duplicate = allSubjects.some(
                s => s.name.toLowerCase() === newName.toLowerCase() && s.id !== subject.id
            );

            if (duplicate) {
                alert("A subject with this name already exists!");
                input.value = subject.name; // revert to original name
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

            const selectedSubjectId = Number(document.getElementById("subject-select")?.value);
            await deleteSubject(subject.id);

            // Update Subjects list if visible
            const subjectsList = document.getElementById("subjects-list");
            if (subjectsList) await populateSubjects();

            // Update Questions dropdown if visible
            const select = document.getElementById("subject-select");
            if (select) await populateSubjectSelect();

            // Clear questions if deleted subject was selected
            if (selectedSubjectId === subject.id) {
                const questionsList = document.getElementById("questions-list");
                if (questionsList) questionsList.innerHTML = "";
                if (select) select.value = "";
            }
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
            await populateSubjectSelect();
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
        text.textContent = `[${q.type}] ${q.questionText}`;
        text.className = "mb-1";

        const ans = document.createElement("div");
        ans.className = "mb-2 text-sm text-gray-300 dark:text-gray-400";
        ans.textContent = "Answers: " + (Array.isArray(q.answers) ? q.answers.join(", ") : q.answers);

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

function initQuestionsPage() {
    const select = document.getElementById("subject-select");
    const addBtn = document.getElementById("add-question-btn");
    if (!select || !addBtn) return;

    populateSubjectSelect().then(() => populateQuestions());

    select.onchange = populateQuestions;

    addBtn.onclick = () => openQuestionModal();
    setupQuestionModal();
}

// ================== QUESTION MODAL ==================
function openQuestionModal(question = null) {
    editingQuestionId = question ? question.id : null;
    const modal = document.getElementById("question-modal");
    const textInput = document.getElementById("question-text");
    const typeSelect = document.getElementById("question-type");
    const answersContainer = document.getElementById("answers-container");

    modal.classList.remove("hidden");

    textInput.value = question ? question.questionText : "";
    typeSelect.value = question ? question.type : "identification";
    answersContainer.innerHTML = "";

    if (question && question.answers) {
        generateAnswerInputs(question.type, question.answers);
    } else {
        generateAnswerInputs("identification", []);
    }
}

function generateAnswerInputs(type, answers = [], correctAnswer = null) {
    const container = document.getElementById("answers-container");
    container.innerHTML = "";

    if (type === "identification") {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Answer";
        input.value = answers[0] || "";
        input.className = "w-full p-2 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white";
        container.appendChild(input);

    } else if (type === "multiple") {
        for (let i = 0; i < 4; i++) {
            const div = document.createElement("div");
            div.className = "flex items-center gap-2 mb-1";

            // Text input for the option
            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = `Option ${i + 1}`;
            input.value = answers[i] || "";
            input.className = "flex-1 p-2 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white";

            // Radio button for selecting correct answer
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "correct-answer"; // all radios share the same name
            radio.value = i;
            if (correctAnswer === i) radio.checked = true;

            div.appendChild(radio);
            div.appendChild(input);
            container.appendChild(div);
        }

    } else if (type === "truefalse") {
        const options = ["True", "False"];
        options.forEach((val) => {
            const label = document.createElement("label");
            label.className = `
                cursor-pointer
                flex items-center justify-between
                p-3 border rounded-md
                hover:bg-purple-600 hover:text-white
                dark:border-gray-700 dark:hover:bg-purple-600
                transition-colors duration-200
            `;

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "truefalse";
            radio.value = val;
            radio.className = "hidden"; 
            if (answers[0] === val) radio.checked = true;

            const span = document.createElement("span");
            span.textContent = val;

            label.appendChild(radio);
            label.appendChild(span);

            label.onclick = () => {
                container.querySelectorAll("label").forEach(l => l.classList.remove("bg-purple-600", "text-white"));
                label.classList.add("bg-purple-600", "text-white");
                radio.checked = true;
            };

            container.appendChild(label);
        });
    }
}

function setupQuestionModal() {
    const modal = document.getElementById("question-modal");
    const cancelBtn = document.getElementById("cancel-question");
    const saveBtn = document.getElementById("save-question");
    const typeSelect = document.getElementById("question-type");

    cancelBtn.onclick = () => modal.classList.add("hidden");

    typeSelect.onchange = () => generateAnswerInputs(typeSelect.value);

    saveBtn.onclick = async () => {
        const subjectId = Number(document.getElementById("subject-select").value);
        if (!subjectId) return alert("Select a subject first");

        const type = typeSelect.value;
        const questionText = document.getElementById("question-text").value.trim();
        if (!questionText) return alert("Enter a question");

        const container = document.getElementById("answers-container");
        let answers = [];

        if (type === "identification") {
            answers = [container.querySelector("input").value.trim()];
        } else if (type === "multiple") {
            const inputs = Array.from(container.querySelectorAll("input[type='text']"));
            answers = inputs.map(i => i.value.trim());
            
            const selectedRadio = container.querySelector("input[type='radio']:checked");
            if (!selectedRadio) return alert("Select the correct answer");
            
            const correctIndex = Number(selectedRadio.value); // index of correct option
        } else if (type === "truefalse") {
            const checked = container.querySelector("input:checked");
            if (!checked) return alert("Select True or False");
            answers = [checked.value];
        }

        if (editingQuestionId) {
            await updateQuestion(editingQuestionId, type, questionText, answers);
        } else {
            await addQuestion(subjectId, type, questionText, answers);
        }

        modal.classList.add("hidden");
        populateQuestions();
    };
}

document.addEventListener("DOMContentLoaded", async () => {
    const waitForDB = () => new Promise(res => {
        const check = () => db ? res() : setTimeout(check, 50);
        check();
    });
    await waitForDB();

    // Preload subjects
    await populateSubjects();
    await populateSubjectSelect();

    // Initialize current page
    const initialPage = getPageFromURL();
    setPage(initialPage, false);
});
