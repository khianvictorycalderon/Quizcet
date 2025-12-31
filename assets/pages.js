const pages = {
    home: `
        <div class="
            px-4 md:px-8 lg:px-16 pb-4
            min-h-screen
            flex flex-col items-center justify-center
            ">
            
            <div>
                <h2 class="font-extrabold text-xl md:text-2xl lg:text-4xl">GET STARTED!</h2>
                <div class="
                    flex flex-row gap-4 mt-4 w-full 
                    [&>button]:flex-1 [&>button]:cursor-pointer
                    [&>button]:px-6 [&>button]:py-2
                    [&>button]:border-2 [&>button]:border-purple-600 [&>button]:rounded-lg
                    ">
                    <button>Ask All</button>
                    <button>Ask</button>
                </div>
            </div>

        </div>
    `,
    subjects: `
        <div class="
            px-4 md:px-8 lg:px-16 pb-4
            min-h-screen pt-20
            ">
            <h2>This is Subjects page</h2>
        </div>
    `,
    questions: `
        <div class="
            px-4 md:px-8 lg:px-16 pb-4
            min-h-screen pt-20
            ">
            <h2>This is Questions page</h2>
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
                <button id="theme-toggle-button" onclick="toggleTheme();" class="bg-neutral-900 px-6 py-2 text-white rounded cursor-pointer">Dark</button>
            </div>

        </div>
    `
};