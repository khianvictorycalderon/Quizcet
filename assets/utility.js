// ================== EXPORT ==================
async function exportSubjects() {
    try {
        const subjects = await getSubjects();
        const data = [];

        for (const subject of subjects) {
            const questions = await getQuestionsBySubject(subject.id);
            data.push({
                name: subject.name,
                questions: questions.map(q => ({
                    questionText: q.questionText,
                    answers: q.answers
                }))
            });
        }

        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "quizcet_export.json";
        document.body.appendChild(a); // required for Firefox
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert("Export complete!");
    } catch (e) {
        alert("Export failed: " + e);
    }
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