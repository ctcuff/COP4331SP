const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const submitBtn = document.querySelector('.btn-submit');

// Elements related to the error message that shows if something
// goes wrong during sign in.
const errorContainer = document.querySelector('.error-message');
const errorCloseBtn = document.querySelector('.error-message-close-btn');
const errorTitle = document.querySelector('.error-message-title');
const errorBody = document.querySelector('.error-message-body');

errorCloseBtn.addEventListener('click', hideErrorMessage);
submitBtn.addEventListener('click', login);

function login() {
  const username = usernameInput.value.trim();
  let password = passwordInput.value.trim();

  if (!username || !password) {
    return;
  }

  password = md5(password);

  const postData = {
    Username: username,
    Password: password
  };

  fetch(BASE_API_URL + '/Login.php', {
    method: 'POST',
    body: JSON.stringify(postData),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        handleSignInError(res.error);
      } else {
        saveCookie(username, password, res.ID);
        // Switches to manage page after successfully logging in
        window.location.href = '/manage';
      }
    })
    .catch(err => {
      console.error(err);
      handleSignInError(UNKNOWN_ERROR);
    });
}

/**
 * @param {string} username
 * @param {string} hashedPassword
 * @param {string} userId
 */
function saveCookie(username, hashedPassword, userId) {
  const minutes = 20;
  const date = new Date();
  // Set the cookie to expire in 20 minutes
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie = `username=${username},password=${hashedPassword},userId=${userId};expires=${date.toGMTString()}`;
}

/**
 * Displays the error message based on the error code
 * returned from the server
 * @param {string} errorCode
 */
function handleSignInError(errorCode) {
  let errorTitle;
  let errorMessage;

  switch (errorCode) {
    case NO_USER:
    case WRONG_PASS:
      errorTitle = 'Invalid username or password';
      errorMessage = 'Check your credentials and try again.';
      break;
    default:
      errorTitle = 'Error signing in';
      errorMessage = 'An error occurred while signing in. Please try again.';
      break;
  }

  showErrorMessage(errorTitle, errorMessage);
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
}

function hideErrorMessage() {
  errorContainer.style.display = 'none';
}
