
let API_TOKEN = 'KJUQD3VVEG97P7PWZI4BJWZ3CNGTPOCAKQX8SJI0';
let API_URL = 'https://remote-storage.developerakademie.org/item';
USERS_TABLE = 'users';
TASKS_TABLE = 'tasks';
CONTACTS_TABLE = 'contacts';

let hardcodedDefaultData = {
  contacts: [
    {
      "add-name": "Alessio Braun",
      "add-email": "alessio@gmail.com",
      "add-phone": "123456789",
      "initials": "AB",
      "contactId": "dfc87fe8-f361-4556-9adf-d205e7eea936",
      "color": "#B8B5DF"
    },
    {
      "add-name": "Anja Schulz",
      "add-email": "schulz@hotmail.com",
      "add-phone": "123456789",
      "initials": "AS",
      "contactId": "f03e9a52-7480-4665-a437-b07544c700b9",
      "color": "#D7049B"
    },
    {
      "add-name": "Anton Mayer",
      "add-email": "anton@gmail.com",
      "add-phone": "123456789",
      "initials": "AM",
      "contactId": "953c4d0a-1fda-42fe-8590-2ce7bb7f497c",
      "color": "#966D68"
    },
    {
      "add-name": "Benedikt Ziegler",
      "add-email": "benedikt@gmail.com",
      "add-phone": "123456789",
      "initials": "BZ",
      "contactId": "1e37c0f5-07c8-4486-aed4-423d71d444ea",
      "color": "#5816C5"
    },
    {
      "add-name": "David Eisenberg",
      "add-email": "davidberg@gmail.com",
      "add-phone": "123456789",
      "initials": "DE",
      "contactId": "60b1c2ec-0deb-4d4c-83fa-121f4d7a6983",
      "color": "#35EF3A"
    },
    {
      "add-name": "Emmanuel Mauer",
      "add-email": "emmanuelma@gmail.com",
      "add-phone": "123456789",
      "initials": "EM",
      "contactId": "31127b77-88e2-41cc-b6c7-bc87047ced0f",
      "color": "#469A31"
    },
    {
      "add-name": "Eva Fischer",
      "add-email": "eva@gmail.com",
      "add-phone": "123456789",
      "initials": "EF",
      "contactId": "1b61157a-2eb6-4723-b592-cf7ff445590c",
      "color": "#914D88"
    },
    {
      "add-name": "Marcel Bauer",
      "add-email": "bauer@gmail.com",
      "add-phone": "123456789",
      "initials": "MB",
      "contactId": "c3d60ada-1f57-49a6-a56b-c465a1959601",
      "color": "#DBD0AF"
    },
    {
      "add-name": "Sarah Engel ",
      "add-email": "sarah@gmail.com",
      "add-phone": "123456789",
      "initials": "S",
      "contactId": "73702a90-c9f0-4471-a813-faab3ad07766",
      "color": "#F4FEDA"
    },
    {
      "add-name": "Tatjana Wolf",
      "add-email": "wolf@hotmail.com",
      "add-phone": "123",
      "initials": "TW",
      "contactId": "52a27ccb-fc8e-4867-b598-53ff2751f241",
      "color": "#712767"
    }
  ],
  tasks: [
    {
      "_id": 1711554501515,
      "category": "User Story",
      "title": "Kochwelt Page @ Recipe Recommender ",
      "description": "Build start page with recipe ",
      "date": "2024-03-28",
      "priority": "medium",
      "subTasks": [
        {
          "title": "recipe",
          "done": true
        },
        {
          "title": "vegan",
          "done": false
        }
      ],
      "contacts": [
        "dfc87fe8-f361-4556-9adf-d205e7eea936",
        "f03e9a52-7480-4665-a437-b07544c700b9",
        "953c4d0a-1fda-42fe-8590-2ce7bb7f497c"
      ],
      "status": "toDo"
    },
    {
      "_id": 1711554549487,
      "category": "Technical Task",
      "title": "HTML Base Template Creation ",
      "description": "Create reusable HTML base ",
      "date": "2024-03-30",
      "priority": "low",
      "subTasks": [],
      "contacts": [
        "1b61157a-2eb6-4723-b592-cf7ff445590c",
        "c3d60ada-1f57-49a6-a56b-c465a1959601",
        "73702a90-c9f0-4471-a813-faab3ad07766",
        "52a27ccb-fc8e-4867-b598-53ff2751f241",
        "31127b77-88e2-41cc-b6c7-bc87047ced0f",
        "60b1c2ec-0deb-4d4c-83fa-121f4d7a6983"
      ],
      "status": "awaitFeedback"
    },
    {
      "_id": 1711554596868,
      "category": "User Story",
      "title": "Daily Kochwelt Recipe ",
      "description": "Implement daily recipe ",
      "date": "2024-03-29",
      "priority": "medium",
      "subTasks": [],
      "contacts": [
        "dfc87fe8-f361-4556-9adf-d205e7eea936",
        "f03e9a52-7480-4665-a437-b07544c700b9",
        "953c4d0a-1fda-42fe-8590-2ce7bb7f497c",
        "1e37c0f5-07c8-4486-aed4-423d71d444ea",
        "60b1c2ec-0deb-4d4c-83fa-121f4d7a6983",
        "31127b77-88e2-41cc-b6c7-bc87047ced0f",
        "1b61157a-2eb6-4723-b592-cf7ff445590c",
        "c3d60ada-1f57-49a6-a56b-c465a1959601",
        "73702a90-c9f0-4471-a813-faab3ad07766",
        "52a27ccb-fc8e-4867-b598-53ff2751f241"
      ],
      "status": "awaitFeedback"
    },
    {
      "_id": 1711554651284,
      "category": "Technical Task",
      "title": "CSS Architecture Planning",
      "description": "Define CSS naming conventions ",
      "date": "2024-03-29",
      "priority": "urgent",
      "subTasks": [
        {
          "title": "doc",
          "done": true
        },
        {
          "title": "js",
          "done": true
        }
      ],
      "contacts": [
        "dfc87fe8-f361-4556-9adf-d205e7eea936",
        "1e37c0f5-07c8-4486-aed4-423d71d444ea"
      ],
      "status": "done"
    },
    {
      "_id": 1711554725881,
      "category": "User Story",
      "title": "Created Contact & Tasks",
      "description": "rework Join ",
      "date": "2024-03-29",
      "priority": "urgent",
      "subTasks": [],
      "contacts": [
        "31127b77-88e2-41cc-b6c7-bc87047ced0f",
        "60b1c2ec-0deb-4d4c-83fa-121f4d7a6983",
        "1e37c0f5-07c8-4486-aed4-423d71d444ea"
      ],
      "status": "inProgress"
    }
  ],
};

/**
 * Performs API call either for fetching or storing data.
 * @param {Object|null} body - The request body.
 * @param {string} url - The API endpoint URL.
 * @returns {Promise<Object>} The response data.
 */
async function apiCall(body, url) {
  if (body === null) {
    let req = await fetch(`${API_URL}${url}`);
    switch (req.status) {
      case 404: {
        throw `Could not find data with key "${key}".`;
      }
      default: {
        let res = await req.json();
        if (res.data) { return JSON.parse(res.data.value); }
      }
    }
  } else {
    let req = await fetch(API_URL, { method: 'POST', body: JSON.stringify(body) });
    return req.json();
  }
};

/**
 * Sets an item in the storage.
 * @param {string} key - The key to set.
 * @param {any} value - The value to set.
 * @returns {Promise<Object>} The response data.
 */
function setItem(key, value) {
  let payload = { key, value, token: API_TOKEN };
  return apiCall(payload);
};

/**
 * Retrieves an item from the storage.
 * @param {string} key - The key to retrieve.
 * @returns {Promise<Object>} The response data.
 */
async function getItem(key) {
  let url = `?key=${key}&token=${API_TOKEN}`;
  return apiCall(null, url);
}

/**
 * Tries to register a new user.
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @throws {string} Error message if registration fails.
 */
async function tryRegisterUser(
  name,
  email,
  password,
) {
  let existingUsers = await getItem(USERS_TABLE);
  for (let user of existingUsers) {
    if (user.email.toLowerCase() === email.toLowerCase()) {
      throw "This e-mail address already exists";
    }
    if (user.name.toLowerCase() === name.toLowerCase()) {
      throw "This username is already taken";
    }
  }
  existingUsers.push({ name, email, password });
  await persistTasks(hardcodedDefaultData.tasks, email);
  await persistContacts(hardcodedDefaultData.contacts, email);
  await setItem(USERS_TABLE, existingUsers);
}

/**
 * Tries to log in a user.
 * @param {Object} credentials - The user's credentials.
 * @param {string} credentials.email - The user's email.
 * @param {string} credentials.password - The user's password.
 * @returns {Promise<Object>} The logged-in user.
 * @throws {string} Error message if login fails.
 */
async function tryLogin(credentials) {
  let existingUsers = await getItem(USERS_TABLE);
  let user = existingUsers.find(item => {
    if (item.email !== credentials.email) { return false; }
    if (item.password !== credentials.password) { return false; }
    return true;
  });
  if (user === undefined) {
    throw 'The email address or password you entered is invalid.';
  }
  return user;
}

/**
 * Persists tasks for a user.
 * @param {Array<Object>} tasks - The tasks to persist.
 * @param {string} identifier - The identifier of the user.
 * @returns {Promise<Object>} The response data.
 */
function persistTasks(tasks, identifier) {
  return setItem(`${TASKS_TABLE}_${identifier}`, tasks);
}

/**
 * Fetches tasks for a user.
 * @param {string} identifier - The identifier of the user.
 * @returns {Promise<Array<Object>>} The user's tasks.
 */
async function fetchTasks(identifier) {
  try {
    let tasks = await getItem(`${TASKS_TABLE}_${identifier}`);
    return tasks;
  } catch {
    await persistTasks(initalState.tasks, identifier);
    return initalState.tasks;
  }
}

/**
 * Persists contacts for a user.
 * @param {Array<Object>} contacts - The contacts to persist.
 * @param {string} identifier - The identifier of the user.
 * @returns {Promise<Object>} The response data.
 */
function persistContacts(contacts, identifier) {
  return setItem(`${CONTACTS_TABLE}_${identifier}`, contacts);
}

/**
 * Fetches contacts for a user.
 * @param {string} identifier - The identifier of the user.
 * @returns {Promise<Array<Object>>} The user's contacts.
 */
async function fetchContacts(identifier) {
  try {
    let contacts = await getItem(`${CONTACTS_TABLE}_${identifier}`);
    return contacts;
  } catch {
    return initalState.contacts;
  }
}

