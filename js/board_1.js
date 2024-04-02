/**
 * Initializes the board by loading internal page and re-rendering tasks.
 * @async
 */
async function initBoard() {
  lockPage();
  await loadInternalPage();
  reRenderTasksInBoard();
  unlockPage();
}

let columnsToDisplay = ['toDo', 'inProgress', 'awaitFeedback', 'done'];

/**
 * Function to re-render tasks in the board.
 */
let reRenderTasksInBoard = () => {
  for (let column of columnsToDisplay) {
    displayTasksInDragArea(column);
  }
};

/**
 * Generates a random color.
 * @returns {string} A randomly generated color.
 */
function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * Handles click event based on window width.
 */
function handleClick() {
  if (window.innerWidth <= 880) {
    window.location.href = 'add_task.html';
  } else {
    openTaskDetailPopup(null, reRenderTasksInBoard);
  }
}

/**
 * Creates the task element.
 * @param {Object} task - The task object.
 * @returns {HTMLElement} The task element.
 */
function createTaskElement(task) {
  let taskElement = document.createElement('div');
  taskElement.classList.add('task');
  taskElement.setAttribute('data-task', task._id);
  addOpenMoveMenu(taskElement, task);
  addMoveMenu(taskElement, task);
  setDraggableAttributes(taskElement);
  addClickEventListener(taskElement, task);
  return taskElement;
}

/**
 * Adds the open-move-menu element to the task element.
 * @param {HTMLElement} taskElement - The task element.
 * @param {Object} task - The task object.
 */
function addOpenMoveMenu(taskElement, task) {
  let openMoveMenu = document.createElement('img');
  openMoveMenu.id = 'open-move-menu';
  openMoveMenu.classList.add('task-img');
  openMoveMenu.src = '../assets/img/ellipsis.png';
  taskElement.appendChild(openMoveMenu);
}

/**
 * Adds the move menu element to the task element.
 * @param {HTMLElement} taskElement - The task element.
 * @param {Object} task - The task object.
 */
function addMoveMenu(taskElement, task) {
  let moveMenu = document.createElement('div');
  moveMenu.id = 'move-menu';
  moveMenu.style.display = 'none';
  if (task.status !== 'done') { addNextTask(moveMenu); }
  if (task.status !== 'toDo') { addPreviousTask(moveMenu); }
  taskElement.appendChild(moveMenu);
}

/**
 * Adds the next task element to the move menu.
 * @param {HTMLElement} moveMenu - The move menu element.
 */
function addNextTask(moveMenu) {
  let nextTask = document.createElement('div');
  nextTask.innerHTML = 'move to next status';
  nextTask.id = 'next-status';
  moveMenu.appendChild(nextTask);
}

/**
 * Adds the previous task element to the move menu.
 * @param {HTMLElement} moveMenu - The move menu element.
 */
function addPreviousTask(moveMenu) {
  let previousTask = document.createElement('div');
  previousTask.innerHTML = 'move to previous status';
  previousTask.id = 'previous-status';
  moveMenu.appendChild(previousTask);
}

/**
 * Sets the drag-and-drop attributes of the task element.
 *
 * @param {HTMLElement} taskElement - The task element.
 */
function setDraggableAttributes(taskElement) {
  taskElement.draggable = true;
}

/**
 * Adds the click event listener to the task element.
 *
 * @param {HTMLElement} taskElement - The task element.
 * @param {Object} task - The task object.
 */
function addClickEventListener(taskElement, task) {
  taskElement.addEventListener('click', (e) => {
    if (e.target.id === 'open-move-menu') {
      toggleMoveMenu(task._id);
    } else if (e.target.id === 'next-status') {
      nextStatus(task);
    } else if (e.target.id === 'previous-status') {
      previousStatus(task);
    } else {
      openTaskQuickLook(getClosureObject(task));
    }
  });
}

/**
 * Toggles the move menu based on the task ID.
 *
 * @param {string} taskId - The ID of the task.
 */
function toggleMoveMenu(taskId) {
  let actualMenu = document.querySelector(`[data-task="${taskId}"] #move-menu`);
  let current = actualMenu.style.display;
  actualMenu.style.display = current === 'none' ? 'flex' : 'none';
}

/**
 * Creates an object containing task-related properties and methods.
 *
 * @param {Object} task - The task object.
 * @returns {Object} An object containing task-related properties and methods.
 */
function getClosureObject(task) {
  return {
    task,
    openDetailPopup: () => {
      openTaskDetailPopup(task._id, reRenderTasksInBoard);
    },
    deleteThisTask: () => deleteTask(task._id),
    prioritySVG: prioritySVGs[task.priority],
    priorityColor: determinePriorityColor(task),
    categoryColor: categoryColors[task.category],
  };
}

/**
 * Moves the task to the next status.
 *
 * @param {Object} task - The task object.
 */
function nextStatus(task) {
  if (task.status === 'toDo') {
    task.status = 'inProgress';
  } else if (task.status === 'inProgress') {
    task.status = 'awaitFeedback';
  } else if (task.status === 'awaitFeedback') {
    task.status = 'done';
  }
  persistTasks(state.tasks, state.currentUser.email);
  reRenderTasksInBoard();
}

/**
 * Moves the task to the previous status.
 *
 * @param {Object} task - The task object.
 */
function previousStatus(task) {
  if (task.status === 'inProgress') {
    task.status = 'toDo';
  } else if (task.status === 'awaitFeedback') {
    task.status = 'inProgress';
  } else if (task.status === 'done') {
    task.status = 'awaitFeedback';
  }
  persistTasks(state.tasks, state.currentUser.email);
  reRenderTasksInBoard();
}

/**
 * Calculates the percentage of completed subtasks.
 *
 * @param {Array} tasks - An array of tasks.
 * @returns {number} The percentage of completed subtasks.
 */
function calculateSubtaskPercentage(tasks) {
  let total = tasks.length;
  if (total === 0) {
    return 0;
  }
  let done = tasks.filter(t => t.done).length;
  return (done / total) * 100;
}

/**
 * Determines the priority color for a task.
 * @param {Object} task - The task object.
 * @returns {string} The color code representing priority.
 */
function determinePriorityColor(task) {
  let priorityColors = {
    'urgent': '#FF3D00',
    'medium': '#FFBE3F',
    'low': '#7AE229'
  };
  return priorityColors[task.priority];
}

/**
 * Creates a div element containing contacts for the task board.
 *
 * @param {Object} task - The task object.
 * @returns {HTMLElement} The div element containing contacts.
 */
function createBoardContactsDiv(task) {
  let contactsDiv = document.createElement('div');
  contactsDiv.style.display = 'flex';
  let contacts = task.contacts;
  if (contacts.length <= 3) {
    appendContactsToDiv(contacts, contactsDiv);
  } else {
    let firstThreeContacts = contacts.slice(0, 3);
    appendContactsToDiv(firstThreeContacts, contactsDiv);
    let remainingCount = contacts.length - 3;
    let remainingText = `+${remainingCount}`;
    let remainingDiv = document.createElement('div');
    remainingDiv.className = 'item-img';
    remainingDiv.textContent = remainingText;
    remainingDiv.style.backgroundColor = '#918e8e';
    contactsDiv.appendChild(remainingDiv);
  }
  return contactsDiv;
}

/**
 * Retrieves the first three contacts associated with the task.
 *
 * @param {Object} task - The task object.
 * @returns {Array} An array of contact IDs.
 */
function getFirstThreeContacts(task) {
  return task.contacts.slice(0, 3);
}

/**
 * Appends contact elements to the specified div.
 *
 * @param {Array} contacts - An array of contact IDs.
 * @param {HTMLElement} div - The div element to which contacts will be appended.
 */
function appendContactsToDiv(contacts, div) {
  for (let contactId of contacts) {
    let contact = getContactById(contactId);
    if (contact === null) { continue; }
    let contactDiv = createContactDiv(contact);
    div.appendChild(contactDiv);
  }
}

/**
 * Creates a div element representing a contact.
 *
 * @param {Object} contact - The contact object.
 * @returns {HTMLElement} The div element representing the contact.
 */
function createContactDiv(contact) {
  let contactDiv = document.createElement('div');
  contactDiv.className = 'boardContact';
  contactDiv.innerHTML = `
    <div class="item-img" style="background-color: ${contact.color}">
      ${contact.initials}
    </div>
  `;
  return contactDiv;
}


/**
 * Displays tasks in drag area based on status.
 * @param {string} status - The status of tasks to display.
 */
function displayTasksInDragArea(status) {
  let dragAreaElement = document.getElementById(`${status}-tasklist`)
  dragAreaElement.innerHTML = '';
  let tasks = state.tasks.filter(t => t.status === status);
  for (let task of tasks) {
    let taskElement = createTaskElement(task);
    taskElement.taskId = task._id;
    let subtaskPercentage = calculateSubtaskPercentage(task.subTasks);
    let priorityColor = determinePriorityColor(task);
    let categoryColor = categoryColors[task.category];
    let maxWidth = task.category === 'Technical Task' ? '144px' : '113px';
    let contactsDiv = createBoardContactsDiv(task);
    taskElement.innerHTML += generateBoardHTML(task, subtaskPercentage, priorityColor, categoryColor, maxWidth, contactsDiv);
    dragAreaElement.appendChild(taskElement);
  }
}

/**
 * Gets the priority color for a task.
 * @param {Object} task - The task object.
 * @returns {string} The color code representing priority.
 */
function getPriorityColor(task) {
  let priorityColors = {
    'urgent': '#FF3D00',
    'medium': '#FFBE3F',
    'low': '#7AE229',
    'default': 'white'
  };
  return priorityColors[task.priority] || priorityColors['default'];
}

/**
 * Gets the category color for a task.
 * @param {Object} task - The task object.
 * @returns {string} The color code representing category.
 */
function getCategoryColor(task) {
  let categoryColors = {
    'Technical Task': 'rgba(31, 215, 193, 1)',
    'User Story': 'rgba(0, 56, 255, 1)',
    'default': 'white'
  };
  return categoryColors[task.categoryText] || categoryColors['default'];
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} string - The input string.
 * @returns {string} The string with first letter capitalized.
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}