let db;
const DB_NAME = "QuizcetDB";
const DB_VERSION = 1;

const request = indexedDB.open("QuizcetDB", 1);

request.onupgradeneeded = (event) => {
    const db = event.target.result;

    // Subjects store
    if (!db.objectStoreNames.contains("subjects")) {
        const subjectsStore = db.createObjectStore("subjects", { keyPath: "id", autoIncrement: true });
        subjectsStore.createIndex("name", "name", { unique: true });
    }

    // Questions store
    if (!db.objectStoreNames.contains("questions")) {
        const questionsStore = db.createObjectStore("questions", { keyPath: "id", autoIncrement: true });
        questionsStore.createIndex("subject_id", "subject_id", { unique: false });
    }
};

request.onsuccess = (event) => {
    db = event.target.result;
    console.log("Quizcet DB ready!");
};

request.onerror = (event) => {
    alert("Failed to connect to QuizcetDB: " + event.target.error);
};

// ================== SUBJECTS ==================
async function addSubject(name) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction("subjects", "readwrite");
        const store = tx.objectStore("subjects");

        const getAll = store.getAll();
        getAll.onsuccess = () => {
            const exists = getAll.result.some(s => s.name.toLowerCase() === name.toLowerCase());
            if (exists) return reject("Subject already exists!");
            const req = store.add({ name: name.trim() });
            req.onsuccess = () => resolve(req.result);
            req.onerror = e => reject(e);
        };
        getAll.onerror = e => reject(e);
    });
}

async function getSubjects() {
    return new Promise((resolve) => {
        const tx = db.transaction("subjects", "readonly");
        const store = tx.objectStore("subjects");
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
    });
}

async function updateSubject(id, name) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction("subjects", "readwrite");
        const store = tx.objectStore("subjects");
        const getReq = store.get(id);
        getReq.onsuccess = () => {
            const subject = getReq.result;
            if (!subject) return reject("Subject not found");
            subject.name = name.trim();
            const putReq = store.put(subject);
            putReq.onsuccess = () => resolve(true);
            putReq.onerror = e => reject(e);
        };
        getReq.onerror = e => reject(e);
    });
}

async function deleteSubject(id) {
    return new Promise(async (resolve, reject) => {
        try {
            const tx = db.transaction(["subjects", "questions"], "readwrite");
            tx.objectStore("subjects").delete(id);
            const index = tx.objectStore("questions").index("subject_id");
            const range = IDBKeyRange.only(id);
            index.openCursor(range).onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    cursor.delete();
                    cursor.continue();
                }
            };
            tx.oncomplete = () => resolve(true);
            tx.onerror = e => reject(e);
        } catch (e) { reject(e); }
    });
}

// ================== QUESTIONS ==================
async function addQuestion(subject_id, questionText, answers) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction("questions", "readwrite");
        const store = tx.objectStore("questions");

        const req = store.add({ subject_id, questionText, answers });
        req.onsuccess = () => resolve(req.result);
        req.onerror = e => reject(e);
    });
}

async function getQuestionsBySubject(subjectId) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction("questions", "readonly");
        const store = tx.objectStore("questions");

        if (store.indexNames.contains("subject_id")) {
            const index = store.index("subject_id");
            const request = index.getAll(subjectId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = e => reject(e);
        } else {
            const request = store.getAll();
            request.onsuccess = () => {
                const filtered = request.result.filter(q => q.subject_id === subjectId);
                resolve(filtered);
            };
            request.onerror = e => reject(e);
        }
    });
}

async function getQuestions(subject_id) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction("questions", "readonly");
        const store = tx.objectStore("questions");
        const index = store.index("subject_id");
        const req = index.getAll(subject_id);
        req.onsuccess = () => resolve(req.result);
        req.onerror = e => reject(e);
    });
}

async function updateQuestion(id, questionText, answers) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction("questions", "readwrite");
        const store = tx.objectStore("questions");

        const getReq = store.get(id);
        getReq.onsuccess = () => {
            const question = getReq.result;
            if (!question) return reject("Question not found");

            question.questionText = questionText;
            question.answers = answers;

            const putReq = store.put(question);
            putReq.onsuccess = () => resolve(true);
            putReq.onerror = e => reject(e);
        };
        getReq.onerror = e => reject(e);
    });
}

async function deleteQuestion(id) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction("questions", "readwrite");
        const store = tx.objectStore("questions");
        const req = store.delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = e => reject(e);
    });
}