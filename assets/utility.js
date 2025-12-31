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
    let importedData;

    try {
        importedData = JSON.parse(text);
    } catch (e) {
        return alert("Invalid JSON file.");
    }

    if (!Array.isArray(importedData)) return alert("Invalid data format.");

    for (const subj of importedData) {
        if (!subj.name || !Array.isArray(subj.questions)) continue;

        const existingSubjects = await getSubjects();
        let existing = existingSubjects.find(s => s.name.toLowerCase() === subj.name.toLowerCase());
        let subjectId;

        if (existing) {
            subjectId = existing.id;
        } else {
            subjectId = await addSubject(subj.name);
        }

        for (const q of subj.questions) {
            if (!q.questionText || !Array.isArray(q.answers)) continue;

            const existingQuestions = await getQuestionsBySubject(subjectId);
            const duplicate = existingQuestions.some(eq => eq.questionText === q.questionText);

            if (!duplicate) {
                await addQuestion(subjectId, q.type || "identification", q.questionText, q.answers);
            }
        }
    }

    alert("Import complete!");
}
