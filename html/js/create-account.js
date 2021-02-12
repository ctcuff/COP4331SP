const firstNameInput = document.querySelector('#first-name');
const lastNameInput = document.querySelector('#last-name');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const submitBtn = document.querySelector('.btn-submit');

// Elements related to the error message that shows if something
// goes wrong during account creation
const errorContainer = document.querySelector('.message--error');
const errorCloseBtn = errorContainer.querySelector('.message-close-btn');
const errorTitle = errorContainer.querySelector('.message-title');
const errorBody = errorContainer.querySelector('.message-body');

submitBtn.addEventListener('click', register);
errorCloseBtn.addEventListener('click', closeErrorMessage);

Array.from(document.querySelectorAll('input')).forEach(input => {
  input.addEventListener('keydown', onEnterPress);
});

function onEnterPress(event) {
  if (event.key === 'Enter' && !event.repeat) {
    event.preventDefault();
    register();
  }
}

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
 * @returns {boolean} True if all inputs are valid, false otherwise.
 */
function validateInputs() {
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  // Don't allow any empty input values
  if (!firstName || !lastName || !username || !password) {
    showErrorMessage('Missing fields', "Make sure you've filled out every field.");
    return false;
  }

  if (firstName.length > 20 || lastName.length > 20) {
    showErrorMessage(
      'Length exceeded',
      'First and last names cannot exceed 20 characters.'
    );
    return false;
  }

  if (username.length < 3 || username.length > 20) {
    showErrorMessage(
      'Invalid username length',
      'Username must be between 3 and 20 characters.'
    );
    return false;
  }

  if (password.length < 5 || password.length > 32) {
    showErrorMessage(
      'Invalid password length',
      'Password must be between 5 and 32 characters.'
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
 * Registers a new user with the details provided
 * @param {Object} userInfo
 * @param {string} userInfo.firstName
 * @param {string} userInfo.lastName
 * @param {string} userInfo.username
 * @param {string} userInfo.password
 */
function createAccount(userInfo) {
  const { firstName, lastName, username } = userInfo;
  const password = md5(userInfo.password);

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
    .then(res => {
      if (res.error) {
        handleRegisterError(res.error);
      } else {
        saveCookie({
          username,
          password,
          userId: res.ID
        });
        window.location.href = '/manage';
      }
    })
    .catch(err => {
      console.error(err);
      handleRegisterError(UNKNOWN_ERROR);
    })
    .finally(() => toggleSubmitButton(false));
}

/**
 * Displays the error message based on the error code
 * returned from the server
 * @param {string} errorCode
 */
function handleRegisterError(errorCode) {
  let errorTitle;
  let errorMessage;

  switch (errorCode) {
    case DUP_USER:
      errorTitle = 'Username taken';
      errorMessage = 'An account with this username already exists.';
      break;
    default:
      errorTitle = 'Error creating account';
      errorMessage =
        'An error occurred while creating your account. Please try again.';
      break;
  }

  showErrorMessage(errorTitle, errorMessage);
}

/**
 * Takes an object of key value pairs and adds each
 * key/value pair to document.cookie.
 * @param {Object.<string, any>} cookieObj
 */
function saveCookie(cookieObj) {
  const minutes = 20;
  const date = new Date();
  // Set the cookie to expire in 20 minutes
  date.setTime(date.getTime() + minutes * 60 * 1000);

  // Loop through the cookieObj to save each cookie individually
  Object.keys(cookieObj).forEach(key => {
    const value = cookieObj[key];
    document.cookie = `${key}=${value};expires=${date.toGMTString()};path=/`;
  });
}

/**
 * Displays the error message at the bottom of the page.
 *
 * @param {string} title
 * @param {string} message
 */
function showErrorMessage(title, message) {
  errorContainer.style.display = 'flex';
  errorTitle.innerText = title;
  errorBody.innerText = message;
  errorContainer.scrollIntoView();
}

function closeErrorMessage() {
  errorContainer.style.display = 'none';
}

/**
 * Enables/disables the submit button
 * @param {boolean} isDisabled
 */
function toggleSubmitButton(isDisabled) {
  submitBtn.disabled = isDisabled;
}
