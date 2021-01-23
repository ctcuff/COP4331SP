const firstNameInput = document.querySelector('#first-name');
const lastNameInput = document.querySelector('#last-name');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const submitBtn = document.querySelector('.btn-submit');

// Elements related to the error message that shows if something
// goes wrong during account creation
const errorContainer = document.querySelector('.error-message');
const errorCloseBtn = document.querySelector('.error-message-close-btn');
const errorTitle = document.querySelector('.error-message-title');
const errorBody = document.querySelector('.error-message-body');

function register() {
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (validateInputs()) {
    createAccount({ firstName, lastName, username, password });
  }
}

/**
 * Return true if all inputs are valid, false otherwise.
 * @returns {Boolean}
 */
function validateInputs() {
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  // Don't allow any empty input values
  if (!firstName || !lastName || !username || !password) {
    showErrorMessage(
      'Missing fields',
      "Make sure you've filled out every field."
    );
    return false;
  }

  if (firstName.length > 16 || lastName.length > 16) {
    showErrorMessage(
      'Length exceeded',
      'First and last names cannot exceed 16 characters.'
    );
    return false;
  }

  if (username.length < 3 || username.length > 16) {
    showErrorMessage(
      'Invalid username length',
      'Username must be between 3 and 16 characters.'
    );
    return false;
  }

  if (password.length < 5) {
    showErrorMessage(
      'Password too short',
      'Password must be at least 5 characters long.'
    );
    return false;
  }

  if (username.includes(' ') || password.includes(' ')) {
    showErrorMessage(
      'Invalid username or password',
      'Username and password cannot contain spaces.'
    );
    return false;
  }

  return true;
}

/**
 * @param {Object} userInfo Registers a new user with the details provided
 * @param {String} userInfo.firstName
 * @param {String} userInfo.lastName
 * @param {String} userInfo.username
 * @param {String} userInfo.password
 */
function createAccount(userInfo) {
  const { firstName, lastName, username, password } = userInfo;

  // The data that's sent to the API for user registration
  const postData = {
    Username: username,
    Password: password,
    First_Name: firstName,
    Last_Name: lastName
  };

  // Disable the submit button to prevent multiple
  // clicks when registering an account
  toggleSubmitButton(true);
  closeErrorMessage();

  fetch(BASE_API_URL + '/Register.php', {
    method: 'POST',
    body: JSON.stringify(postData),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => {
      console.error(err);
      showErrorMessage(
        'Error creating account',
        'An unknown error occurred. Please try again.'
      );
    })
    .finally(() => toggleSubmitButton(false));
}

/**
 * Displays the error message at the bottom of the page.
 *
 * @param {String} title
 * @param {String} message
 */
function showErrorMessage(title, message) {
  errorContainer.style.display = 'flex';
  errorTitle.innerText = title;
  errorBody.innerText = message;
}

function closeErrorMessage() {
  errorContainer.style.display = 'none';
}

/**
 * Enables/disables the submit button
 * @param {Boolean} isDisabled
 */
function toggleSubmitButton(isDisabled) {
  submitBtn.disabled = isDisabled;
}

submitBtn.addEventListener('click', register);
errorCloseBtn.addEventListener('click', closeErrorMessage);
