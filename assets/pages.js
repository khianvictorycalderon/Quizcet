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
                    [&>button]:border-2 [&>button]:border-purple-600 [&>button]:rounded-lg
                    [&>button:hover]:bg-purple-600/50 [&>button]:transition [&>button]:duration-300
                    [&>button]:text-base md:[&>button]:text-md lg:[&>button]:text-lg
                    [&>button]:font-semibold
                    ">
                    <button>Review All Subjects</button>
                    <button>Review One Subject</button>
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