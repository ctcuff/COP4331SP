const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const submitBtn = document.querySelector('.btn-submit');
const errorContainer = document.querySelector('.error-message');
const errorCloseBtn = document.querySelector('.error-message-close-btn');

function login() {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    return;
  }

  const postData = {
    Username: username,
    Password: password
  };

  // Does this fulfill the AJAX requirements?
  fetch('http://ourcontactmanager.rocks/API/Login.php', {
    method: 'POST',
    body: JSON.stringify(postData),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        showErrorMessage();
      }
    })
    .catch(err => console.log(err));

    // Saves a cookie
    // saveCookie();

    // Switches to manage page after successfully logging in
    window.location.href = "/manage/index.html";
}


// function saveCookie()
// {
// 	var minutes = 20;
// 	var date = new Date();
// 	date.setTime(date.getTime()+(minutes*60*1000));
// 	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
// }


// function readCookie()
// {
// 	userId = -1;
// 	var data = document.cookie;
// 	var splits = data.split(",");
// 	for(var i = 0; i < splits.length; i++)
// 	{
// 		var thisOne = splits[i].trim();
// 		var tokens = thisOne.split("=");
// 		if( tokens[0] == "firstName" )
// 		{
// 			firstName = tokens[1];
// 		}
// 		else if( tokens[0] == "lastName" )
// 		{
// 			lastName = tokens[1];
// 		}
// 		else if( tokens[0] == "userId" )
// 		{
// 			userId = parseInt( tokens[1].trim() );
// 		}
// 	}
//
// 	if( userId < 0 )
// 	{
// 		window.location.href = "index.html";
// 	}
// 	else
// 	{
// 		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
// 	}
// }


function showErrorMessage() {
  errorContainer.style.display = 'flex';
}

function hideErrorMessage() {
  errorContainer.style.display = 'none';
}

submitBtn.addEventListener('click', login);
errorCloseBtn.addEventListener('click', hideErrorMessage);
