
/* =========================================
   SUBJECTS
========================================= */

const subjects = [
    "arabic",
    "english",
    "chemistry",
    "physics",
    "mathematics",
    "german"
];


/* =========================================
   MOTIVATION MESSAGES
   👇 حط جملك هنا
========================================= */

const motivationMessages = [

    "اتعب و استمر وهتلاقي تعبك ده ف الاخر",

    "انت قدها متسمعش كلام حد",

    "برافو عليك! إنجازك النهارده هيعمل فرق كبير 💙",

    "عاش! أنت بتبني نجاحك مهمة ورا مهمة 🚀",

    "مفيش حاجة اسمها مستحيل مع الاستمرار 💯",

    "أنت قدها! كمل وما توقفش 🔥",

    "ممتاز! كل مهمة بتخلصها بتقربك من هدفك 🎯",

    "عاش يا بطل! استمر على نفس المستوى 👏",

    "لا تيأس وانهض لا يليق بك الاستسلام",

    "أحسنت! تعبك النهارده هيفرق معاك بكرة ⭐",
    "فكر ف حلمك هتلاقيه يستاهل تعبك"

];


/* =========================================
   CURRENT FILTER
========================================= */

let currentFilter = "all";


/* =========================================
   GET TASKS
========================================= */

function getTasks(subject) {

    const data =
        localStorage.getItem(
            `tasks_${subject}`
        );

    if (!data) {
        return [];
    }

    try {

        return JSON.parse(data);

    } catch {

        return [];

    }

}


/* =========================================
   SAVE TASKS
========================================= */

function saveTasks(subject, tasks) {

    localStorage.setItem(
        `tasks_${subject}`,
        JSON.stringify(tasks)
    );

}


/* =========================================
   GENERATE ID
========================================= */

function generateId() {

    return Date.now() +
        Math.random()
        .toString(16)
        .slice(2);

}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date =
        new Date(dateString);

    if (isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString(
        "ar-EG",
        {
            day: "numeric",
            month: "short"
        }
    );

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================================
   RENDER ALL
========================================= */

function renderAll() {

    subjects.forEach(
        subject => {

            renderSubject(subject);

        }
    );

    updateDashboard();

    updateAchievements();

}


/* =========================================
   RENDER SUBJECT
========================================= */

function renderSubject(subject) {

    const card =
        document.querySelector(
            `[data-subject="${subject}"]`
        );

    if (!card) {
        return;
    }


    const tasksList =
        card.querySelector(
            ".tasks-list"
        );


    const counter =
        card.querySelector(
            ".task-counter"
        );


    const tasks =
        getTasks(subject);


    const searchValue =
        document
            .getElementById("searchInput")
            .value
            .trim()
            .toLowerCase();


    tasksList.innerHTML = "";


    /* =====================================
       FILTER TASKS
    ====================================== */

    let visibleTasks =
        tasks.filter(task => {

            const matchesSearch =
                task.text
                    .toLowerCase()
                    .includes(searchValue);


            if (!matchesSearch) {
                return false;
            }


            if (
                currentFilter ===
                "completed"
            ) {

                return task.completed;

            }


            if (
                currentFilter ===
                "pending"
            ) {

                return !task.completed;

            }


            return true;

        });


    /* =====================================
       EMPTY
    ====================================== */

    if (
        visibleTasks.length === 0
    ) {

        tasksList.innerHTML = `
            <div class="empty-state">
                ${
                    tasks.length === 0
                    ? "مفيش مهام لسه ✨"
                    : "مفيش مهام مطابقة 🔍"
                }
            </div>
        `;

    }


    /* =====================================
       CREATE TASKS
    ====================================== */

    visibleTasks.forEach(
        task => {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "task";


            if (task.completed) {

                element.classList.add(
                    "completed"
                );

            }


            element.innerHTML = `

                <input
                    type="checkbox"
                    class="task-checkbox"
                    ${
                        task.completed
                        ? "checked"
                        : ""
                    }
                >

                <span class="task-text">
                    ${
                        escapeHTML(
                            task.text
                        )
                    }
                </span>

                ${
                    task.date
                    ?
                    `
                    <span class="task-date">
                        📅 ${
                            formatDate(
                                task.date
                            )
                        }
                    </span>
                    `
                    :
                    ""
                }

                <button
                    class="delete-task"
                    title="حذف المهمة"
                >
                    ×
                </button>

            `;


            /* =================================
               CHECKBOX
            ================================== */

            const checkbox =
                element.querySelector(
                    ".task-checkbox"
                );


            checkbox.addEventListener(
                "change",
                () => {

                    updateTaskStatus(
                        subject,
                        task.id,
                        checkbox.checked
                    );

                }
            );


            /* =================================
               DELETE
            ================================== */

            const deleteButton =
                element.querySelector(
                    ".delete-task"
                );


            deleteButton.addEventListener(
                "click",
                () => {

                    deleteTask(
                        subject,
                        task.id
                    );

                }
            );


            tasksList.appendChild(
                element
            );

        }
    );


    /* =====================================
       COUNTER
    ====================================== */

    const completed =
        tasks.filter(
            task =>
                task.completed
        ).length;


    counter.textContent =
        `${completed}/${tasks.length} مكتملة`;

}


/* =========================================
   ADD TASK
========================================= */

function addTask(
    subject,
    input
) {

    const text =
        input.value.trim();


    if (!text) {

        input.focus();

        return;

    }


    const tasks =
        getTasks(subject);


    const newTask = {

        id:
            generateId(),

        text:
            text,

        completed:
            false,

        date:
            new Date().toISOString(),

        createdDate:
            new Date().toISOString()

    };


    tasks.push(
        newTask
    );


    saveTasks(
        subject,
        tasks
    );


    input.value = "";


    renderAll();

    showToast(
        "تمت إضافة المهمة ✅"
    );


    input.focus();

}


/* =========================================
   UPDATE TASK STATUS
========================================= */

function updateTaskStatus(
    subject,
    taskId,
    completed
) {

    const tasks =
        getTasks(subject);


    const task =
        tasks.find(
            item =>
                item.id === taskId
        );


    if (!task) {
        return;
    }


    task.completed =
        completed;


    if (completed) {

        task.completedDate =
            new Date().toISOString();

    } else {

        delete task.completedDate;

    }


    saveTasks(
        subject,
        tasks
    );


    updateStreak();


    renderAll();


    if (completed) {

        showToast(
            "مهمة مكتملة! 🔥"
        );

    }

}


/* =========================================
   DELETE TASK
========================================= */

function deleteTask(
    subject,
    taskId
) {

    const tasks =
        getTasks(subject);


    const updated =
        tasks.filter(
            task =>
                task.id !== taskId
        );


    saveTasks(
        subject,
        updated
    );


    renderAll();


    showToast(
        "تم حذف المهمة 🗑️"
    );

}


/* =========================================
   DELETE ALL
========================================= */

function deleteAllTasks(
    subject
) {

    const tasks =
        getTasks(subject);


    if (tasks.length === 0) {

        showToast(
            "مفيش مهام لمسحها"
        );

        return;

    }


    const confirmed =
        confirm(
            "هل أنت متأكد إنك عايز تمسح كل مهام المادة؟"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        `tasks_${subject}`
    );


    renderAll();


    showToast(
        "تم مسح كل المهام 🗑️"
    );

}


/* =========================================
   COMPLETE ALL
========================================= */

function completeAll(
    subject
) {

    const tasks =
        getTasks(subject);


    if (tasks.length === 0) {

        alert(
            "أضف مهام الأول 😉"
        );

        return;

    }


    const allCompleted =
        tasks.every(
            task =>
                task.completed
        );


    if (!allCompleted) {

        const remaining =
            tasks.filter(
                task =>
                    !task.completed
            ).length;


        alert(
            `لسه عندك ${remaining} مهمة غير مكتملة ❌`
        );

        return;

    }


    showMotivation();

}


/* =========================================
   RANDOM MOTIVATION
========================================= */

function showMotivation() {

    const randomIndex =
        Math.floor(
            Math.random() *
            motivationMessages.length
        );


    const message =
        motivationMessages[
            randomIndex
        ];


    document.getElementById(
        "motivationText"
    ).textContent =
        message;


    document.getElementById(
        "popup"
    ).classList.add(
        "show"
    );

}


/* =========================================
   DASHBOARD
========================================= */

function updateDashboard() {

    let total = 0;

    let completed = 0;


    subjects.forEach(
        subject => {

            const tasks =
                getTasks(subject);


            total += tasks.length;


            completed +=
                tasks.filter(
                    task =>
                        task.completed
                ).length;

        }
    );


    const remaining =
        total - completed;


    let percent = 0;


    if (total > 0) {

        percent =
            Math.round(
                (
                    completed /
                    total
                ) * 100
            );

    }


    document.getElementById(
        "totalTasks"
    ).textContent =
        total;


    document.getElementById(
        "completedTasks"
    ).textContent =
        completed;


    document.getElementById(
        "remainingTasks"
    ).textContent =
        remaining;


    document.getElementById(
        "progressPercent"
    ).textContent =
        `${percent}%`;


    document.getElementById(
        "progressFill"
    ).style.width =
        `${percent}%`;


    const message =
        document.getElementById(
            "progressMessage"
        );


    if (total === 0) {

        message.textContent =
            "ابدأ أول مهمة ليبدأ الإنجاز! 🚀";

    } else if (percent === 100) {

        message.textContent =
            "مذهل! خلصت كل مهامك 🎉";

    } else if (percent >= 75) {

        message.textContent =
            "قربت جدًا! كمل للنهاية 🔥";

    } else if (percent >= 50) {

        message.textContent =
            "أنت في النص! متوقفش 💪";

    } else {

        message.textContent =
            "كل مهمة بتخلصها بتقربك من هدفك 🎯";

    }

}


/* =========================================
   STREAK
========================================= */

function updateStreak() {

    const dates =
        [];


    subjects.forEach(
        subject => {

            const tasks =
                getTasks(subject);


            tasks.forEach(
                task => {

                    if (
                        task.completed &&
                        task.completedDate
                    ) {

                        const date =
                            task.completedDate
                            .split("T")[0];


                        if (
                            !dates.includes(
                                date
                            )
                        ) {

                            dates.push(
                                date
                            );

                        }

                    }

                }
            );

        }
    );


    dates.sort(
        (a, b) =>
            new Date(b) -
            new Date(a)
    );


    if (dates.length === 0) {

        localStorage.setItem(
            "study_streak",
            "0"
        );

        document.getElementById(
            "streak"
        ).textContent = "0";

        return;

    }


    let streak = 1;


    for (
        let i = 0;
        i < dates.length - 1;
        i++
    ) {

        const current =
            new Date(
                dates[i]
            );


        const previous =
            new Date(
                dates[i + 1]
            );


        const difference =
            (
                current -
                previous
            ) /
            (
                1000 *
                60 *
                60 *
                24
            );


        if (
            difference === 1
        ) {

            streak++;

        } else {

            break;

        }

    }


    /*
       لو آخر إنجاز مش النهارده أو امبارح
       نعتبر الـ streak منتهي.
    */

    const today =
        new Date();


    const todayString =
        today
            .toISOString()
            .split("T")[0];


    const yesterday =
        new Date();


    yesterday.setDate(
        yesterday.getDate() - 1
    );


    const yesterdayString =
        yesterday
            .toISOString()
            .split("T")[0];


    if (
        dates[0] !== todayString &&
        dates[0] !== yesterdayString
    ) {

        streak = 0;

    }


    localStorage.setItem(
        "study_streak",
        streak
    );


    document.getElementById(
        "streak"
    ).textContent =
        streak;

}


/* =========================================
   ACHIEVEMENTS
========================================= */

function updateAchievements() {

    let completed = 0;


    subjects.forEach(
        subject => {

            const tasks =
                getTasks(subject);


            completed +=
                tasks.filter(
                    task =>
                        task.completed
                ).length;

        }
    );


    unlockAchievement(
        "achievement10",
        completed >= 10
    );


    unlockAchievement(
        "achievement50",
        completed >= 50
    );


    unlockAchievement(
        "achievement100",
        completed >= 100
    );


    const streak =
        Number(
            localStorage.getItem(
                "study_streak"
            ) || 0
        );


    unlockAchievement(
        "achievementStreak",
        streak >= 7
    );

}


/* =========================================
   UNLOCK ACHIEVEMENT
========================================= */

function unlockAchievement(
    id,
    unlocked
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {
        return;
    }


    element.classList.toggle(
        "unlocked",
        unlocked
    );

}


/* =========================================
   TOAST
========================================= */

let toastTimer;


function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2000
        );

}


/* =========================================
   THEME
========================================= */

const themeButton =
    document.getElementById(
        "themeButton"
    );


function loadTheme() {

    const theme =
        localStorage.getItem(
            "theme"
        );


    if (theme === "light") {

        document.body.classList.add(
            "light"
        );

        themeButton.textContent =
            "☀️";

    } else {

        themeButton.textContent =
            "🌙";

    }

}


themeButton.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light"
        );


        const isLight =
            document.body.classList.contains(
                "light"
            );


        localStorage.setItem(
            "theme",
            isLight
                ? "light"
                : "dark"
        );


        themeButton.textContent =
            isLight
                ? "☀️"
                : "🌙";

    }
);


/* =========================================
   SEARCH
========================================= */

document
    .getElementById(
        "searchInput"
    )
    .addEventListener(
        "input",
        () => {

            renderAll();

        }
    );


/* =========================================
   FILTERS
========================================= */

document
    .querySelectorAll(
        ".filter-btn"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".filter-btn"
                        )
                        .forEach(
                            btn =>
                                btn.classList
                                    .remove(
                                        "active"
                                    )
                        );


                    button.classList.add(
                        "active"
                    );


                    currentFilter =
                        button.dataset.filter;


                    renderAll();

                }
            );

        }
    );


/* =========================================
   SETUP SUBJECTS
========================================= */

subjects.forEach(
    subject => {

        const card =
            document.querySelector(
                `[data-subject="${subject}"]`
            );


        const input =
            card.querySelector(
                ".task-input"
            );


        const addButton =
            card.querySelector(
                ".add-btn"
            );


        const deleteAllButton =
            card.querySelector(
                ".delete-all-btn"
            );


        const completeAllButton =
            card.querySelector(
                ".complete-all-btn"
            );


        /* =================================
           ADD
        ================================== */

        addButton.addEventListener(
            "click",
            () => {

                addTask(
                    subject,
                    input
                );

            }
        );


        /* =================================
           ENTER
        ================================== */

        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    addTask(
                        subject,
                        input
                    );

                }

            }
        );


        /* =================================
           DELETE ALL
        ================================== */

        deleteAllButton.addEventListener(
            "click",
            () => {

                deleteAllTasks(
                    subject
                );

            }
        );


        /* =================================
           COMPLETE ALL
        ================================== */

        completeAllButton.addEventListener(
            "click",
            () => {

                completeAll(
                    subject
                );

            }
        );

    }
);


/* =========================================
   CLOSE POPUP
========================================= */

document
    .getElementById(
        "closePopup"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "popup"
                )
                .classList.remove(
                    "show"
                );

        }
    );


/* =========================================
   CLOSE POPUP OUTSIDE
========================================= */

document
    .getElementById(
        "popup"
    )
    .addEventListener(
        "click",
        event => {

            if (
                event.target.id ===
                "popup"
            ) {

                event.currentTarget
                    .classList
                    .remove(
                        "show"
                    );

            }

        }
    );


/* =========================================
   INITIALIZE
========================================= */

loadTheme();

updateStreak();

renderAll();

