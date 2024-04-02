/**
 * Initializes the page content loading.
 * @returns {Promise<void>}
 */
async function init() {
  lockPage();
  let mediumElement = document.getElementById('mediumInput');
  mediumElement.classList.add('clicked');
  await loadInternalPage();
  loadAndRenderContacts();
  unlockPage();
}

/**
 * Shows or hides the overlay header.
 */
function overlayHeaderShow() {
  let overlayHeader = document.getElementById('overlay-header');
  overlayHeader.classList.toggle('overlay-hidden');
}

/**
 * Toggles color of elements based on the provided class.
 * @param {string} elementClass - The class name to toggle.
 */
function toggleColor(elementClass) {
  let elements = document.querySelectorAll('.prio div');
  elements.forEach(el => {
    if (el.classList.contains(elementClass)) {
      if (el.classList.contains('clicked')) {
        el.classList.remove('clicked');
      } else {
        el.classList.add('clicked');
      }
    } else {
      el.classList.remove('clicked');
    }
  });
}

/**
 * Changes color of input element or category container.
 * @param {HTMLElement} inputElementOrContainer - The input element or container.
 */
function changeColor(inputElementOrContainer) {
  let isInput = inputElementOrContainer.tagName === 'INPUT';
  if (isInput) {
    let inputElement = inputElementOrContainer;
    if (inputElement.value.trim() === '') {
      inputElement.classList.add('clicked');
    }
  } else {
    // special case for category container
    let container = inputElementOrContainer;
    let text = container.querySelector('#categoryText');
    if (text.innerHTML === 'Select task category') {
      container.classList.add('clicked');
    }
  }
}

/**
 * Handles category selection.
 * @param {string} text - The category text.
 * @param {HTMLElement} itemElement - The item element.
 */
function handleCategorySelection(text, itemElement) {
  let container = itemElement.closest('.category-container');
  if (text === 'Technical Task' || text === 'User Story') {
    container.classList.remove('clicked');
  }
}

/**
 * Resets the color and border of the input element.
 * @param {HTMLElement} inputElement - The input element to reset.
 */
function resetColor(inputElement) {
  inputElement.classList.remove('clicked');
  inputElement.classList.remove('error');
  inputElement.style.borderColor = '#5DBEE7';
}

/**
 * Handles input events and changes border color accordingly.
 * @param {HTMLElement} inputElement - The input element.
 */
function handleInput(inputElement) {
  if (inputElement.value.trim() === '') {
    inputElement.style.borderColor = '#e96070';
    changeColor(inputElement);
  } else {
    resetColor(inputElement);
  }
}

/**
 * Changes border color of textarea element.
 * @param {HTMLTextAreaElement} textareaElement - The textarea element.
 */
function changeBorderColorDescription(textareaElement) {
  if (textareaElement.value.trim() === '') {
    textareaElement.classList.remove('clicked');
  } else {
    textareaElement.classList.add('clicked');
  }
}

/**
 * Changes border color of select element.
 * @param {HTMLSelectElement} selectElement - The select element.
 */
function changeBorderColor(selectElement) {
  if (selectElement.value !== '0') {
    selectElement.classList.add('clicked');
  } else {
    selectElement.classList.remove('clicked');
  }
}

/**
 * Handles input events and changes color accordingly.
 * @param {HTMLInputElement} inputElement - The input element.
 */
function handleInputWithColorChange(inputElement) {
  if (inputElement.value.trim() === '') {
    inputElement.style.color = 'grey';
    inputElement.style.borderColor = '#e96070';
    changeColor(inputElement);
  } else {
    resetColor(inputElement);
    inputElement.style.color = 'black'
  }
}

/**
 * Adds or removes the 'open' class from the select button when clicked.
 *
 * @param {HTMLElement} selectBtn - The select button element.
 */
let toggleOpen = (selectBtn) => {
  selectBtn.addEventListener("click", () => selectBtn.classList.toggle("open"));
};

/**
 * Updates the text of the select button based on the checked items.
 *
 * @param {string} side - The side of the select button ('left-side' or 'right-side').
 * @param {HTMLElement} item - The item being clicked.
 */
let updateBtnText = (side, item) => {
  let checked = document.querySelectorAll(`.${side} .checked`);
  let btnText = document.querySelector(`.${side} .btn-text`);
  if (checked && checked.length > 0) {
    btnText.innerText = item.querySelector(".item-text").innerText;
  } else {
    btnText.innerText = `Select ${side === 'left-side' ? 'contacts to assign' : 'task category'}`;
  }
};

/**
 * Toggles the 'checked' and 'clicked' classes on item click and updates the button text.
 *
 * @param {string} side - The side of the select button ('left-side' or 'right-side').
 * @param {HTMLElement} item - The item being clicked.
 */
let handleItemClick = (side, item) => {
  item.addEventListener("click", (event) => {
    item.classList.toggle("checked");
    item.classList.toggle("clicked");
    updateBtnText(side, item);
  });
};

/**
 * Closes the select button when clicked outside of it.
 *
 * @param {HTMLElement} selectBtn - The select button element.
 * @param {NodeList} items - The list of items.
 */
let handleOutsideClick = (selectBtn, items) => {
  document.addEventListener('click', function (event) {
    if (!selectBtn.contains(event.target) && !Array.from(items).includes(event.target)) {
      selectBtn.classList.remove("open");
    }
  });
};

/**
 * Sets up the select button functionality.
 *
 * @param {string} side - The side of the select button ('left-side' or 'right-side').
 */
let setupSelect = (side) => {
  let selectBtn = document.querySelector(`.${side} .select-btn`);
  let items = document.querySelectorAll(`.${side} .item`);
  toggleOpen(selectBtn);
  items.forEach(item => handleItemClick(side, item));
  handleOutsideClick(selectBtn, items);
};

document.addEventListener("DOMContentLoaded", function () {
  setupSelect('left-side');
  setupSelect('right-side-addtask');
});


/**
Deletes all input values and performs the reset of the category selection,
the select button, the task container, and the task form.
Then initializes the board anew.
*/
function clearAddTask() {
  clearInputs();
  resetCategory();
  resetSelectButton();
  clearTaskContainers();
  resetTaskForm();
  init();
}

/**
 * Clears the input values and styles of the text fields.
 */
function clearInputs() {
  clearInputValues();
  clearInputStyles();
}

/**
 * Clears the input values of the text fields.
 */
function clearInputValues() {
  let title = document.getElementById("titleInput");
  let description = document.getElementById("descriptionInput");
  let date = document.getElementById("dateInput");
  let urgent = document.getElementById("urgentInput");
  let medium = document.getElementById("mediumInput");
  let low = document.getElementById("lowInput");

  title.value = "";
  description.value = "";
  date.value = "";
  urgent.classList.remove('clicked');
  medium.classList.remove('clicked');
  low.classList.remove('clicked');
}

/**
 * Clears the input styles of the text fields.
 */
function clearInputStyles() {
  let title = document.getElementById("titleInput");
  let description = document.getElementById("descriptionInput"); // Hinzugefügt
  let date = document.getElementById("dateInput");
  title.style.borderColor = "";
  title.classList.remove('clicked');
  description.style.borderColor = ""; // Hinzugefügt
  description.classList.remove('clicked'); // Hinzugefügt
  date.style.borderColor = "";
  date.classList.remove('clicked');
}

/**
 * Resets the category selection.
 */
function resetCategory() {
  let categoryInput = document.querySelector('.category-container');
  categoryInput.style.borderColor = "";
  categoryInput.classList.remove('clicked');
  let categoryTextElement = document.getElementById('categoryText');
  if (categoryTextElement) {
    categoryTextElement.textContent = 'Select task category';
  }
}

/**
 * Resets the select button.
 */
function resetSelectButton() {
  let selectBtn = document.querySelector('.select-btn');
  if (selectBtn) {
    selectBtn.style.borderColor = "#ccc";
  }
  let selectBtn2 = document.querySelector(".right-side .select-btn");
  if (selectBtn2) {
    selectBtn2.classList.remove("open");
  }
}

/**
 * Deletes all task containers on the board.
 */
function clearTaskContainers() {
  let tasksContainer = document.getElementById('tasks');
  while (tasksContainer.firstChild) {
    tasksContainer.removeChild(tasksContainer.firstChild);
  }
  let checkBoxImg = document.querySelector('#checkBoxImg');
  while (checkBoxImg.firstChild) {
    checkBoxImg.removeChild(checkBoxImg.firstChild);
  }
}

/**
 * Resets the task form.
 */
function resetTaskForm() {
  let newTaskForm = document.getElementById('new-task-form');
  newTaskForm.reset();
}

/**
 * Creates an HTML element and adds specific classes and attributes.
 * @param {string} type - The HTML element type, e.g., 'div', 'input', 'img'.
 * @param {string[]} classes - An array of classes to be added to the element.
 * @param {Object} attributes - An object containing attributes of the element.
 * @returns {HTMLElement} The created HTML element.
 */
function createElement(type, classes, attributes) {
  let element = document.createElement(type);
  element.classList.add(...classes);
  for (let attr in attributes) {
    element.setAttribute(attr, attributes[attr]);
  }
  return element;
}

/**
 * Creates an image element (img) and adds a click handler.
 * @param {string} src - The source of the image.
 * @param {string} alt - The alternative text of the image.
 * @param {function} clickHandler - The click handler for the image.
 * @returns {HTMLImageElement} The created image element.
 */
function createImg(src, alt, clickHandler) {
  let imgElement = createElement('img', [], { src, alt });
  imgElement.addEventListener('click', clickHandler);
  return imgElement;
}

/**
 * Creates a text input element (input) with a predefined value and readonly attribute.
 * @param {string} value - The predefined value of the text input element.
 * @returns {HTMLInputElement} The created text input element.
 */
function createTextInput(value) {
  return createElement('input', ['text'], { type: 'text', value, readonly: 'readonly' });
}

/**
 * Creates a subtask element with a text input field, edit and delete icons.
 * @param {string} subtaskValue - The value of the subtask.
 * @returns {HTMLDivElement} The created subtask element.
 */
function createSubtaskElement(subtaskValue) {
  let subtaskElement = createElement('div', ['taskPageAddTask'], {});
  let contentElement = createElement('div', ['content'], {});
  let textInput = createTextInput(subtaskValue);
  textInput.setAttribute('readonly', '');
  contentElement.appendChild(textInput);
  subtaskElement.appendChild(contentElement);
  let actionsElement = createElement('div', ['actions'], {});
  let editImg = createImg('../assets/img/edit_addtask.svg', 'Edit', editClickHandler(textInput, subtaskElement));
  actionsElement.appendChild(editImg);
  let deleteImg = createImg('../assets/img/delete.svg', 'Delete', deleteClickHandler(subtaskElement));
  actionsElement.appendChild(deleteImg);
  subtaskElement.appendChild(actionsElement);
  return subtaskElement;
}

/**
 * Creates a click handler for the edit icon of a subtask.
 * @param {HTMLInputElement} textInput - The text input element of the subtask.
 * @param {HTMLDivElement} subtaskElement - The subtask element.
 * @returns {function} The click handler for the edit icon.
 */
function editClickHandler(textInput, subtaskElement) {
  return function () {
    if (textInput.hasAttribute('readonly')) {
      textInput.removeAttribute('readonly');
      textInput.focus();
      this.src = '../assets/img/check.svg';
      this.style.filter = 'invert(90%)';
    } else if (textInput.value.trim() !== '') {
      textInput.setAttribute('readonly', '');
      this.src = '../assets/img/edit_addtask.svg';
      this.style.filter = 'none';
    } else {
      subtaskElement.remove();
    }
  };
}

/**
 * Creates a click handler for the delete icon of a subtask.
 * @param {HTMLDivElement} subtaskElement - The subtask element.
 * @returns {function} The click handler for the delete icon.
 */
function deleteClickHandler(subtaskElement) {
  return function () {
    subtaskElement.remove();
  };
}