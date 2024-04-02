/**
 * Initializes the login page.
 * Calls the function to insert remember me credentials.
 * @returns {Promise<void>}
 */
async function init() {
    insertRememberMe();
}

/**
 * Logs in the user as a guest.
 * Sets predefined email and password for guest login.
 * Automatically fills login form and triggers login check.
 * @returns {Promise<void>}
 */
async function guestLogin() {
    let email = '';
    let password = '';
    email = 'guest01@guest.de';
    password = '987654321';
    let inputEmail = document.getElementById('inputEmail');
    let inputPassword = document.getElementById('inputPassword');
    inputEmail.value = email;
    inputPassword.value = password;
    checkLogin();
}

/**
 * Attempts to log in the user with the provided credentials.
 *
 * @param {Object} credentials - The user's login credentials, containing an email and password.
 * @param {HTMLInputElement} checkBox - The checkbox indicating whether to remember the user's login.
 * @returns {Promise<void>} A promise that resolves when the user is logged in successfully.
 */
async function loginUser(credentials, checkBox) {
    let user = await tryLogin(credentials);
    state.currentUser = user;
    if (checkBox.checked) {
        state.rememberMe = credentials;
    } else {
        state.rememberMe = null;
    }
    saveToDisk();
    window.location.href = "summary.html";
}

/**
 * Handles errors that occur during the login process.
 *
 * @param {Error} e - The error object representing the encountered error.
 */
function handleError(e) {
    let errorInfo = document.getElementById('errorInfo');
    errorInfo.innerHTML = `<p class='error'>${e}</p>`;
}

/**
 * Checks the user's login credentials and attempts to log in.
 */
async function checkLogin() {
    let email = document.getElementById('inputEmail').value;
    let password = document.getElementById('inputPassword').value;
    let checkBox = document.getElementById('loginCheckbox');
    let credentials = { email, password };
    try {
        await loginUser(credentials, checkBox);
    } catch (e) {
        handleError(e);
    }
}

/**
 * Inserts remembered login credentials if available.
 * @returns {void}
 */
function insertRememberMe() {
    let { rememberMe } = state;
    if (rememberMe !== null) {
        let { email, password } = rememberMe;
        document.getElementById('loginCheckbox').checked = true;
        document.getElementById('inputEmail').value = email;
        document.getElementById('inputPassword').value = password;
    }
}

/**
 * Changes the image of the password visibility icon.
 * @returns {void}
 */
function changeImg() {
    let lock = document.getElementById('lockPng');
    let eyeClose = '../assets/img/password_dont.svg';
    lock.src = eyeClose;
    lock.style.cursor = 'pointer';
    lock.setAttribute('onclick', `changeShow()`)
}

/**
 * Changes the visibility of the password input field.
 * @returns {void}
 */
function changeShow() {
    let passwordElement = document.getElementById('inputPassword');
    let lockImg = document.getElementById('lockPng');
    if (passwordElement.type === 'password') {
        passwordElement.setAttribute('type', 'text');
        lockImg.src = '../assets/img/password_show.svg';
        lockImg.style.cursor = 'pointer';
    } else {
        passwordElement.setAttribute('type', 'password');
        lockImg.src = '../assets/img/password_dont.svg';
        lockImg.style.cursor = 'pointer';
    }
}