/**
 * Initial state of the application.
 * @typedef {Object} InitialState
 * @property {null} rememberMe - Initially null for rememberMe.
 * @property {null} currentUser - Initially null for currentUser.
 * @property {Array} tasks - Initially an empty array for tasks.
 * @property {Array} contacts - Initially an empty array for contacts.
 */
let initalState = {
  rememberMe: null,
  currentUser: null,
  tasks: [],
  contacts: [],
};

/**
 * Represents the state of the application.
 * @typedef {Object} State
 * @property {boolean} rememberMe - Indicates whether the user's session should be remembered.
 * @property {string|null} currentUser - The username of the currently logged-in user.
 * @property {Object} tasks - An object containing task lists categorized by status.
 * @property {Array<Object>} tasks.toDo - An array of tasks in the 'toDo' status.
 * @property {Array<Object>} tasks.inProgress - An array of tasks in the 'inProgress' status.
 * @property {Array<Object>} tasks.awaitFeedback - An array of tasks in the 'awaitFeedback' status.
 * @property {Array<Object>} tasks.done - An array of tasks in the 'done' status.
 * @property {Array<Object>} contacts - An array of contacts.
 */

/** Represents the key under which the state is stored in the storage. */
let stateKey = '__state';

/** @type {State} */
let state = {
  rememberMe: null,
  currentUser: null,
  tasks: {
    toDo: [],
    inProgress: [],
    awaitFeedback: [],
    done: [],
  },
  contacts: [],
};

/**
 * Saves relevant state data to local storage.
 */
function saveToDisk() {
  let stringified = JSON.stringify({
    rememberMe: state.rememberMe,
    currentUser: state.currentUser,
  });
  localStorage.setItem(stateKey, stringified);
}

/**
 * Reads state data from local storage.
 */
function readFromDisk() {
  let stringifiedState = localStorage.getItem(stateKey);
  if (stringifiedState === null) {
    Object.assign(state, initalState);
    saveToDisk();
    return;
  }
  let parsed = JSON.parse(stringifiedState);
  Object.assign(state, {
    rememberMe: parsed.rememberMe,
    currentUser: parsed.currentUser,
  });
}

/**
 * Loads tasks asynchronously.
 */
async function loadTasks() {
  let remoteTasks = await fetchTasks(state.currentUser.email);
  state.tasks = remoteTasks;
}

/**
 * Loads contacts asynchronously.
 */
async function loadContacts() {
  let remoteContacts = await fetchContacts(state.currentUser.email);
  state.contacts = remoteContacts;
}
readFromDisk();

/**
 * Loads internal page components.
 */
async function loadInternalPage() {
  let user = state.currentUser;
  if (user === null) {
    window.location.href = "login.html"; // Wenn kein Benutzer angemeldet ist, weiterleiten zur Login-Seite oder ähnliches
    return;
  }
  let userName = document.getElementById('userName'); // display username
  let userNameMobile = document.getElementById('userNameMobile');
  let userLetter = document.getElementById('userLetter');
  let short = user.name.charAt(0).toUpperCase() + user.name.slice(1);
  if (userName !== null) { userName.innerHTML = short; }
  if (userNameMobile !== null) { userNameMobile.innerHTML = short; }
  if (userLetter !== null) { userLetter.innerHTML = user.name.charAt(0).toUpperCase(); }
  await loadTasks();
  await loadContacts();
}

/**
 * Locks the page by disabling pointer events on the body element.
 */
function lockPage() {
  document.body.style.pointerEvents = 'none';
}

/**
 * Unlocks the page by enabling pointer events on the body element.
 */
function unlockPage() {
  document.body.style.pointerEvents = 'unset';
}

/**
 * Loads user information for internal page.
 */
async function loadUserOfInternalPage() {
  let user = state.currentUser;
  if (user === null) {
    window.location.href = "login.html"; // Wenn kein Benutzer angemeldet ist, weiterleiten zur Login-Seite oder ähnliches
    return;
  }
  let userName = document.getElementById('userName'); // display username
  let userNameMobile = document.getElementById('userNameMobile');
  let userLetter = document.getElementById('userLetter');
  let short = user.name.charAt(0).toUpperCase() + user.name.slice(1);
  if (userName !== null) { userName.innerHTML = short; }
  if (userNameMobile !== null) { userNameMobile.innerHTML = short; }
  if (userLetter !== null) { userLetter.innerHTML = user.name.charAt(0).toUpperCase(); }
}

/**
 * Retrieves a task by its ID.
 * @param {string} taskId - The ID of the task to retrieve.
 * @returns {Object} - The task object.
 * @throws {string} - If no task is found with the specified ID.
 */
function getTaskById(taskId) {
  let task = state.tasks.find(t => t._id === taskId);
  if (task !== undefined) { return task; }
  throw taskId;
}

/**
 * Retrieves a contact by its ID.
 * @param {string} contactId - The ID of the contact to retrieve.
 * @returns {Object} - The contact object.
 * @throws {string} - If no contact is found with the specified ID.
 */
function getContactById(contactId) {
  let foundContacts = [];
  for (let candidate of state.contacts) {
    if (candidate.contactId === contactId) {
      return candidate;
    } else {
      foundContacts.push(candidate);
    }
  }
}
