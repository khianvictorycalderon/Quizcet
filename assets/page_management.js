// Function to get the "page" from URL query
function getPageFromURL() {
    const params = new URLSearchParams(window.location.search);
    const page = params.get("page");
    return page && pages[page] ? page : "home"; // default to home if invalid
}

// Function to set page content and update URL
function setPage(page, updateURL = true) {
    const content = document.getElementById("page-content");
    content.innerHTML = pages[page] ?? pages["home"];

    // Initialize page-specific UI AFTER content is in DOM
    if (page === "home") initHomePage(); // ✅ add this
    if (page === "subjects") initSubjectsPage();
    if (page === "questions") initQuestionsPage();
    if (page === "settings") {

    // attach listener after content is injected
    const importInput = document.getElementById("import-file");
    if (importInput) {
            importInput.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                await importSubjects(file);
                e.target.value = ""; // reset input so same file can be selected again
            };
        }
    }

    if (updateURL) {
        const newURL = `${window.location.pathname}?page=${page}`;
        window.history.pushState({ page }, "", newURL);
    }
}

// Handle back/forward browser buttons
window.addEventListener("popstate", (event) => {
    const page = event.state?.page || getPageFromURL();
    setPage(page, false); // don't update URL again
});