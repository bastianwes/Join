
/**
 * Adds a new user.
 * @async
 * @returns {boolean} Returns true if user is added successfully, false otherwise.
 */
async function addUser() {
    let name = document.getElementById('inputName').value;
    let email = document.getElementById('inputEmail').value;
    let password = document.getElementById('passwordlockPngP').value;
    let confirmPassword = document.getElementById('passwordlockPngC').value;
    let checkBox = document.getElementById('inputCheckbox');
    if (!checkBox.checked) return displayAlert("Du musst den Nutzungsbedingungen zustimmen.");
    if (!validatePassword(password, confirmPassword)) return false;
    try {
        await tryRegisterUser(name, email, password);
        showSuccessButton();
        return true;
    } catch (e) {
        displayAlert(e)
        return false;
    }
}

/**
 * Displays an alert message.
 * @param {string} message - The message to be displayed.
 */
function displayAlert(message) {
    alert(message);
}

/**
 * Validates if passwords match.
 * @param {string} password - The password input.
 * @param {string} confirmPassword - The confirm password input.
 * @returns {boolean} Returns true if passwords match, false otherwise.
 */
function validatePassword(password, confirmPassword) {
    if (password !== confirmPassword) {
        displayAlert("Passwort und Bestätigung stimmen nicht überein");
        return false;
    }
    return true;
}

/**
 * Changes the image source and cursor style.
 * @param {string} id - The ID of the element.
 */
function changeImg(id) {
    let lock = document.getElementById(id);
    let eyeClose = '../assets/img/password_dont.svg';
    lock.src = eyeClose;
    lock.style.cursor = 'pointer';
    lock.setAttribute('onclick', `changeShow('${id}')`)
}

/**
 * Toggles password visibility.
 * @param {string} id - The ID of the element.
 */
function changeShow(id) {
    let passwordElement = document.getElementById(`password${id}`);
    let lockImg = document.getElementById(id);
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

/**
 * Redirects to the login page.
 */
function redirectToLoginPage() {
    window.location.href = "../html/index.html";
}

/**
 * Shows a success button and hides it after a delay.
 */
function showSuccessButton() {
    let successLightbox = document.getElementById('success-lightbox');
    let successButton = document.getElementById('success');
    successLightbox.style.display = 'flex';
    setTimeout(() => {
        successButton.style.transition = 'transform 1s ease-in-out';
        successButton.style.transform = 'translateY(30%)';
        setTimeout(() => {
            successLightbox.style.display = 'none';
            successButton.style.transform = 'translateY(100%)';
            redirectToLoginPage();
        }, 2000);
    }, 150)
}
