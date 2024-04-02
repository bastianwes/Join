
/**
 * Adds a new subtask if the input value is not empty.
 */
function addSubtask() {
  let newTaskInput = document.getElementById('new-task-input');
  let tasksContainer = document.getElementById('tasks');
  let subtaskValue = newTaskInput.value.trim();
  if (subtaskValue !== '') {
    let subtaskElement = createSubtaskElement(subtaskValue);
    tasksContainer.appendChild(subtaskElement);
    newTaskInput.value = '';
  }
}

/**
 * Reads the inputs for a task from the corresponding DOM elements.
 * @returns {Object} An object containing the inputs for the task.
 */
function getTaskInputs() {
  let category = document.getElementById("categoryText").innerText;
  let title = document.getElementById("titleInput").value;
  let description = document.getElementById("descriptionInput").value;
  let date = document.getElementById("dateInput").value;
  let selectedPriority = findSelectedPriority();
  let selectedContacts = JSON.parse(localStorage.getItem('selectedContacts')) || [];
  return { category, title, description, date, selectedPriority, selectedContacts };
}

/**
 * Extracts the inputs for subtasks from the DOM.
 * @returns {Array} An array containing the inputs for the subtasks.
 */
function getSubtasks() {
  let subtasks = [];
  let tasksContainer = document.getElementById("tasks");
  let subtaskElements = tasksContainer.getElementsByClassName("taskPageAddTask");
  for (let subtaskElement of subtaskElements) {
    let subtaskText = subtaskElement.querySelector('.text').value;
    subtasks.push(subtaskText);
  }
  return subtasks;
}

/**
 * Validates the inputs for a task.
 * @param {string} title - The title of the task.
 * @param {string} category - The category of the task.
 * @param {string} date - The date of the task.
 * @returns {boolean} Returns true if the inputs are valid, otherwise false.
 */
function validateInputs(title, category, date) {
  if (title.trim() === '' || category === 'Select task category' || date.trim() === '') {
    let titleInput = document.querySelector('.title input');
    let dateInput = document.querySelector('.date input');
    let categoryInput = document.querySelector('.category-container');
    changeColor(titleInput);
    changeColor(dateInput);
    changeColor(categoryInput);
    return false;
  }
  return true;
}

/**
 * Creates an object for a new task with the specified data.
 * @param {string} category - The category of the task.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} date - The date of the task.
 * @param {Object} selectedPriority - The selected priority object.
 * @param {Array} subtasks - An array of subtasks.
 * @param {Array} selectedContacts - An array of selected contacts.
 * @returns {Object} The created task object.
 */
function createTaskObject(category, title, description, date, selectedPriority, subtasks, selectedContacts) {
  return {
    _id: Date.now(),
    category: category,
    title: title,
    description: description,
    date: date,
    priority: selectedPriority.priority,
    subTasks: subtasks.map(title => ({ title, done: false })),
    contacts: selectedContacts.map(s => s.contactId),
    status: 'toDo',
  };
}

function createTask() {
  let { category, title, description, date, selectedPriority, selectedContacts } = getTaskInputs();
  let subtasks = getSubtasks();
  if (!validateInputs(title, category, date)) return;
  let task = createTaskObject(category, title, description, date, selectedPriority, subtasks, selectedContacts);
  state.tasks.push(task);
  selectedContacts = [];
  localStorage.setItem('selectedContacts', JSON.stringify(selectedContacts));
  persistTasks(state.tasks, state.currentUser.email);
  addTaskPopup();
  clearAddTask();
  init();
  switchLocation(0);
}

/**
 * Finds the selected priority of the task.
 * @returns {Object} Object containing priority and SVG element.
 */
function findSelectedPriority() {
  let priorities = ['urgent', 'medium', 'low'];
  for (let priority of priorities) {
    let element = document.getElementById(priority + 'Input');
    if (element.classList.contains('clicked')) {
      let svgElement = element.querySelector('svg').outerHTML;
      return { priority: priority, svg: svgElement };
    }
  }
  return { priority: '', svg: '' };
}

/**
 * Displays a popup message indicating the task has been added to the board.
 */
function addTaskPopup() {
  let popup = document.createElement('div');
  popup.className = 'popup';
  popup.innerHTML = '<h3 style="color: white; margin-right: 30px;">Task added to board</h3><svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.9575 5.73855L22.9575 26.1929C22.9569 26.7955 22.7173 27.3732 22.2912 27.7993C21.8651 28.2253 21.2874 28.465 20.6848 28.4656L16.1394 28.4656C15.5368 28.465 14.9591 28.2253 14.533 27.7993C14.1069 27.3732 13.8673 26.7955 13.8667 26.1929L13.8667 5.73855C13.8673 5.13597 14.1069 4.55825 14.533 4.13217C14.9591 3.70608 15.5368 3.46644 16.1394 3.46584L20.6848 3.46584C21.2874 3.46644 21.8651 3.70608 22.2912 4.13217C22.7173 4.55825 22.9569 5.13597 22.9575 5.73855ZM16.1394 26.1929L20.6848 26.1929L20.6848 5.73855L16.1394 5.73855L16.1394 26.1929ZM16.1394 5.73855L16.1394 26.1929C16.1388 26.7955 15.8992 27.3731 15.4731 27.7992C15.047 28.2253 14.4693 28.4649 13.8667 28.4655L9.32128 28.4655C8.71871 28.4649 8.14099 28.2253 7.7149 27.7992C7.28882 27.3731 7.04918 26.7954 7.04858 26.1928L7.04858 5.73852C7.04918 5.13595 7.28882 4.55823 7.7149 4.13214C8.14099 3.70606 8.71871 3.46642 9.32128 3.46582L13.8667 3.46582C14.4693 3.46642 15.047 3.70606 15.4731 4.13214C15.8992 4.55823 16.1388 5.13597 16.1394 5.73855ZM9.32128 26.1928L13.8667 26.1929L13.8667 5.73855L9.32128 5.73852L9.32128 26.1928ZM9.32128 5.73852L9.32128 26.1928C9.32068 26.7954 9.08104 27.3731 8.65496 27.7992C8.22887 28.2253 7.65115 28.4649 7.04858 28.4656L2.50317 28.4656C1.9006 28.4649 1.32288 28.2253 0.896793 27.7992C0.470708 27.3731 0.23107 26.7954 0.230469 26.1928L0.230468 5.73852C0.231069 5.13595 0.470707 4.55823 0.896792 4.13214C1.32288 3.70606 1.9006 3.46642 2.50317 3.46582L7.04858 3.46582C7.65115 3.46642 8.22887 3.70606 8.65496 4.13214C9.08104 4.55823 9.32068 5.13595 9.32128 5.73852ZM2.50317 26.1928L7.04858 26.1928L7.04858 5.73852L2.50317 5.73852L2.50317 26.1928Z" fill="white"/><path d="M29.7756 5.7388L29.7756 26.1931C29.775 26.7957 29.5354 27.3734 29.1093 27.7995C28.6832 28.2256 28.1055 28.4652 27.5029 28.4658L22.9575 28.4658C22.3549 28.4652 21.7772 28.2256 21.3511 27.7995C20.925 27.3734 20.6854 26.7955 20.6848 26.1929L20.6848 5.73855C20.6854 5.13597 20.925 4.5585 21.3511 4.13242C21.7772 3.70633 22.3549 3.4667 22.9575 3.46609L27.5029 3.46609C28.1055 3.4667 28.6832 3.70633 29.1093 4.13242C29.5354 4.5585 29.775 5.13622 29.7756 5.7388ZM22.9575 26.1929L27.5029 26.1931L27.5029 5.7388L22.9575 5.73855L22.9575 26.1929Z" fill="white"/></svg>';
  document.body.appendChild(popup);
  setTimeout(function () {
    popup.style.bottom = '50%';
    popup.style.opacity = '1';
  }, 100);
  setTimeout(function () {
    popup.style.opacity = '0';
  }, 1000);
}

/**
 * Switches the location after a specified time delay if the counter is zero.
 * @param {number} counter - The counter value.
 */
function switchLocation(counter) {
  if (counter == 0) {
    counter = 1;
    setTimeout(function () {
      switchLocation(counter);
    }, 1000);
  } else {
    window.location = "../html/board.html";
  }
}

let contactImg = [];
let selectedContacts = JSON.parse(localStorage.getItem('selectedContacts')) || [];

/**
 * Creates and returns a list item element representing a contact.
 * @param {Object} contact - The contact object.
 * @returns {HTMLLIElement} The created list item element.
 */
function createListItem(contact) {
  let listItem = document.createElement('li');
  listItem.className = 'item';
  listItem.style.color = 'black'; // default font color
  listItem.innerHTML = `<div class="item-img" style="background-color: ${contact.color}">${contact['initials']}</div>
                        <div class="itemAndCheckbox">
                            <span class="item-text">${contact['add-name']}</span>
                            <span class="checkbox">
                                <i class="fa-solid fa-check check-icon"></i>
                            </span>
                        </div>`;
  return listItem;
}

/**
 * Changes the state of the given element and updates the display accordingly.
 * @param {Event} event - The triggering event.
 * @param {HTMLElement} element - The HTML element whose state should be changed.
 * @param {Object} contact - The contact object corresponding to the element.
 * @param {HTMLElement} checkBoxImg - The container element for the contact images.
 */
function toggleCheckedState(event, element, contact, checkBoxImg) {
  event.stopPropagation();
  element.classList.toggle('checked');
  element.style.backgroundColor = element.classList.contains('checked') ? '#2A3647' : '';
  element.style.color = element.classList.contains('checked') ? 'white' : 'black';
  if (element.classList.contains('checked')) {
    createAndAppendNewImg(contact, checkBoxImg);
    selectedContacts.push(contact);
  } else {
    removeContactImg(contact, checkBoxImg);
  }
  localStorage.setItem('selectedContacts', JSON.stringify(selectedContacts));
}

/**
 * Removes the image of the specified contact from the container for contact images.
 * @param {Object} contact - The contact object whose image should be removed.
 * @param {HTMLElement} checkBoxImg - The container element for the contact images.
 */
function removeContactImg(contact, checkBoxImg) {
  let imgToRemove = Array.from(checkBoxImg.children).find(img => img.textContent === contact['initials']);
  if (imgToRemove) {
    checkBoxImg.removeChild(imgToRemove);
    contactImg = contactImg.filter(img => img !== imgToRemove);
    selectedContacts = selectedContacts.filter(selectedContact => selectedContact !== contact);
  }
}

/**
 * Changes the state of the contact and updates the display accordingly.
 * @param {Event} event - The triggering event.
 * @param {Object} contact - The contact object whose state should be changed.
 */
function toggleContact(event, contact) {
  let checkBoxImg = document.querySelector('#checkBoxImg');
  toggleCheckedState(event, this, contact, checkBoxImg);
}

/**
 * Loads contacts from the server and renders them on the page.
 */
async function loadAndRenderContacts() {
  let allContacts = state.contacts;
  let contactList = document.querySelector('.list-items');
  contactList.innerHTML = '';
  allContacts.forEach(contact => {
    let listItem = createListItem(contact);
    listItem.addEventListener('click', function (event) {
      toggleContact.call(this, event, contact);
    });
    contactList.appendChild(listItem);
  });
}

/**
 * Creates a new image element representing a contact and appends it to the checkbox area.
 * @param {Object} contact - The contact object.
 * @param {HTMLElement} checkBoxImg - The container element for checkbox images.
 * @returns {HTMLElement} The created image element.
 */
function createAndAppendNewImg(contact, checkBoxImg) {
  let newItemImg = document.createElement('div');
  newItemImg.className = 'item-img';
  newItemImg.style.backgroundColor = contact.color;
  newItemImg.textContent = contact['initials'];
  checkBoxImg.appendChild(newItemImg);
  contactImg.push(newItemImg);
  return newItemImg;
}


