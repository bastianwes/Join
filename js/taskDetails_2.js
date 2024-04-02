
/**
 * Applies CSS classes for priority buttons based on the current priority.
 * @param {Object} modal - The modal object.
 */
function applyPriorityClasses(modal) {
  for (let button of [modal.low, modal.medium, modal.urgent]) {
    button.classList.remove('clicked');
  }
  switch (modal.taskWIP.priority) {
    case 'low':
      modal.low.classList.add('clicked');
      break;
    case 'medium':
      modal.medium.classList.add('clicked');
      break;
    case 'urgent':
      modal.urgent.classList.add('clicked');
      break;
  }
}

/**
 * Applies the current state of the input fields to the modal.
 * @param {Object} modal - The modal object.
 */
function applyInputState(modal) {
  modal.dateInput.value = modal.taskWIP.date || '';
  modal.descriptionInput.value = modal.taskWIP.description || '';
  modal.titleInput.value = modal.taskWIP.title || '';
}

/**
 * Checks the validity of the current modal state.
 * @param {Object} modal - The modal object.
 */
function applyValidity(modal) {
  let { title, category, date } = modal.taskWIP;
  if (title.trim() === '' || category === 'Select task category' || date.trim() === '') {
    modal.isValid = false;
  } else {
    modal.isValid = true;
  }
}

/**
 * Adjusts the CSS class 'open' of the contact dropdown based on its state.
 * @param {Object} modal - The modal object.
 */
function applyContactsDropdownState(modal) {
  if (modal.contactDropdownOpen) {
    modal.contactsDropdown.classList.add("open");
  } else {
    modal.contactsDropdown.classList.remove("open");
  }
}

/**
 * Updates the visual representation of the selected contacts.
 * @param {Object} modal - The modal object.
 */
function updateSelectedContactsVisuals(modal) {
  let contactNodes = document.querySelectorAll(".boardPage-add-task .left-side .item");
  for (let _contactNode of contactNodes) {
    let contactNode = _contactNode.cloneNode(true);
    _contactNode.replaceWith(contactNode);
    let id = contactNode.getAttribute('data-id');
    let isChecked = modal.taskWIP.contacts.includes(id)
    if (isChecked) {
      contactNode.classList.add('checked');
    } else {
      contactNode.classList.remove('checked');
    }
    contactNode.addEventListener('click', () => {
      if (isChecked) {
        modal.taskWIP.contacts = modal.taskWIP.contacts.filter(c => c !== id);
      } else {
        modal.taskWIP.contacts.push(id);
      }
      applyState(modal, applyState);
    });
  }
}

/**
 * Updates the list of assigned contacts in the modal.
 * @param {Object} modal - The modal object.
 */
function updateAssignedContactList(modal) {
  modal.assignedContactList.innerHTML = '';
  for (let contactId of modal.taskWIP.contacts) {
    try {
      let contact = getContactById(contactId);
      let listItem = contactAvatar(contact);
      modal.assignedContactList.appendChild(listItem);
    } catch {
      let cleaned = modal.taskWIP.contacts.filter(c => c === contactId);
      modal.taskWIP.contacts = cleaned;
    }
  }
}

/**
 * Applies all aspects of the contacts to the modal.
 * @param {Object} modal - The modal object.
 */
function applyContacts(modal) {
  applyContactsDropdownState(modal);
  updateSelectedContactsVisuals(modal);
  updateAssignedContactList(modal);
}

/**
 * Applies the category to the modal and updates its display.
 * @param {Object} modal - The modal object.
 */
function applyCategory(modal) {
  let categoryDisplay = modal.categorySelector.querySelector('span');
  if (modal.taskWIP.category === null) {
    categoryDisplay.innerHTML = 'Select task category';
  } else {
    categoryDisplay.innerHTML = modal.taskWIP.category;
  }
  modal.categorySelector.classList.remove('invalid');
  modal.categorySelector.classList.remove('valid');
  if (modal.taskWIP.category === '') {
    modal.categorySelector.classList.add('invalid');
  } else {
    modal.categorySelector.classList.add('valid');
  }
  if (modal.categoryDropdownOpen) {
    modal.categorySelector.classList.add("open");
  } else {
    modal.categorySelector.classList.remove("open");
  }
}

/**
 * Applies CSS classes to the input fields based on validation.
 * @param {Object} modal - The modal object.
 */
function applyInputValidationClasses(modal) {
  modal.dateInput.classList.remove('invalid');
  modal.dateInput.classList.remove('valid');
  if (modal.taskWIP.date === '') {
    modal.dateInput.classList.add('invalid');
  } else {
    modal.dateInput.classList.add('valid');
  }

  modal.titleInput.classList.remove('invalid');
  modal.titleInput.classList.remove('valid');
  if (modal.taskWIP.title === '') {
    modal.titleInput.classList.add('invalid');
  } else {
    modal.titleInput.classList.add('valid');
  }
}

/**
 * Applies the list of subtasks to the modal.
 * @param {Object} modal - The modal object.
 * @param {Function} applyState - The function for applying the state.
 */
function applySubtaskList(modal, applyState) {
  modal.subtaskList.innerHTML = '';
  for (let [index, subtask] of modal.taskWIP.subTasks.entries()) {
    let onDelete = () => {
      modal.taskWIP.subTasks.splice(index, 1);
      applyState(modal, applyState);
    };

    let onChange = (newTitle) => {
      let toModify = modal.taskWIP.subTasks[index];
      toModify.title = newTitle;
      applyState(modal, applyState);
    };

    let element = createSubtaskEntry(subtask, onDelete, onChange);
    modal.subtaskList.appendChild(element);
  }
}

/**
 * Applies the creation styles to the modal.
 * @param {Object} modal - The modal object.
 */
function applyCreateStyles(modal) {
  modal.saveButton.innerHTML = [
    'Create Task',
    '<img src="../assets/img/check.svg" width="24px" height="24px">',
  ].join('');
  modal.popupTitle.innerHTML = 'Add Task';
  modal.popupTitle.style.display = 'block';
  modal.boardPageAddTask.style.flexDirection = undefined;
}


/**
 * Function applying the state changes to the task details modal.
 * @type {Function}
 */
function applyState(modal, reApplyState) {
  applyInputState(modal);
  applyValidity(modal);
  applyPriorityClasses(modal);
  applyContacts(modal);
  applyCategory(modal);
  applyInputValidationClasses(modal);
  applySubtaskList(modal, reApplyState)
  if (modal.isCreate) {
    applyCreateStyles(modal);
  } else {
    applyEditStyles(modal);
  }
}

/**
 * Sets the content of the save button.
 * @param {Object} modal - The modal object.
 */
function setSaveButtonContent(modal) {
  modal.saveButton.innerHTML = [
    'Ok',
    '<img src="../assets/img/check.svg" width="24px" height="24px">',
  ].join('');
}

/**
 * Hides the popup title.
 * @param {Object} modal - The modal object.
 */
function hidePopupTitle(modal) {
  modal.popupTitle.style.display = 'none';
}

/**
 * Adjusts the styles for the board page add task element.
 * @param {Object} modal - The modal object.
 */
function adjustBoardPageAddTaskStyles(modal) {
  modal.boardPageAddTask.style.gap = '20px'
  modal.boardPageAddTask.style.height = '50%';
  modal.boardPageAddTask.style.scrollbarWidth = 'thin';
  modal.boardPageAddTask.style.scrollbarColor = '#D1D1D1 white';

}

/**
 * Deletes the styles for the left and right sections.
 * @param {Object} modal - The modal object.
 */
function clearLeftRightSectionsStyles(modal) {
  for (let side of modal.leftRightSections) {
    side.style.border = 'none';
    side.style.padding = '0';
  }
}

/**
 * Adjusts the styles for the save section.
 * @param {Object} modal - The modal object.
 */
function adjustSaveSectionStyles(modal) {
  modal.saveSection.style.marginTop = '40px';
  modal.saveSection.style.display = 'flex';
  modal.saveSection.style.justifyContent = 'flex-end';
}

/**
 * Clears the content of the required field.
 * @param {Object} modal - The modal object.
 */
function clearRequiredFieldContent(modal) {
  modal.requiredField.innerHTML = '';
}

/**
 * Removes the cancel button.
 * @param {Object} modal - The modal object.
 */
function removeCancelButton(modal) {
  modal.cancelButton.remove();
}

/**
 * Adjusts the styles for the header.
 * @param {Object} modal - The modal object.
 */
function adjustHeadLineStyle(modal) {
  modal.headLine.style.display = 'flex';
  modal.headLine.style.justifyContent = 'flex-end';
  modal.headLine.style.marginBottom = '5px';
}

/**
 * Removes the categories container.
 * @param {Object} modal - The modal object.
 */
function removeCategoryContainer(modal) {
  modal.categoryContainer.remove();
}

/**
 * Resets the content of the priority.
 * @param {Object} modal - The modal object.
 */
function resetPriorityContent(modal) {
  modal.priority.innerHTML = 'Priority';
}

/**
 * Applies the editing styles to the modal.
 * @param {Object} modal - The modal object.
 */
function applyEditStyles(modal) {
  setSaveButtonContent(modal);
  hidePopupTitle(modal);
  adjustBoardPageAddTaskStyles(modal);
  clearLeftRightSectionsStyles(modal);
  adjustSaveSectionStyles(modal);
  clearRequiredFieldContent(modal);
  removeCancelButton(modal);
  adjustHeadLineStyle(modal);
  removeCategoryContainer(modal);
  resetPriorityContent(modal);
}

/**
 * Attempts to save the changes.
 * @param {Object} modal - The modal object.
 * @param {Function} closePopup - The function to close the popup.
 */
function trySave(modal, closePopup) {
  if (!modal.isValid) {
    modal.dateInput.classList.add('clicked');
    modal.titleInput.classList.add('clicked');
    modal.categoryContainer.classList.add('clicked');
    return;
  }
  applyEditStyles(modal);
  if (modal.originalTask === null) {
    let createdTask = {
      _id: Date.now(),
      ...modal.taskWIP,
      status: 'toDo',
    };
    state.tasks.push(createdTask);
  } else {
    let edited = state.tasks.find(t => t._id === modal.originalTask._id);
    Object.assign(edited, modal.taskWIP);
  }
  closePopup();
}

/**
 * Adds event listeners for the "Low" priority.
 * @param {Object} modal - The modal object.
 * @param {Function} reApplyState - The function for reapplying the state.
 */
function addLowPriorityListener(modal, reApplyState) {
  modal.low.addEventListener('click', () => {
    modal.taskWIP.priority = 'low';
    reApplyState(modal, reApplyState);
  });
}

/**
 * Adds event listeners for the "Medium" priority.
 * @param {Object} modal - The modal object.
 * @param {Function} reApplyState - The function for reapplying the state.
 */
function addMediumPriorityListener(modal, reApplyState) {
  modal.medium.addEventListener('click', () => {
    modal.taskWIP.priority = 'medium';
    reApplyState(modal, reApplyState);
  });
}

/**
 * Adds event listeners for the "Urgent" priority.
 * @param {Object} modal - The modal object.
 * @param {Function} reApplyState - The function for reapplying the state.
 */
function addUrgentPriorityListener(modal, reApplyState) {
  modal.urgent.addEventListener('click', () => {
    modal.taskWIP.priority = 'urgent';
    reApplyState(modal, reApplyState);
  });
}

/**
 * Links event listeners for the different priorities.
 * @param {Object} modal - The modal object.
 * @param {Function} reApplyState - The function for reapplying the state.
 */
function wireUpPriorityListeners(modal, reApplyState) {
  addLowPriorityListener(modal, reApplyState);
  addMediumPriorityListener(modal, reApplyState);
  addUrgentPriorityListener(modal, reApplyState);
}
