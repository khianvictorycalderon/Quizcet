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
        <div class="
            px-4 md:px-8 lg:px-16 pb-4
            min-h-screen pt-24
            ">
            
            <h2 class="text-lg md:text-2xl lg:text-4xl font-bold">Subjects:</h2>
            <div class="flex flex-col gap-2 mt-2">
                
                <div class="flex w-full gap-2">
                    <input 
                        class="flex-[9] bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300 p-3 rounded-lg outline-none
                            focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200
                            dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                        type="text"
                        placeholder="Enter subject name..."
                    >
                    <button 
                        class="flex-[1] bg-red-500 text-white rounded-lg p-3 font-semibold hover:bg-red-600 transition-colors duration-200"
                    >
                        Delete
                    </button>
                </div>

                <button 
                    class="flex-[1] bg-purple-500 text-white rounded-lg p-3 font-semibold hover:bg-purple-600 transition-colors duration-200"
                >
                    Add Subject
                </button>

            </div>

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
                <button onclick="toggleTheme();" class="bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 px-6 py-2 rounded cursor-pointer"
                    <span>Light / Dark</span>
                </button>
            </div>

        </div>
    `
};