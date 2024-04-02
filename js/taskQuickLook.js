let quickLook_htmlProviders = createQuickLookHtmlProviders();
/**
 * Generates HTML for a subtask.
 * @param {object} task - The subtask details.
 * @param {string} task.title - The title of the subtask.
 * @param {boolean} task.done - Indicates whether the subtask is done.
 * @returns {string} HTML representation of the subtask.
 */
function generateSubtask(task) {
  let { title, done } = task;
  return generateSubtaskHTML(title, done);
}

/**
 * Generates HTML template for the quick look modal.
 * @returns {string} HTML template for the quick look modal.
 */
function generateQuickLook() {
  return generateQuickLookHTMLTemplate();
}

/**
 * Creates an object containing HTML generation methods for quick look modal.
 * @returns {object} Object containing HTML generation methods.
 */
function createQuickLookHtmlProviders() {
  return {
    subtask: generateSubtask,
    quickLook: generateQuickLook
  };
}

let quickLook_methods = {
  setUpState: (root, closure) => setUpState(root, closure),
  applyState: (modal, applyState) => {
    void applyState;
    applyModalData(modal);
    applySubtasks(modal);
    applyCategoryStyles(modal);
  },
  wireUpListeners: (modal, closePopup) => {
    attachEditListener(modal);
    attachDeleteListener(modal, closePopup);
    attachCloseListener(modal, closePopup);
  },
};

/**
 * Sets up the state for the quick look modal.
 * @param {HTMLElement} root - The root element of the modal.
 * @param {object} closure - The closure containing additional data.
 * @returns {object} State object containing references to modal elements.
 */
function setUpState(root, closure) {
  return {
    ...closure,
    editButton: root.querySelector('#edit'),
    deleteButton: root.querySelector('.deletebtn'),
    dateDisplay: root.querySelector('#dateDisplay'),
    prioritySvg: root.querySelector('.prioritySvg'),
    priorityElement: root.querySelector('#priorityElement'),
    modalDescription: root.querySelector('.modalDescription'),
    modalTitle: root.querySelector('.modalTitle'),
    contactDisplay: root.querySelector('#contactDisplay'),
    subtaskDisplay: root.querySelector('#subtaskDisplay'),
    modalCategory: root.querySelector('.modalCategory'),
    closeButton: root.querySelector('.xmark'),
  };
}

/**
 * Applies data from the modal's task object to the modal elements.
 * @param {object} modal - The modal object containing task data.
 */
function applyModalData(modal) {
  modal.dateDisplay.innerHTML = modal.task.date;
  modal.prioritySvg.innerHTML = modal.prioritySVG;
  modal.prioritySvg.style.color = modal.priorityColor;
  modal.priorityElement.innerHTML = [
    modal.task.priority.slice(0, 1).toUpperCase(),
    modal.task.priority.slice(1),
  ].join('');
  modal.modalDescription.innerHTML = modal.task.description;
  modal.modalTitle.innerHTML = modal.task.title;
  modal.contactDisplay.innerHTML = generateContactHTML(modal.task.contacts);
}

/**
 * Applies subtask data to the modal.
 * @param {object} modal - The modal object.
 * @param {function} reApplyState - Function to reapply state changes.
 */
function applySubtasks(modal, reApplyState) {
  let taskElements = modal.task.subTasks.map(task => {
    return quickLook_htmlProviders.subtask(task);
  });
  modal.subtaskDisplay.innerHTML = taskElements.join('\n');
  wireUpSubtaskListeners(modal, reApplyState);
}

/**
 * Applies category-specific styles to the modal.
 * @param {object} modal - The modal object.
 */
function applyCategoryStyles(modal) {
  modal.modalCategory.innerHTML = modal.task.category;
  modal.modalCategory.style.backgroundColor = modal.categoryColor;
  modal.modalCategory.style.width = modal.task.category === 'Technical Task'
    ? '144px'
    : '113px';
}

/**
 * Attaches an event listener to the edit button.
 * @param {object} modal - The modal object.
 */
function attachEditListener(modal) {
  modal.editButton.addEventListener('click', modal.openDetailPopup);
}

/**
 * Attaches an event listener to the delete button.
 * @param {object} modal - The modal object.
 * @param {function} closePopup - Function to close the modal.
 */
function attachDeleteListener(modal, closePopup) {
  modal.deleteButton.addEventListener('click', () => {
    modal.deleteThisTask();
    closePopup();
  });
}

/**
 * Attaches an event listener to the close button.
 * @param {object} modal - The modal object.
 * @param {function} closePopup - Function to close the modal.
 */
function attachCloseListener(modal, closePopup) {
  modal.closeButton.addEventListener('click', closePopup);
}

/**
 * Generiert das HTML für Kontakte basierend auf den bereitgestellten Kontakt-IDs.
 * @param {string[]} contacts - Ein Array von Kontakt-IDs.
 * @returns {string} Das generierte HTML für die Kontakte.
 */
function generateContactHTML(contacts) {
  return contacts.map(contactId => {
    let contact = getContactById(contactId);
    return contact ? `
          <div class="contact-avatar" style="padding-left: 15px; margin-top: 10px; display: flex; align-items: center; gap: 15px;">
            <div class="item-img" style="background-color: ${contact.color};">${contact.initials}</div>
            <div class="item-name">${contact['add-name']}</div>
          </div>` : '';
  }).join('');
}

/**
 * Verknüpft die Listener für Teilaufgaben mit dem Modal.
 * @param {Object} modal - Das Modal-Objekt.
 * @param {Function} reApplyState - Die Funktion zum erneuten Anwenden des Zustands.
 */
function wireUpSubtaskListeners(modal, reApplyState) {
  let subtaskNodes = modal.subtaskDisplay.querySelectorAll('.subtask-item');
  for (let _subTaskNode of subtaskNodes) {
    let subTaskNode = _subTaskNode.cloneNode(true);
    _subTaskNode.replaceWith(subTaskNode);
    subTaskNode.addEventListener('click', () => {
      let title = subTaskNode.getAttribute('data-title');
      let toModify = modal.task.subTasks.find(t => t.title === title);
      toModify.done = !toModify.done;
      persistTasks(state.tasks, state.currentUser.email);
      applySubtasks(modal, reApplyState);
    });
  }
}

/**
 * Opens the quick look modal for a task.
 * @param {object} closure - The closure containing additional data.
 */
function openTaskQuickLook(closure) {
  openPopup(
    closure,
    quickLook_htmlProviders.quickLook,
    quickLook_methods.setUpState,
    quickLook_methods.applyState,
    quickLook_methods.wireUpListeners,
    reRenderTasksInBoard,
  );
}

/**
 * Generates HTML template for the quick look modal.
 * @returns {string} HTML template for the quick look modal.
 */
function generateQuickLookHTMLTemplate() {
  return `
<div class="modal">
 <div class="categoryAndClose">
    <div class="modalCategory"></div>
    <div class="xmark"><i class="fa-solid fa-xmark"></i></div>
  </div>
<div class="modalScroll">
  <div class="modalTitle"></div>
  <div class="modalDescription"></div>
  <div class="modalDate">
      <div class="date-quicklook">Due date:</div>
      <div id="dateDisplay"></div>
  </div>
  <div class="priorityAndSvg">
      <div class="priority"> Priority:  </div>
      <div class="allPriority" id="priorityElement"></div>
      <div class="prioritySvg"></div>
  </div>
  <div class="modalAssign"> Assigned To: <br> </div>
  <div id="contactDisplay"></div>
  <div class="subtasks"> Subtasks <br> </div>
  <div id="subtaskDisplay"></div>
  </div>
  <div class ="deleteAndEdit">
    <div class="deletebtn">
      <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" fill="currentColor"/>
      </svg>
      <span>Delete</span>
    </div>
    <div id="edit">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="mask0_152804_4276" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
      <rect width="24" height="24" fill="#D9D9D9"/>
      </mask>
      <g mask="url(#mask0_152804_4276)">
      <path d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="currentColor"/>
      </g>
      </svg>
      <span>Edit</span>
    </div>
  </div>
</div>
  `;
}

/**
 * Generates HTML for a subtask.
 * @param {string} title - The title of the subtask.
 * @param {boolean} done - Indicates whether the subtask is done.
 * @returns {string} HTML representation of the subtask.
 */
function generateSubtaskHTML(title, done) {
  return `
    <div class="subtask-item" data-title="${title}">
        <span class="checkbox${done ? ' checked' : ''}">
            <i
              style="color: ${done ? '#000' : 'transparent'}; transform: scale(1)"
              class="fa-solid fa-check check-icon"
            ></i>
        </span>
        <span>${title}</span>
    </div>
  `;
}