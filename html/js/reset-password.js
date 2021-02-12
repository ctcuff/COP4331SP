const firstNameInput = document.querySelector('#first-name');
const lastNameInput = document.querySelector('#last-name');
const usernameInput = document.querySelector('#username');
const newPasswordInput = document.querySelector('#password');
const confirmPasswordInput = document.querySelector('#password-confirm');
const submitBtn = document.querySelector('.btn-submit');

// Elements related to the error message that shows if something
// goes wrong during account creation
const errorContainer = document.querySelector('.message--error');
const errorCloseBtn = errorContainer.querySelector('.message-close-btn');
const errorTitle = errorContainer.querySelector('.message-title');
const errorBody = errorContainer.querySelector('.message-body');

// Elements related to the success message
const successContainer = document.querySelector('.message--success');
const successCloseBtn = successContainer.querySelector('.message-close-btn');

submitBtn.addEventListener('click', resetPassword);
errorCloseBtn.addEventListener('click', closeErrorMessage);
successCloseBtn.addEventListener('click', closeSuccessMessage);

Array.from(document.querySelectorAll('input')).forEach(input => {
  input.addEventListener('keydown', onEnterPress);
});

function onEnterPress(event) {
  if (event.key === 'Enter' && !event.repeat) {
    event.preventDefault();
    resetPassword();
  }
}

/**
 * @returns {boolean} True if all inputs are valid, false otherwise.
 */
function validateInputs() {
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const username = usernameInput.value.trim();
  const newPassword = newPasswordInput.value.trim();
  const passwordConfirmed = confirmPasswordInput.value.trim();

  // Don't allow any empty input values
  if (!firstName || !lastName || !username || !newPassword) {
    showErrorMessage('Missing fields', "Make sure you've filled out every field.");
    return false;
  }

  if (newPassword !== passwordConfirmed) {
    showErrorMessage("Passwords don't match", 'Make sure both passwords match.');
    return false;
  }

  if (newPassword.length < 5 || newPassword.length > 32) {
    showErrorMessage(
      'Invalid password length',
      'Password must be between 5 and 32 characters.'
    );
    return false;
  }

  if (newPassword.includes(' ')) {
    showErrorMessage(
      'Invalid username or password',
      'Username and password cannot contain spaces.'
    );
    return false;
  }

  return true;
}

function resetPassword() {
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const username = usernameInput.value.trim();
  const password = newPasswordInput.value.trim();

  if (validateInputs()) {
    updateAccount({
      firstName,
      lastName,
      username,
      password
    });
  }
}

/**
 * Makes a request to the reset password API
 * @param {Object} account
 * @param {string} account.firstName
 * @param {string} account.lastName
 * @param {string} account.username
 * @param {string} account.password
 */
function updateAccount(account) {
  const { firstName, lastName, username } = account;
  const newPassword = md5(account.password);

  const postBody = {
    First_Name: firstName,
    Last_Name: lastName,
    Username: username,
    Password: newPassword
  };

  closeErrorMessage();

  fetch(BASE_API_URL + '/ChangePassword.php', {
    method: 'POST',
    body: JSON.stringify(postBody),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        handleApiError(res.error);
      } else {
        showSuccessMessage();
      }
    })
    .catch(err => {
      console.error(err);
      handleApiError(UNKNOWN_ERROR);
    });
}

/**
 * Displays the error message based on the error code
 * returned from the server
 * @param {string} errorCode
 */
function handleApiError(errorCode) {
  let errorTitle;
  let errorMessage;

  switch (errorCode) {
    case NO_USER:
      errorTitle = 'Invalid credentials';
      errorMessage =
        "Make sure the information you've provided is correct and try again.";
      break;
    default:
      errorTitle = 'Error making request';
      errorMessage =
        'An error occurred while resetting your password. Please try again.';
      break;
  }

  showErrorMessage(errorTitle, errorMessage);
}

/**
 * @param {string} title
 * @param {string} message
 */
function showErrorMessage(title, message) {
  errorContainer.style.display = 'flex';
  errorTitle.innerText = title;
  errorBody.innerText = message;
  errorContainer.scrollIntoView();
  closeSuccessMessage();
}

function showSuccessMessage() {
  successContainer.style.display = 'flex';
  successContainer.scrollIntoView();
  closeErrorMessage();
}

function closeErrorMessage() {
  errorContainer.style.display = 'none';
}

function closeSuccessMessage() {
  successContainer.style.display = 'none';
}
