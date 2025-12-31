const pages = {
    home: `
        <div class="
            px-4 md:px-8 lg:px-16 pb-4
            min-h-screen
            flex flex-col items-center justify-center
        ">
            <div class="text-center space-y-6">
                <h2 class="font-extrabold text-xl md:text-2xl lg:text-4xl">Start Reviewing!</h2>

                <div class="flex flex-col md:flex-row gap-4 justify-center">
                    <button id="review-all-btn" class="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300">Review All Subjects</button>
                    <button id="review-one-btn" class="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300">Review One Subject</button>
                </div>

                <div id="home-questions-container" class="mt-8 w-full max-w-2xl"></div>
            </div>
        </div>
    `,
    subjects: `
        <div class="px-4 md:px-8 lg:px-16 pb-4 min-h-screen pt-24">
            <h2 class="text-lg md:text-2xl lg:text-4xl font-bold mb-4">Subjects:</h2>
            <div class="flex flex-row gap-2 mb-4">
                <input id="new-subject-name" type="text" placeholder="Enter subject name..." class="flex-1 p-2 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <button id="add-subject-btn" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">Add Subject</button>
            </div>
            <div id="subjects-list" class="flex flex-col gap-2"></div>
        </div>
    `,
    questions: `
        <div class="px-4 md:px-8 lg:px-16 pb-4 min-h-screen pt-20">
            <h2 class="text-lg md:text-2xl lg:text-4xl font-bold mb-4">Questions:</h2>
            
            <div class="flex flex-row gap-2 mb-4 max-w-xl">
                <select id="subject-select" class="flex-1 p-2 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                    <option value="">-- Choose Subject --</option>
                </select>
                <button id="add-question-btn" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">Add Question</button>
            </div>

            <div id="questions-list" class="flex flex-col gap-2 mb-8"></div>

            <!-- Modal -->
            <div id="question-modal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-lg">
                    <h3 class="text-lg font-bold mb-2">Add/Edit Question</h3>
                    <textarea id="question-text" placeholder="Enter question..." class="w-full p-2 border rounded mb-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white resize-none"></textarea>
                    <textarea id="answer-text" placeholder="Answer (case-insensitive)" class="w-full p-2 border rounded mb-4 dark:border-gray-700 dark:bg-gray-800 dark:text-white resize-none"></textarea>
                    <div class="flex justify-end gap-2">
                        <button id="cancel-question" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
                        <button id="save-question" class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">Save</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    tutorial: `
        <div class="
            px-4 md:px-8 lg:px-16 pb-4
            min-h-screen pt-20
            ">
            <h2>This is Tutorial page</h2>
        </div>
    `,
    settings: `
        <div class="
            px-4 md:px-8 lg:px-16 pb-4
            min-h-screen pt-32
            ">
            
            <div>
                <span>Set Theme: </span>
                <button onclick="toggleTheme();" class="bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 px-6 py-2 rounded cursor-pointer"
                    <span>Light / Dark</span>
                </button>
            </div>

        </div>
    `
};