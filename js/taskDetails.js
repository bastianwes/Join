/**
 * Function returning a string representing the HTML template for task details popup.
 * @type {Function}
 */
function taskDetails() {
  return `
  <div class="boardPage-add-task-headline">
      <h1 id="popupTitle"></h1>
      <div class="xmark"><i class="fa-solid fa-xmark"></i></div>
    </div>
  <div class="popupWrapper" id="editPopup">
    <section class="boardPage-add-task" id="boardPage-add-task-board">
      <div class="left-side" id="left-side-id">
        <div class="titleBoardPage">
          <span>Title</span>
          <input
            id="titleInput"
            type="text"
            placeholder="Enter a title"
          >
          <div class="dateErrorMessageBoardPage" id="date-error-message">*This field is required</div>
        </div>
        <div class="description">
          <span>Description</span>
          <textarea
            id="descriptionInput"
            cols="30"
            rows="5"
            placeholder="Enter a Description">
          </textarea>
        </div>
        <div class="assign-container">
          <p>Assigned to</p>
            <div class="select-btn" id="contact-select">
              <span class="btn-text">Select contacts to assign</span>
              <span class="arrow-dwn">
                <i class="fa-solid fa-caret-down"></i>
              </span>
            </div>
            <ul class="list-items">
${state.contacts.map(contact => {
    return `
  <li class="item" data-id="${contact.contactId}">
    <div class="item-img" style="background-color: ${contact.color}">
      ${contact.initials}
    </div>
    <div class="itemAndCheckbox">
      <span class="item-text">${contact['add-name']}</span>
      <span class="checkbox">
        <i class="fa-solid fa-check check-icon"></i>
      </span>
    </div>
  </li>`;
  }).join('')
    }
                </ul>
                <div class="checkBoxImg" id="checkBoxImg"></div>
            </div>
        </div>
        <div class="right-side-addtask" id="right-side-id">
            <div class="date">
                <span>Due date</span>
                <input type="date" min="2024-03-20" id="dateInput">
                <div class="dateErrorMessage" id="date-error-message">*This field is required</div>
            </div>
            <div class="prio" >
                <span id="priority">Prio</span>
                <div class="all-priority">
                    <div class="priorityUrgent" id="urgentInput">
                        Urgent
                        ${prioritySVGs.urgent}
                    </div>
                    <div class="priorityMedium" id="mediumInput">
                        Medium
                        ${prioritySVGs.medium}
                    </div>
                    <div class="priorityLow" id="lowInput">
                        Low
                        ${prioritySVGs.low}
                    </div>
                </div>
            </div>
            <div class="category-container">
                <p>Category</p>
                <div class="select-btn" id="category-selector">
                    <span class="btn-text" id="categoryText"></span>
                    <span class="arrow-dwn">
                        <i class="fa-solid fa-caret-down"></i>
                    </span>
                </div>
                <ul class="list-items">
                    <li class="item" id="select-technical-task" onclick="handleCategorySelection('Technical Task', this)">
                        <span class="item-text">Technical Task</span>

                    </li>
                    <li class="item" id="select-user-story" onclick="handleCategorySelection('User Story', this)">
                        <span class="item-text">User Story</span>
                    </li>
                </ul>
            </div>
            <div class="categoryErrorMessage">*This field is required</div>
            <div class="subtask">
                <p>Subtasks</p>
                <form id="new-task-form" class="subtask-content">
                    <input type="text" name="new-task-input" id="new-task-input" placeholder="Add a new subtask"
                        required />
                    <i class="fa-solid fa-plus plus-symbol"></i>
                </form>
                <main>
                    <section class="task-list">
                        <div id="subtaskList"></div>
                    </section>
                </main>
            </div>
        </div>
    </section>
  </div>
  <div class="boardPage-required-field-and-button" id="save-section">
        <div class="required-field">
            <p>This field is required</p>
        </div>
        <div class="clearAndCreate">
            <button class="clear-button">Cancel
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12.2496 11.9998L17.4926 17.2428M7.00659 17.2428L12.2496 11.9998L7.00659 17.2428ZM17.4926 6.75684L12.2486 11.9998L17.4926 6.75684ZM12.2486 11.9998L7.00659 6.75684L12.2486 11.9998Z"
                        stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </button>
            <button class="create-button" id="commit-task-button">
              Create Task
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.2496 11.9998L17.4926 17.2428M7.00659 17.2428L12.2496 11.9998L7.00659 17.2428ZM17.4926 6.75684L12.2486 11.9998L17.4926 6.75684ZM12.2486 11.9998L7.00659 6.75684L12.2486 11.9998Z" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
            </button>
        </div>
    </div>
  `;
}

/**
 * Function returning a HTML element representing a contact avatar.
 * @type {Function}
 */
function contactAvatar(contact) {
  let newItemImg = document.createElement('div');
  newItemImg.className = 'item-img';
  newItemImg.style.backgroundColor = contact.color;
  newItemImg.textContent = contact.initials;
  return newItemImg;
}

/**
 * Creates a subtask entry element.
 * @param {Object} task - The task object containing title information.
 * @param {Function} onDelete - The function to call when deleting the subtask or clearing it if the title is empty.
 * @param {Function} onChange - The function to call when the title of the subtask changes.
 * @returns {HTMLElement} The created subtask entry element.
 */
function createSubtaskEntry(task, onDelete, onChange) {
  let subtask = createSubtaskElement();
  addMouseOverListener(subtask, onDelete);
  addMouseOutListener(subtask);
  let content = createContentElement();
  let inputElement = createInputElement(task.title);
  let actions = createActionsElement();
  let editImg = createEditImage(inputElement, onChange);
  let deleteImg = createDeleteImage(onDelete);
  appendElements(subtask, content, actions);
  appendElements(content, inputElement);
  appendElements(actions, editImg, deleteImg);
  return subtask;
}

/**
 * Creates the main element for a subtask.
 * @returns {HTMLElement} The created subtask element.
 */
function createSubtaskElement() {
  let subtask = document.createElement('div');
  subtask.classList.add('taskPageAddTask');
  return subtask;
}

/**
 * Adds a mouseover event listener to a subtask element, triggering onDelete function when the input element is empty.
 * @param {HTMLElement} subtask - The subtask element to which the mouseover event listener is added.
 * @param {Function} onDelete - The function to be called when the input element is empty.
 */
function addMouseOverListener(subtask, onDelete) {
  subtask.addEventListener('mouseover', function () {
    let inputElement = this.querySelector('.text');
    if (inputElement.value.trim() === '') {
      if (onDelete && typeof onDelete === 'function') {
        onDelete();
      }
    } else {
      inputElement.style.backgroundColor = '';
    }
  });
}

/**
 * Fügt einen Mouseout-Listener zum Subtask-Element hinzu.
 * @param {HTMLElement} subtask - Das Subtask-Element.
 */
function addMouseOutListener(subtask) {
  subtask.addEventListener('mouseout', function () {
    let inputElement = this.querySelector('.text');
    inputElement.style.backgroundColor = 'white';
  });
}

/**
 * Adds a mouseout listener to the subtask element.
 * @param {HTMLElement} subtask - The subtask element.
 */
function createContentElement() {
  let content = document.createElement('div');
  content.classList.add('content');
  return content;
}

/**
 * Creates an input element for the title of a subtask.
 * @param {string} title - The title of the subtask.
 * @returns {HTMLInputElement} The created input element.
 */
function createInputElement(title) {
  let inputElement = document.createElement('input');
  inputElement.type = 'text';
  inputElement.classList.add('text');
  inputElement.value = title;
  inputElement.style.backgroundColor = 'white';
  inputElement.setAttribute('readonly', 'readonly');
  return inputElement;
}

/**
 * Creates the actions element for a subtask.
 * @returns {HTMLElement} The created actions element.
 */
function createActionsElement() {
  let actions = document.createElement('div');
  actions.classList.add('actions');
  return actions;
}

/**
 * Creates the edit image for a subtask.
 * @param {HTMLInputElement} inputElement - The input element of the subtask.
 * @param {Function} onChange - The function that is called when the title is changed.
 * @returns {HTMLImageElement} The created edit image.
 */
function createEditImage(inputElement, onChange) {
  let editImg = document.createElement('img');
  editImg.src = '../assets/img/edit_addtask.svg';
  editImg.alt = 'Edit';
  editImg.addEventListener('click', () => {
    if (inputElement.getAttribute('readonly') === null) {
      inputElement.setAttribute('readonly', 'readonly');
      editImg.src = '../assets/img/edit_addtask.svg';
      editImg.alt = 'Edit';
      editImg.style.filter = 'none';
      onChange(inputElement.value);
    } else {
      inputElement.removeAttribute('readonly');
      inputElement.focus();
      editImg.src = '../assets/img/check.svg';
      editImg.style.filter = 'invert(90%)';
      editImg.alt = 'Save';
    }
  });
  return editImg;
}

/**
 * Creates the delete image for a subtask.
 * @param {Function} onDelete - The function that is called when the subtask is deleted.
 * @returns {HTMLImageElement} The created delete image.
 */
function createDeleteImage(onDelete) {
  let deleteImg = document.createElement('img');
  deleteImg.src = '../assets/img/delete.svg';
  deleteImg.alt = 'Delete';
  deleteImg.addEventListener('click', onDelete);
  return deleteImg;
}

/**
 * Adds multiple elements to a parent element.
 * @param {HTMLElement} parentElement - The parent element.
 * @param  {...HTMLElement} elements - The elements to be added.
 */
function appendElements(parentElement, ...elements) {
  elements.forEach(element => parentElement.appendChild(element));
}


/**
 * Function to handle category selection.
 * @param {string} text - The text of the selected category.
 * @param {HTMLElement} itemElement - The HTML element representing the selected category item.
 */
function handleCategorySelection(text, itemElement) {
  let container = itemElement.closest('.category-container');
  if (text === 'Technical Task' || text === 'User Story') {
    container.classList.remove('clicked');
  }
}

/**
 * Function returning the initial state for task details.
 * @type {Function}
 */
function initialState(task) {
  return {
    category: task === null ? null : task.category,
    title: task === null ? '' : task.title,
    description: task === null ? '' : task.description,
    date: task === null ? '' : task.date,
    priority: task === null ? 'medium' : task.priority,
    subTasks: task === null ? [] : task.subTasks,
    contacts: task === null ? [] : task.contacts,
  };
}

function getClickables(root) {
  return {
    saveButton: root.querySelector('.create-button'),
    clearButton: root.querySelector('.clear-button'),
    closeButton: root.querySelector('.xmark'),
    low: root.querySelector('#lowInput'),
    medium: root.querySelector('#mediumInput'),
    urgent: root.querySelector('#urgentInput'),
    cancelButton: root.querySelector('.clear-button'),
    addSubtask: root.querySelector('#new-task-form i'),
    plusSymbol: root.querySelector('.plus-symbol'),
  };
}

function getDisplays(root) {
  return {
    popupTitle: root.querySelector('#popupTitle'),
    headLine: root.querySelector('.boardPage-add-task-headline'),
    requiredField: root.querySelector('.required-field'),
    assignedContactList: root.querySelector('#checkBoxImg'),
    priority: root.querySelector('#priority'),
  };
}

function getSelects(root) {
  let boardPageAddTask = root.querySelector('.boardPage-add-task');
  return {
    categorySelector: root.querySelector('#category-selector'),
    saveSection: root.querySelector('#save-section'),
    boardPageAddTask,
    leftRightSections: boardPageAddTask.children,
    categoryContainer: root.querySelector('.category-container'),
    subtaskList: root.querySelector('#subtaskList'),
    userStory: root.querySelector("#select-user-story"),
    technicalTask: root.querySelector("#select-technical-task"),
    contactsDropdown: root.querySelector('#contact-select'),
  };
}

function getInputs(root) {
  return {
    dateInput: root.querySelector('#dateInput'),
    descriptionInput: root.querySelector('#descriptionInput'),
    titleInput: root.querySelector('#titleInput'),
    subtaskInput: root.querySelector('#new-task-form input'),
  };
}

/**
* Function setting up the state for task details.
* @type {Function}
*/
function setupState(root, closure) {
  let { task } = closure;
  return {
    ...getClickables(root),
    ...getDisplays(root),
    ...getInputs(root),
    ...getSelects(root),
    taskWIP: initialState(task),
    contactDropdownOpen: false,
    categoryDropdownOpen: false,
    originalTask: task,
    isCreate: task === null,
    isValid: false,
  };
}