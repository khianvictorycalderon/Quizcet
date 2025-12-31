// Initialize theme from localStorage or default to light
let currentTheme = localStorage.getItem('theme') || 'light';

function applyTheme() {
    const body = document.getElementsByTagName('body')[0];
    const navbar = document.getElementById("navbar");
    const btn = document.getElementById('theme-toggle-button');

    if (currentTheme === 'dark') {
        // Apply dark theme to body
        body.classList.remove('bg-neutral-100', 'text-neural-800');
        body.classList.add('bg-neutral-900', 'text-white');

        // Slightly darken the navbar
        navbar.classList.remove("bg-purple-700");
        navbar.classList.add("bg-purple-900");

        // Apply dark theme to button
        if (btn) {
            btn.classList.remove('bg-neutral-900', 'text-white');
            btn.classList.add('bg-neutral-100', 'text-neutral-900');
            btn.textContent = 'Light';
        }
    } else {
        // Apply light theme to body
        body.classList.remove('bg-neutral-900', 'text-white');
        body.classList.add('bg-neutral-100', 'text-neural-800');

        // Slightly lighten the navbar
        navbar.classList.remove("bg-purple-900");
        navbar.classList.add("bg-purple-700");

        // Apply light theme to button
        if (btn) {
            btn.classList.remove('bg-neutral-100', 'text-neutral-900');
            btn.classList.add('bg-neutral-900', 'text-white');
            btn.textContent = 'Dark';
        }
    }

    // Save current theme to localStorage
    localStorage.setItem('theme', currentTheme);
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme();
}

// Call applyTheme() whenever a page is set
function onPageSet() {
    applyTheme(); // ensures button has correct classes if settings page is loaded
}

// Apply theme immediately on page load
window.addEventListener('DOMContentLoaded', applyTheme);