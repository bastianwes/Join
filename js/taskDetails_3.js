/**
 * Adds event listeners for the contact dropdown.
 * @param {Object} modal - The modal object.
 * @param {Function} reApplyState - The function for reapplying the state.
 */
function addContactsDropdownListener(modal, reApplyState) {
  modal.contactsDropdown.addEventListener('click', () => {
    modal.contactDropdownOpen = !modal.contactDropdownOpen;
    reApplyState(modal, reApplyState);
  });
}

/**
 * Adds event listeners for the "Clear" button.
 * @param {Object} modal - The modal object.
 * @param {Function} reApplyState - The function for reapplying the state.
 */
function addClearButtonListener(modal, reApplyState) {
  modal.clearButton.addEventListener('click', () => {
    let resettedTask = initialState(modal.originalTask);
    Object.assign(modal.taskWIP, resettedTask);
    reApplyState(modal, reApplyState);
  });
}

/**
 * Adds event listeners for the category selector.
 * @param {Object} modal - The modal object.
 * @param {Function} reApplyState - The function for reapplying the state.
 */
function addCategorySelectorListener(modal, reApplyState) {
  modal.categorySelector.addEventListener('click', () => {
    modal.categoryDropdownOpen = !modal.categoryDropdownOpen;
    reApplyState(modal, reApplyState);
  });
}

/**
 * Adds event listeners for the technical task.
 * @param {Object} modal - The modal object.
 * @param {Function} reApplyState - The function for reapplying the state.
 */
function addTechnicalTaskListener(modal, reApplyState) {
  modal.technicalTask.addEventListener('click', () => {
    modal.taskWIP.category = 'Technical Task';
    modal.categoryDropdownOpen = false;
    reApplyState(modal, reApplyState);
  });
}

/**
 * Adds event listeners for the user story.
 * @param {Object} modal - The modal object.
 * @param {Function} reApplyState - The function for reapplying the state.
 */
function addUserStoryListener(modal, reApplyState) {
  modal.userStory.addEventListener('click', () => {
    modal.taskWIP.category = 'User Story';
    modal.categoryDropdownOpen = false;
    reApplyState(modal, reApplyState);
  });
}

/**
 * Adds event listeners for adding subtasks.
 * @param {Object} modal - The modal object.
 * @param {Function} reApplyState - The function for reapplying the state.
 */
function addAddSubtaskListener(modal, reApplyState) {
  modal.addSubtask.addEventListener('click', () => {
    let text = modal.subtaskInput.value.trim();
    if (text === '') { return; }

    modal.taskWIP.subTasks.push({ title: text, done: false });
    modal.subtaskInput.value = '';
    reApplyState(modal, reApplyState);
  });
}

/**
 * Adds event listeners for the close button and the cancel button.
 * @param {Object} modal - The modal object.
 * @param {Function} closePopup - The function to close the popup.
 */
function addCloseAndCancelListeners(modal, closePopup) {
  modal.closeButton.addEventListener('click', closePopup);
  modal.cancelButton.addEventListener('click', closePopup);
}

/**
 * Links event listeners for the various buttons in the modal.
 * @param {Object} modal - The Modal object.
 * @param {Function} reApplyState - The function to reapply the state.
 * @param {Function} closePopup - The function to close the popup.
 */
function wireUpButtons(modal, reApplyState, closePopup) {
  addContactsDropdownListener(modal, reApplyState);
  addClearButtonListener(modal, reApplyState);
  addCategorySelectorListener(modal, reApplyState);
  addTechnicalTaskListener(modal, reApplyState);
  addUserStoryListener(modal, reApplyState);
  addAddSubtaskListener(modal, reApplyState);
  addCloseAndCancelListeners(modal, closePopup);
}


/**
 * Adds event listeners for the date input field.
 * @param {Object} modal - The Modal object.
 * @param {Function} reApplyState - The function to reapply the state.
 */
function addDateInputListeners(modal, reApplyState) {
  modal.dateInput.addEventListener('input', () => {
    modal.taskWIP.date = modal.dateInput.value.trim();
    reApplyState(modal, reApplyState);
  });

  modal.dateInput.addEventListener('click', () => {
    modal.dateInput.classList.add('clicked');
  });
}

/**
 * Adds event listeners for the description input field.
 * @param {Object} modal - The Modal object.
 * @param {Function} reApplyState - The function to reapply the state.
 */
function addDescriptionInputListener(modal, reApplyState) {
  modal.descriptionInput.addEventListener('input', () => {
    modal.taskWIP.description = modal.descriptionInput.value;
    reApplyState(modal, reApplyState);
  });
}

/**
 * Adds event listeners for the title input field.
 * @param {Object} modal - The Modal object.
 * @param {Function} reApplyState - The function to reapply the state.
 */
function addTitleInputListeners(modal, reApplyState) {
  modal.titleInput.addEventListener('input', () => {
    modal.taskWIP.title = modal.titleInput.value;
    reApplyState(modal, reApplyState);
  });

  modal.titleInput.addEventListener('click', () => {
    modal.titleInput.classList.add('clicked');
  });
}

/**
 * Links event listeners for date, description, and title input fields.
 * @param {Object} modal - The Modal object.
 * @param {Function} reApplyState - The function to reapply the state.
 */
function wireUpInputs(modal, reApplyState) {
  addDateInputListeners(modal, reApplyState);
  addDescriptionInputListener(modal, reApplyState);
  addTitleInputListeners(modal, reApplyState);
}

/**
* Function wiring up event listeners for task details modal.
* @type {Function}
*/
function wireUpListeners(modal, closePopup, reApplyState) {
  modal.saveButton.addEventListener('click', () => {
    trySave(modal, closePopup);
  });
  wireUpPriorityListeners(modal, reApplyState);
  wireUpButtons(modal, reApplyState, closePopup);
  wireUpInputs(modal, reApplyState);
}

/**
 * Opens the task detail popup.
 * @param {string} taskId - The ID of the task.
 * @param {Function} reRenderTasksInBoard - Function to re-render tasks in the board.
 */
function openTaskDetailPopup(taskId, reRenderTasksInBoard) {
  let task = null;
  if (taskId !== null) { task = getTaskById(taskId); }
  let reloadAndRender = async () => {
    await persistTasks(state.tasks, state.currentUser.email);
    reRenderTasksInBoard();
  };
  openPopup(
    { task },
    taskDetails,
    setupState,
    applyState,
    wireUpListeners,
    reloadAndRender,
  );
}