let greetingTime = document.getElementById('greetingTime');
let greetingTimeMobile = document.getElementById('greetingTimeMobile');

/**
 * Retrieves elements from the DOM by their IDs and updates their text content based on the current time and user data.
 * @returns {Promise<void>} A Promise indicating the completion of the initialization process.
 */
async function init() {
    lockPage();
    greetingTime = document.getElementById('greetingTime');
    greetingTimeMobile = document.getElementById('greetingTimeMobile');
    greetingTime.textContent = getGreeting();
    greetingTimeMobile.textContent = getGreeting();
    await loadInternalPage();
    updateTaskNumbers();
    unlockPage();
}

/**
 * Retrieves a greeting message based on the current time.
 * @returns {string} The greeting message.
 */
function getGreeting() {
    let currentDate = new Date();
    let currentTime = currentDate.getHours();
    let greetingText;
    switch (true) {
        case currentTime >= 4 && currentTime < 12:
            greetingText = 'Good morning,';
            break;
        case currentTime >= 12 && currentTime < 17:
            greetingText = 'Good afternoon,';
            break;
        case currentTime >= 17 && currentTime < 23:
            greetingText = 'Good evening,';
            break;
        default:
            greetingText = 'Good night,';
    }
    return greetingText;
}

/**
 * Displays the user's name on the page.
 * @param {object} user - The user object containing the name property.
 */
function displayName(user) {
    let userName = document.getElementById('userName');
    let userNameMobile = document.getElementById('userNameMobile');
    let userLetter = document.getElementById('userLetter');
    let short = user.name.charAt(0).toUpperCase() + user.name.slice(1)
    userName.innerHTML = short;
    userNameMobile.innerHTML = short;
    userLetter.innerHTML = user.name.charAt(0).toUpperCase();
}

/**
 * Updates all task numbers displayed on the UI.
 */
function updateTaskNumbers() {
    updateToDoNumber();
    updateDoneNumber();
    updateUrgentNumber();
    updateAllTasksNumber();
    updateInProgressNumber();
    updateAwaitFeedbackNumber();
    updateUpcomingDeadline();
}

/**
 * Updates the number of tasks in the 'ToDo' status displayed on the UI.
 */
function updateToDoNumber() {
    /** @type {HTMLSpanElement} */
    let toDoNumber = document.getElementById('toDo');
    let toDoTasks = state.tasks.filter(t => t.status === 'toDo');
    toDoNumber.innerHTML = toDoTasks.length;
}

/**
 * Updates the number of tasks in the 'Done' status displayed on the UI.
 */
function updateDoneNumber() {
    /** @type {HTMLSpanElement} */
    let doneNumber = document.getElementById('done');
    let doneTasks = state.tasks.filter(t => t.status === 'done');
    doneNumber.innerHTML = doneTasks.length;
}

/**
 * Updates the number of tasks with 'urgent' priority displayed on the UI.
 */
function updateUrgentNumber() {
    /** @type {HTMLSpanElement} */
    let urgentNumber = document.getElementById('urgent');
    let urgentTasks = state.tasks.filter(t => t.priority === 'urgent');
    urgentNumber.innerHTML = urgentTasks.length;
}

/**
 * Updates the total number of tasks displayed on the UI.
 */
function updateAllTasksNumber() {
    /** @type {HTMLSpanElement} */
    let allTasksNumber = document.getElementById('allTasks');
    let allTasks = state.tasks.length;
    allTasksNumber.innerHTML = allTasks;
}

/**
 * Updates the number of tasks in the 'InProgress' status displayed on the UI.
 */
function updateInProgressNumber() {
    /** @type {HTMLSpanElement} */
    let inProgressNumber = document.getElementById('inProgress');
    let inProgressTasks = state.tasks.filter(t => t.status === 'inProgress');
    inProgressNumber.innerHTML = inProgressTasks.length;
}

/**
 * Updates the number of tasks in the 'AwaitFeedback' status displayed on the UI.
 */
function updateAwaitFeedbackNumber() {
    /** @type {HTMLSpanElement} */
    let awaitFeedbackNumber = document.getElementById('awaitFeedback');
    let awaitFeedbackTasks = state.tasks.filter(t => t.status === 'awaitFeedback');
    awaitFeedbackNumber.innerHTML = awaitFeedbackTasks.length;
}

/**
 * Updates the upcoming deadline displayed on the UI.
 */
function updateUpcomingDeadline() {
    /** @type {HTMLParagraphElement} */
    let upcomingContainer = document.querySelector('.upcomingDeadline > p');
    let closestDeadline = findClosestDeadline(state.tasks.filter(t => t.priority === 'urgent'));
    upcomingContainer.innerHTML = closestDeadline;
}

/**
 * Toggles the visibility of the overlay header element.
 */
function overlayHeaderShow() {
    let overlayHeader = document.getElementById('overlay-header');
    overlayHeader.classList.toggle('overlay-hidden');
}

/**
 * Find the closest deadline from a list of tasks.
 * @param {Array<{ date: string }>} tasks - An array of tasks with a 'date' property representing the deadline.
 * @returns {string} - A formatted string representing the closest deadline, or 'No urgent deadlines' if no tasks are provided.
 */
function findClosestDeadline(tasks) {
    if (tasks.length === 0) return 'No urgent deadlines';
    let closestDeadline = new Date(Math.min(...tasks.map(task => new Date(task.date).getTime())));
    return closestDeadline.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Redirects to the board page with a specific section based on the provided ID.
 * If the window width is greater than 1460 pixels, the page is navigated directly.
 * Otherwise, it opens in the same tab.
 *
 * @param {number} id - The ID of the section to navigate to.
 */
function toBoard(id) {
    let redirectUrl = "board.html";
    if (id === 1) redirectUrl += "#toDo";
    else if (id === 2) redirectUrl += "#inProgress";
    else if (id === 3) redirectUrl += "#awaitFeedback";
    else if (id === 4) redirectUrl += "#done";
    if (window.innerWidth > 1460) {
        window.location.href = redirectUrl;
    } else {
        window.open(redirectUrl, "_self");
    }
}