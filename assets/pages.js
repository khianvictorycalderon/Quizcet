const pages = {
    home: `
        <div class="
            px-4 md:px-8 lg:px-16 pb-4
            min-h-screen
            flex flex-col items-center justify-center
            ">
            
            <div class="text-center">
                <h2 class="font-extrabold text-xl md:text-2xl lg:text-4xl">GET STARTED!</h2>
                <div class="
                    flex flex-row gap-4 mt-4 w-full items-center justify-center align-center
                    [&>button]:flex-1/2 [&>button]:cursor-pointer
                    [&>button]:px-2 [&>button]:py-1
                    md:[&>button]:px-4 md:[&>button]:py-2
                    lg:[&>button]:px-8 lg:[&>button]:py-4
                    [&>button]:rounded-lg
                    [&>button]:transition [&>button]:duration-300
                    [&>button]:text-base md:[&>button]:text-md lg:[&>button]:text-lg
                    [&>button]:font-semibold
                    
                    [&>button]:border-2 [&>button]:border-neutral-900 dark:[&>button]:border-neutral-100
                    [&>button:hover]:bg-purple-600
                    [&>button:hover]:!border-purple-600
                    [&>button:hover]:text-neutral-100

                    ">
                    <button>Review All Subjects</button>
                    <button>Review One Subject</button>
                </div>
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
                    <input id="question-text" type="text" placeholder="Enter question..." class="w-full p-2 border rounded mb-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                    <select id="question-type" class="w-full p-2 border rounded mb-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                        <option value="identification">Identification</option>
                        <option value="multiple">Multiple Choice</option>
                        <option value="truefalse">True / False</option>
                    </select>
                    <div id="answers-container" class="mb-4"></div>
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