/**
 * Initializes contacts by loading internal page.
 * @returns {Promise<void>} A promise that resolves when contacts are initialized.
 */
async function initContacts() {
    lockPage();
    await loadInternalPage();
    contactPageInit();
    unlockPage();
}

let contactId = generateContactId();
let selectedElement = null;

/**
 * Displays contacts in the console.
 */
function displayContacts() {
}

/**
 * Opens a contact with provided information.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phoneNumber - The phone number of the contact.
 * @param {string} randomColor - The random color of the contact.
 * @param {string} contactId - The ID of the contact.
 */
function openContact(name, email, phoneNumber, randomColor, contactId) {

    let contactInfoHTML = `
        <div class="contact-info" data-contactId="${contactId}">
            <div class="initial-circle">
                <span class="big-contact-icon margin-left" id="big-contact-icon-0" style="background-color: ${randomColor};">${getInitials(name)}</span>
            </div>
            <div class="info-div">
                <div class="contact-name"><h1>${name}<h1></div>
                <img src="../assets/img/arrow.svg" class="arrow-mobile" onclick="goBack()">
                <div class="edit-box">
                    <div class="edit-btn" onclick="editContact('${contactId}', '${name}', '${email}', '${phoneNumber}')"><img src="../assets/img/editContact.svg">Edit</div>
                    <div class="delete-btn" onclick="deleteContact('${name}')"><img src="../assets/img/delete.svg">Delete</div>
                </div>
                <div class="contact-information">
                    <div class="contact-information-headline">Contact Information</div>
                    <div class="email-single-view-container">
                        <span>Emails</span>
                        <span>${email}</span>
                    </div>
                    <div class="phone-single-view-container">
                        <span>Phone</span>
                        <span>${phoneNumber}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Anzeigen des Kontakt-HTMLs in einem bestimmten Bereich der Seite
    let showContactDiv = document.getElementById('show-contact');
    showContactDiv.innerHTML = contactInfoHTML;
    showContactDiv.classList.remove('d-none');
}

/**
 * Hides the edit overlay.
 */
function hideOverlayEdit() {
    let editOverlay = document.getElementById('overlay-edit-contact');
    if (editOverlay) {
        editOverlay.classList.remove('show-overlay');
    }
}

/**
 * Hides the add overlay.
 */
function hideOverlayAdd() {
    let editOverlay = document.getElementById('overlay-add-contact');
    if (editOverlay) {
        editOverlay.classList.remove('show-overlay');
    }
}

/**
 * Generates a random contact ID.
 * @returns {string} A randomly generated contact ID.
 */
function generateContactId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Saves a new contact.
 * @returns {Promise<void>} A promise that resolves when the contact is saved.
 */
async function saveContact() {
    let name = document.getElementById('add-name').value;
    let email = document.getElementById('add-email').value;
    let phone = document.getElementById('add-phone').value;
    let initials = getInitials(name);
    let contactId = generateContactId();

    let contact = {
        'add-name': name,
        'add-email': email,
        'add-phone': phone,
        'initials': initials,
        'contactId': contactId,
        color: getRandomColor(),
    };

    let insertIndex = 0;
    while (insertIndex < state.contacts.length && state.contacts[insertIndex]['add-name'].localeCompare(name) < 0) {
        insertIndex++;
    }

    state.contacts.splice(insertIndex, 0, contact);

    // Handle errors during saving process
    try {
        await persistContacts(state.contacts, state.currentUser.email);
        displayAllContacts(); // Update the contacts list
        hideOverlayAdd();
    } catch (error) {
        console.error('Error saving contact:', error);
        // Handle error (e.g., display error message to user)
    }
}

/**
 * Loads all contacts.
 * @returns void
 */
function displayAllContacts() {
    let allContacts = state.contacts;
    let newContactsDiv = document.getElementById('new-contacts');
    if (allContacts && allContacts.length > 0) {
        newContactsDiv.innerHTML = '';

        let currentLetter = '';
        allContacts.forEach((contact, index) => {
            if (contact['add-name']) {
                let name = contact['add-name'];
                let firstLetter = name.charAt(0).toUpperCase();
                if (firstLetter !== currentLetter) {
                    newContactsDiv.innerHTML += `<div class="first-letter">${firstLetter}</div>`;
                    newContactsDiv.innerHTML += `<div class="separate-contacts" id="div-separate-contacts-${index}"></div>`;
                    currentLetter = firstLetter;
                }

                let randomColor = getRandomColor();
                let initials = getInitials(name);

                // Hier wird die Kontakt-ID als Parameter übergeben
                let contactHTML = `
                <div class="new-contact-box" data-contactId="${contact['contactId']}" onclick="toggleSelection(this, '${name}', '${contact['add-email']}', '${contact['add-phone']}', '${randomColor}', '${contact['contactId']}')">
               <span class="small-contact-icon" style="background-color: ${randomColor};">${initials}</span>
               <div>
                    <div class="name">${name}</div>
                    <div class="email">${contact['add-email']}</div>
                    <div class="phone d-none">${contact['add-phone']}</div>
                 </div>
                </div>`;
                newContactsDiv.innerHTML += contactHTML;
            } else {
                console.error("Name property not defined for contact:", contact);
            }
        });
    } else {
        newContactsDiv.innerHTML = '<p>No contacts found.</p>';
    }
}

/**
 * Toggles selection of a contact element.
 * @param {HTMLElement} element - The HTML element of the contact.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} randomColor - The random color of the contact.
 * @param {string} contactId - The ID of the contact.
 */
function toggleSelection(element, name, email, phone, randomColor, contactId) {
    // Check if viewport width is greater than or equal to 480 pixels
    let contactInfoDiv = document.getElementById('show-contact');
    contactInfoDiv.style.display = 'flex';
    if (window.innerWidth >= 480) {
        // Wenn das ausgewählte Element das gleiche ist wie das angeklickte Element,
        // hebe die Auswahl auf (setze die Farben zurück)
        if (selectedElement === element) {
            element.style.backgroundColor = "";
            element.style.color = "";
            selectedElement = null;
        } else {
            // Deselectiere zuerst das zuvor ausgewählte Element, falls vorhanden
            if (selectedElement) {
                selectedElement.style.backgroundColor = "";
                selectedElement.style.color = "";
            }

            // Wähle das aktuelle Element aus
            element.style.backgroundColor = "rgb(42, 54, 71)";
            element.style.color = "white";
            selectedElement = element;
        }

        // Führe andere Aktionen bei Bedarf aus
        openContact(name, email, phone, randomColor, contactId);
    }
}

/**
 * Generates a random color.
 * @returns {string} A randomly generated color code.
 */
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Generates initials from a name.
 * @param {string} name - The name to generate initials from.
 * @returns {string} Initials generated from the name.
 */
function getInitials(name) {
    let names = name.split(' ');
    let initials = names[0].charAt(0).toUpperCase();
    if (names.length > 1) {
        initials += names[names.length - 1].charAt(0).toUpperCase();
    }
    return initials;
}

function contactPageInit() {
    let addButton = document.querySelector('.add-button');
    if (addButton) {
        addButton.addEventListener('click', openContactOverlay);
    }

    let closeButtons = document.querySelectorAll('.close-button');
    if (closeButtons) {
        closeButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                hideOverlayAdd();
                hideOverlayEdit();
            });
        });
    }

    let deleteButtons = document.querySelectorAll('.delete-btn');
    if (deleteButtons) {
        deleteButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                let contactName = button.parentElement.parentElement.querySelector('.contact-name h1').textContent;
                deleteContact(contactName, allContacts);  // Pass allContacts as an argument
            });
        });
    }

    let newContactsDiv = document.getElementById('new-contacts');
    if (newContactsDiv) {
        newContactsDiv.addEventListener('click', function (event) {
            let clickedContactBox = event.target.closest('.new-contact-box');
            if (clickedContactBox) {
                let page = document.querySelector('.content');
                page.classList.remove('contact-opened');

                let contactInfoDiv = document.getElementById('show-contact');
                let contactName = clickedContactBox.querySelector('.name').textContent;
                let contactEmail = clickedContactBox.querySelector('.email').textContent;
                let contactPhoneNumber = clickedContactBox.querySelector('.phone').textContent;
                let randomColor = clickedContactBox.querySelector('.small-contact-icon').style.backgroundColor;
                let contactId = clickedContactBox.getAttribute('data-contactId');

                page.classList.add('contact-opened');
                openContact(contactName, contactEmail, contactPhoneNumber, randomColor, contactId);

                contactInfoDiv.style.display = 'block';
            }
        });
    }

    displayAllContacts();
};

/**
 * Clears the add contact form.
 */
function clearAddContactForm() {
    document.getElementById('add-name').value = '';
    document.getElementById('add-email').value = '';
    document.getElementById('add-phone').value = '';
}

/**
 * Opens the contact overlay for adding a contact.
 * @param {string} [contactName] - The name of the contact.
 * @param {string} [contactEmail] - The email of the contact.
 * @param {string} [contactPhoneNumber] - The phone number of the contact.
 */
function openContactOverlay(contactName, contactEmail, contactPhoneNumber) {

    clearAddContactForm();

    let editOverlay = document.getElementById('overlay-add-contact');
    if (editOverlay) {
        editOverlay.classList.add('show-overlay');
    }

    let initials = '';
    if (typeof contactName === 'string') {
        initials = getInitials(contactName);
    }
}

/**
 * Edits a contact.
 * @param {string} contactId - The ID of the contact to edit.
 * @param {string} name - The new name for the contact.
 * @param {string} email - The new email for the contact.
 * @param {string} phoneNumber - The new phone number for the contact.
 */
function editContact(contactId, name, email, phoneNumber) {

    // Get the edit input fields container
    let editFormContainer = document.getElementById('edit-input-fields');

    // Check if the edit input fields container exists
    if (editFormContainer) {
        // Generate the HTML for the edit contact form
        let editFormHTML =/*html*/ `
            <form onsubmit="saveEditedContact('${contactId}'); return false">
                <input type="hidden" id="edit-contact-id" value="${contactId}">
                <input required="" class="input person-icon" type="text" id="edit-name" placeholder="Name" pattern="[A-Za-zÄäÖöÜüß ]+" maxlength="23" value="${name}">
                <input required="" class="input email-icon" type="email" id="edit-email" placeholder="Email" maxlength="23" value="${email}">
                <input required="" class="input phone-icon" type="tel" id="edit-phone" placeholder="Phone" pattern="[0-9+s ]*" maxlength="24" value="${phoneNumber}">
                <div class="overlay-buttons">
                    <div onclick="deleteContact('${name}')" class="delete-button">
                        Delete
                    </div>
                    <button class="save-button" type="submit">
                        Save <img src="../assets/img/check.svg" alt="checkmark-image">
                    </button>
                </div>
            </form>
        `;

        // Set the HTML of the edit input fields container to the generated HTML
        editFormContainer.innerHTML = editFormHTML;
    }

    // Show the edit overlay
    let editOverlay = document.getElementById('overlay-edit-contact');
    if (editOverlay) {
        editOverlay.classList.add('show-overlay');
    }
}

/**
 * Function to go back, exiting contact mode and hiding the contact information div.
 */
function goBack() {
    let page = document.querySelector('.content');
    page.classList.remove('contact-opened');
    document.getElementById('show-contact').style.display = 'none';
}

/**
 * Toggles the visibility of overlay header.
 */
function overlayHeaderShow() {
    let overlayHeader = document.getElementById('overlay-header');
    overlayHeader.classList.toggle('overlay-hidden');
}

/**
 * Deletes a contact.
 * @param {string} name - The name of the contact to delete.
 * @returns {Promise<void>} A promise that resolves when the contact is deleted.
 */
async function deleteContact(name) {
    let indexToDelete = state.contacts.findIndex(contact => contact['add-name'] === name);

    if (indexToDelete !== -1) {
        let [deleted] = state.contacts.splice(indexToDelete, 1);

        // clean up
        let id = deleted['contactId'];
        for (const task of state.tasks) {
            if (!task.contacts.includes(id)) { continue; }
            task.contacts = task.contacts.filter(candidate => candidate !== id);
        }
        persistTasks(state.tasks, state.currentUser.email);

        // Speichern Sie die Kontakte remote (in Ihrer Datenbank)
        await persistContacts(state.contacts, state.currentUser.email);

        // Entfernen Sie das HTML-Element, das den Kontakt darstellt
        let contactInfoDiv = document.querySelector(`.contact-info[data-contactName="${name}"]`);
        if (contactInfoDiv) {
            contactInfoDiv.remove();
        }
    }
    hideOverlayEdit();
    displayAllContacts(state.contacts);

    // Hide the contact info div
    let showContactDiv = document.getElementById('show-contact');
    if (showContactDiv) {
        showContactDiv.classList.add('d-none');
    }
    location.reload();
}

/**
 * Saves an edited contact.
 * @param {string} contactId - The ID of the contact to save.
 * @returns {Promise<void>} A promise that resolves when the contact is saved.
 */
async function saveEditedContact(contactId) {
    let editedName = document.getElementById('edit-name').value;
    let editedEmail = document.getElementById('edit-email').value;
    let editedPhone = document.getElementById('edit-phone').value;

    let indexToEdit = state.contacts.findIndex(contact => contact['contactId'] === contactId);

    if (indexToEdit !== -1) {
        // Update contact information
        state.contacts[indexToEdit]['add-name'] = editedName;
        state.contacts[indexToEdit]['add-email'] = editedEmail;
        state.contacts[indexToEdit]['add-phone'] = editedPhone;

        // Save changes remotely
        await persistContacts(state.contacts, state.currentUser.email);

        // Update contact-info elements
        let contactInfoDiv = document.querySelector(`.contact-info[data-contactId="${contactId}"]`);
        if (contactInfoDiv) {
            contactInfoDiv.querySelector('.contact-name h1').textContent = editedName;
            contactInfoDiv.querySelector('.email-single-view-container span:last-child').textContent = editedEmail;
            contactInfoDiv.querySelector('.phone-single-view-container span:last-child').textContent = editedPhone;
        }

        // Update new-contact-box elements
        let newContactBox = document.querySelector(`.new-contact-box[data-contactId="${contactId}"]`);
        if (newContactBox) {
            newContactBox.querySelector('.name').textContent = editedName;
            newContactBox.querySelector('.email').textContent = editedEmail;
        }
        displayAllContacts();
        hideOverlayEdit();
    }
}
