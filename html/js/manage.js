const openButtons = document.querySelectorAll('[data-btn-target]');
const closeButtons = document.querySelectorAll('[data-close-btn]');
const overlay = document.getElementById('overlay');
const addContactBtn = document.querySelector('#addContactButton');
const userId = getCookie('userId');
const urlBase = 'http://ourcontactmanager.rocks/API';

if (!userId) window.location.href = '/sign-in';

openButtons.forEach(button => {
    button.addEventListener('click', () => {
        const btn = document.querySelector(button.dataset.btnTarget)
        openButton(btn);
    })
})

overlay.addEventListener('click', () => {
    const buttons = document.querySelectorAll('.btn.active')
    buttons.forEach(button => {
        closeButton(button);
    })
})

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const btn = button.closest('.btn');
        closeButton(btn);
    })
})

addContactBtn.addEventListener('click', addContact);

function openButton(button)
{
    if (button == null) return;
    button.classList.add('active');
    overlay.classList.add('active');
}

function closeButton(button)
{
    if (button == null) return;
    button.classList.remove('active');
    overlay.classList.remove('active');
}

function addContact()
{
    // *** Tested and the correct strings are returned ***
    const firstName = document.getElementById("addFirstNameButton").value.trim();
    const lastName = document.getElementById("addLastNameButton").value.trim();
    const phoneNumber = document.getElementById("addPhoneNumberButton").value.trim();
    const email = document.getElementById("addEmailButton").value.trim();

    if (!userId) return;
    if (!firstName || !lastName) return;
    if (!phoneNumber) phoneNumber = '';
    if (!email) email = '';

	var jsonPayload = '{"User_ID" : "' + userId + '", "First_Name" : "' + firstName + '", "Last_Name" : "' + lastName + '", "Phone" : "' + phoneNumber + '", "Email" : "' + email + '"}';
    var url = urlBase + '/CreateContact.php';

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.send(jsonPayload);
	// try
	// {
    //     //*** Is this necessary? ***
	// 	xhr.onreadystatechange = function()
	// 	{
	// 		if (this.readyState == 4 && this.status == 200)
	// 		{
    //             // Prints information in span tag
	// 			//document.getElementById("colorAddResult").innerHTML = "Color has been added";
	// 		}
	// 	};
	// }
	// catch(err)
	// {
    //     // Prints information in span tag
	// 	//document.getElementById("colorAddResult").innerHTML = err.message;
	// }
}

function searchContact()
{
    const firstName = "l";
    const lastName = "";
    const phoneNumber = "";
    const email = "";
    // const firstName = document.getElementById("searchBar").value;
    // const lastName = '';
    // const email = '';
    // const phoneNumber = '';

    var contactList = "";

    var jsonPayload = '{"User_ID" : "' + userId + '", "First_Name" : ' + firstName + '", "Last_Name" : ' + lastName + '", "Phone" : ' + phoneNumber + '", "Email" : ' + email + '}';
    var url = urlBase + '/SearchContact.php';

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                // document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
                var jsonObject = JSON.parse( xhr.responseText );

                for( var i=0; i<jsonObject.contacts.length; i++ )
                {
                    contactList += jsonObject.contacts[i];
                    if( i < jsonObject.contacts.length - 1 )
                    {
                        contactList += "<br />\r\n";
                    }
                }

                document.getElementById("tableRow").innerHTML = contactList;
                // document.getElementsByTagName("p")[0].innerHTML = colorList;
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        // document.getElementById("colorSearchResult").innerHTML = err.message;
    }

}

function getCookie(name) {
  // Creates a string array with each cookie key value pair.
  // This looks like ["cookie=value", ...]
  const cookies = document.cookie.split(';');

  // Loop through each cookie to see if it contains the
  // key we're looking for
  for (let i = 0; i < cookies.length; i++) {
    const [key, value] = cookies[i].split('=');

    if (key.trim() === name) {
      return value;
    }
  }

  // Cookie wasn't found so just return null
  return null;
}
