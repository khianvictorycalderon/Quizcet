const pages = {
    home: `
        <div class="px-4 md:px-8 lg:px-16 pb-16 min-h-screen flex flex-col items-center justify-start pt-32">
            
            <div id="home-questions-container" class="w-full max-w-2xl mb-24"></div>

            <!-- Select Subject Modal -->
            <div id="select-subject-modal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div class="bg-white dark:bg-neutral-900 p-6 rounded-lg w-full max-w-md">
                    <h3 class="text-lg font-bold mb-4 text-purple-600 dark:text-purple-400">Select a Subject</h3>
                    
                    <input type="text" id="select-subject-input" placeholder="Type subject name..." 
                    class="w-full p-2 mb-4 border rounded dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                    
                    <ul id="select-subject-list" class="max-h-48 overflow-y-auto mb-4 border rounded dark:border-neutral-700 dark:bg-neutral-800"></ul>
                    
                    <div class="flex justify-end gap-2">
                    <button id="cancel-select-subject" class="px-4 py-2 bg-neutral-500 text-white rounded hover:bg-neutral-600">Cancel</button>
                    <button id="ok-select-subject" class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">OK</button>
                    </div>
                </div>
            </div>
        
            <div id="home-controls" class="text-center space-y-6 mb-8">
                <h2 id="start-review-label" class="font-extrabold text-xl md:text-2xl lg:text-4xl">Start Reviewing!</h2>
                <div class="flex flex-col md:flex-row gap-4 justify-center">
                    <button id="review-all-sub-btn" class="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300">
                        Review All Subjects
                    </button>
                    <button id="review-subs-btn" class="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300">
                        Review Subject/s
                    </button>
                </div>
            </div>
        </div>
    `,
    subjects: `
        <div class="px-4 md:px-8 lg:px-16 pb-16 min-h-screen pt-24">
            <h2 class="text-lg md:text-2xl lg:text-4xl font-bold mb-4">Subjects:</h2>
            <div class="flex flex-row gap-2 mb-4">
                <input id="new-subject-name" type="text" placeholder="Enter subject name..." class="flex-1 p-2 border rounded dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                <button id="add-subject-btn" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">Add Subject</button>
            </div>
            <div id="subjects-list" class="flex flex-col gap-2"></div>
        </div>
    `,
    questions: `
        <div class="px-4 md:px-8 lg:px-16 pb-16 min-h-screen pt-24">
            <h2 class="text-lg md:text-2xl lg:text-4xl font-bold mb-4">Questions:</h2>
            
            <div class="flex flex-row gap-2 mb-4 max-w-xl">
                <select id="subject-select" class="flex-1 p-2 border rounded dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                    <option value="">-- Choose Subject --</option>
                </select>
                <button id="add-question-btn" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">Add Question</button>
            </div>

            <div id="questions-list" class="flex flex-col gap-2 mb-8"></div>

            <!-- Modal -->
            <div id="question-modal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div class="bg-white dark:bg-neutral-900 p-6 rounded-lg w-full max-w-lg">
                    <h3 class="text-lg font-bold mb-2">Add/Edit Question</h3>
                    <textarea id="question-text" placeholder="Enter question..." class="w-full p-2 border rounded mb-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white resize-none"></textarea>
                    <input id="answer-text" type="text" placeholder="Answer (case-sensitive)" class="w-full p-2 border rounded mb-4 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                    <div class="flex justify-end gap-2">
                        <button id="cancel-question" class="px-4 py-2 bg-neutral-500 text-white rounded hover:bg-neutral-600">Cancel</button>
                        <button id="save-question" class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">Save</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    tutorial: `
        <div class="px-4 md:px-8 lg:px-16 pb-16 min-h-screen pt-24 space-y-10">
            <h2 class="text-3xl font-bold mb-4 text-purple-600 dark:text-purple-400">Quizcet Tutorial</h2>

            <section>
                <h3 class="text-2xl font-semibold mb-2 text-purple-600 dark:text-purple-400">Introduction</h3>
                <p class="text-neutral-800 dark:text-neutral-300 leading-relaxed">
                    Quizcet is a web-based self-quiz system that helps you review your lessons efficiently.
                    Create subjects, add questions, and review them in random order.
                </p>
            </section>

            <section>
                <h3 class="text-2xl font-semibold mb-2 text-purple-600 dark:text-purple-400">Adding Subjects</h3>
                <ol class="list-decimal list-inside space-y-2 text-neutral-800 dark:text-neutral-300">
                    <li>Go to the Subjects page.</li>
                    <li>Enter a new subject name in the input field.</li>
                    <li>Click <span class="bg-green-500 text-white px-2 py-1 rounded">Add Subject</span>.</li>
                    <li>Edit or delete subjects as needed in the list below.</li>
                </ol>
            </section>

            <section>
                <h3 class="text-2xl font-semibold mb-2 text-purple-600 dark:text-purple-400">Adding Questions</h3>
                <ol class="list-decimal list-inside space-y-2 text-neutral-800 dark:text-neutral-300">
                    <li>Select a subject from the dropdown menu.</li>
                    <li>Click <span class="bg-blue-500 text-white px-2 py-1 rounded">Add Question</span>.</li>
                    <li>Enter your question in the textarea. You can use multiple lines.</li>
                    <li>Enter the answer in the input field.</li>
                    <li>Click <span class="bg-purple-500 text-white px-2 py-1 rounded">Save</span> to add the question.</li>
                </ol>
            </section>

            <section>
                <h3 class="text-2xl font-semibold mb-2 text-purple-600 dark:text-purple-400">Reviewing Questions</h3>
                <ul class="list-disc list-inside space-y-2 text-neutral-800 dark:text-neutral-300">
                    <li>Go to the Home page.</li>
                    <li>Click <span class="bg-purple-500 text-white px-2 py-1 rounded">Review All Subjects</span> to review all subjects at once.</li>
                    <li>Click <span class="bg-purple-500 text-white px-2 py-1 rounded">Review Subject/s</span> to select one or more subjects to review.</li>
                    <li>In the modal, you can type to filter subjects and click to select multiple subjects.</li>
                    <li>Type your answer in the input box and submit. The next question appears automatically.</li>
                    <li>Questions are randomized across all selected subjects and shown once before repeating.</li>
                </ul>
            </section>

            <section>
                <h3 class="text-2xl font-semibold mb-2 text-green-600 dark:text-green-400">Import & Export</h3>
                <p class="text-neutral-800 dark:text-neutral-300">
                    You can export or import subjects and questions in two ways:
                </p>
                <ul class="list-disc list-inside space-y-2 text-neutral-800 dark:text-neutral-300">
                    <li>
                        <span class="font-semibold text-green-600 dark:text-green-400">File-based:</span> 
                        Go to Settings → <span class="bg-green-500 text-white px-2 py-1 rounded">Export Subjects to JSON File</span> to download a JSON file, or <span class="bg-blue-500 text-white px-2 py-1 rounded">Import Subjects from JSON File</span> to import.
                    </li>
                    <li>
                        <span class="font-semibold text-green-600 dark:text-green-400">Text-based:</span> 
                        Go to Settings → <span class="bg-green-500 text-white px-2 py-1 rounded">Export Subjects (Copy to Clipboard)</span> to copy JSON text, or <span class="bg-blue-500 text-white px-2 py-1 rounded">Import Subjects from JSON String</span> to paste JSON text directly using a prompt.
                    </li>
                </ul>
            </section>

            <section>
                <h3 class="text-2xl font-semibold mb-2 text-red-600 dark:text-red-400">Clear All Data</h3>
                <p class="text-neutral-800 dark:text-neutral-300">
                    On the Settings page, click <span class="bg-red-600 text-white px-2 py-1 rounded">Clear All Data</span> to delete all subjects and questions. 
                    <span class="font-semibold text-red-600 dark:text-red-400">This action cannot be undone!</span>
                </p>
            </section>

            <section>
                <h3 class="text-2xl font-semibold mb-2 text-purple-600 dark:text-purple-400">Theme Toggle</h3>
                <p class="text-neutral-800 dark:text-neutral-300">
                    Switch between light and dark mode in the Settings page by clicking the theme button.
                </p>
            </section>

            <section>
                <h3 class="text-2xl font-semibold mb-2 text-purple-600 dark:text-purple-400">Tips</h3>
                <ul class="list-disc list-inside space-y-2 text-neutral-800 dark:text-neutral-300">
                    <li>Ensure each subject has at least 5 questions for review mode.</li>
                    <li>Use clear questions and answers for effective self-review.</li>
                    <li>Remove old subjects and questions periodically to stay organized.</li>
                </ul>
            </section>
        </div>
    `,
    settings: `
        <div class="px-4 md:px-8 lg:px-16 min-h-screen pt-24 space-y-12 pb-16">

            <!-- Section 1: Theme Toggle -->
            <section class="space-y-4">
                <h2 class="text-xl md:text-2xl font-semibold text-purple-600 dark:text-purple-400">Theme</h2>
                <div>
                    <button onclick="toggleTheme();" class="bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 px-6 py-2 rounded shadow hover:shadow-lg transition">
                        Light / Dark
                    </button>
                </div>
            </section>

            <hr class="border-neutral-300 dark:border-neutral-600 my-6">

            <!-- Section 2: Import & Export (File) -->
            <section class="space-y-4">
                <h2 class="text-xl md:text-2xl font-semibold text-green-600 dark:text-green-400">Import / Export (File)</h2>
                <div class="flex flex-col md:flex-row gap-4">
                    <button onclick="exportSubjects()" class="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 shadow transition">
                        Export Subjects to JSON File
                    </button>

                    <input type="file" id="import-file" class="hidden" accept="application/json" />
                    <button onclick="document.getElementById('import-file').click()" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 shadow transition">
                        Import Subjects from JSON File
                    </button>
                </div>
            </section>

            <hr class="border-neutral-300 dark:border-neutral-600 my-6">

            <!-- Section 3: Import & Export (Text) -->
            <section class="space-y-4">
                <h2 class="text-xl md:text-2xl font-semibold text-green-600 dark:text-green-400">Import / Export (Text)</h2>
                <div class="flex flex-col md:flex-row gap-4">
                    <button onclick="exportSubjectsAsText();" class="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 shadow transition">
                        Export Subjects (Copy to Clipboard)
                    </button>

                    <button onclick="importSubjectsFromText();" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 shadow transition">
                        Import Subjects from JSON String
                    </button>
                </div>
            </section>

            <hr class="border-neutral-300 dark:border-neutral-600 my-6">

            <!-- Section 4: Clear All Data -->
            <section class="space-y-4">
                <h2 class="text-xl md:text-2xl font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
                <div>
                    <button onclick="clearAllData()" class="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 shadow transition">
                        Clear All Data
                    </button>
                </div>
            </section>

        </div>
    `
};