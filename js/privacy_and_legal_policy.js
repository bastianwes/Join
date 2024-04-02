/**
 * Initializes the notice by loading user information for the internal page.
 * @returns {Promise<void>} A Promise that resolves when the user information is loaded.
 */
async function initNotice() {
    await loadUserOfInternalPage();
}

/**
 * Navigates back to the previous page in the browser history.
 */
function goBack() {
    window.history.back();
}

/**
 * Changes the initials displayed in the top right corner.
 */
function changeName() {
    let userLetter = document.getElementById('userLetter')
    userLetter.innerHTML = signUser['name'].charAt(0).toUpperCase();
}

/**
 * Toggles the visibility of the overlay header.
 */
function overlayHeaderShow() {
    let overlayHeader = document.getElementById('overlay-header');
    overlayHeader.classList.toggle('overlay-hidden');
}