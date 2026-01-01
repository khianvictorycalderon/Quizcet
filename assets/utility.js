// ================== EXPORT ==================
async function exportSubjects() {
    const subjects = await getSubjects();

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
        return alert("Invalid JSON file");
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
            }

        } catch (e) {
            console.error("Error importing subject:", s.name, e);
        }
    }

    alert("Import complete!");
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

    alert("All subjects and questions have been deleted.");
    window.location.reload();
}

// ================== EXPORT (Text) ==================
async function exportSubjectsAsText() {
    const subjects = await getSubjects();

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

    const jsonText = JSON.stringify(data, null, 2);

    // Copy to clipboard
    try {
        await navigator.clipboard.writeText(jsonText);
        alert("Subjects and questions copied to clipboard!");
    } catch (err) {
        console.error("Failed to copy:", err);
        alert("Could not copy to clipboard. Here is the JSON:\n\n" + jsonText);
    }
}

// ================== IMPORT (Text) ==================
async function importSubjectsFromText() {
    const jsonText = prompt("Paste your JSON text here:");

    if (!jsonText) return alert("No input provided.");

    let data;
    try {
        data = JSON.parse(jsonText);
    } catch (e) {
        return alert("Invalid JSON. Please check your input.");
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

    alert("Import from text complete!");
    // Refresh UI
    if (document.getElementById("subjects-list")) await populateSubjects();
    if (document.getElementById("subject-select")) await populateSubjectSelect();
    if (document.getElementById("questions-list")) await populateQuestions();
}
