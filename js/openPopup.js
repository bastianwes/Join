/**
 * Opens a popup with provided functionalities.
 *
 * @param {Function} closure - The closure function.
 * @param {Function} createMarkup - The function to create markup for the popup.
 * @param {Function} setupState - The function to set up the initial state of the popup.
 * @param {Function} applyState - The function to apply state changes to the popup.
 * @param {Function} wireUpListeners - The function to wire up event listeners for the popup.
 * @param {Function} afterClose - The function to execute after the popup is closed.
 */
function openPopup(closure, createMarkup, setupState, applyState, wireUpListeners, afterClose) {
  let content = createMarkup();
  let [root, bg] = setUpGenericPopup(content);
  let state = setupState(root, closure);
  let close = () => {
    root.remove();
    bg.remove();
    removeOverlay();
    afterClose();
  };
  bg.addEventListener('click', close);
  wireUpListeners(
    state,
    close,
    applyState,
  );
  applyState(state, applyState);
}

/**
 * Removes the overlay element from the DOM if it exists.
 */
function removeOverlay() {
  let overlay = document.querySelector('.overlay');
  if (overlay) {
    overlay.remove();
  }
}

/**
 * Creates a background element for the popup.
 *
 * @returns {HTMLElement} The created background element.
 */
function createBackground() {
  let preExisting = document.querySelector('.background-modal');
  if (preExisting !== null) {
    preExisting.remove();
  }
  let background = document.createElement('div');
  background.className = 'background-modal';
  document.body.appendChild(background);
  return background;
}

/**
 * Sets up the generic popup with the provided content.
 *
 * @param {string} content - The content for the popup.
 * @returns {[HTMLElement, HTMLElement]} An array containing the root element and background element.
 */
function setUpGenericPopup(content) {
  let bg = createBackground();
  let root = document.querySelector('#popup') || document.createElement('div');
  if (root.id === 'popup') {
    root.innerHTML = '';
    root.style.padding = '10px 30px';
    let overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
  } else {
    root.id = 'popup';
    document.body.appendChild(root);
    root.style.animation = 'slideIn 0.3s forwards';
  }
  root.innerHTML += content;
  return [root, bg];
}
