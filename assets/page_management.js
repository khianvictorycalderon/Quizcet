// HTML Contents
const pages = {
    home: `
        <div class="min-h-screen pt-20">
            <h2>This is Home page</h2>
        </div>
    `,
    subjects: `
        <div class="min-h-screen pt-20">
            <h2>This is Subjects page</h2>
        </div>
    `,
    questions: `
        <div class="min-h-screen pt-20">
            <h2>This is Questions page</h2>
        </div>
    `,
    tutorial: `
        <div class="min-h-screen pt-20">
            <h2>This is Tutorial page</h2>
        </div>
    `
};

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

// Initialize page on load
window.addEventListener("DOMContentLoaded", () => {
    const initialPage = getPageFromURL();
    setPage(initialPage, false); // don't pushState on initial load
});