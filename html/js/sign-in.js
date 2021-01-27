const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const submitBtn = document.querySelector('.btn-submit');

// Elements related to the error message that shows if something
// goes wrong during sign in.
const errorContainer = document.querySelector('.message--error');
const errorCloseBtn = errorContainer.querySelector('.message-close-btn');
const errorTitle = errorContainer.querySelector('.message-title');
const errorBody = errorContainer.querySelector('.message-body');

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
        saveCookie({
          username,
          password,
          userId: res.ID
        });
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
 * Takes an object of key value pairs and adds each
 * key/value to document.cookie.
 * @param {Object.<string, any>} cookieObj
 */
function saveCookie(cookieObj) {
  const minutes = 20;
  const date = new Date();
  // Set the cookie to expire in 20 minutes
  date.setTime(date.getTime() + minutes * 60 * 1000);

  // Loop through cookieObj to save each cookie individually
  Object.keys(cookieObj).forEach(key => {
    const value = cookieObj[key];
    document.cookie = `${key}=${value};expires=${date.toGMTString()};path=/`;
  });
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
