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
}

function searchContact()
{
    const querySearch = {
      User_ID: userId,
      Query: document.getElementById("searchBar").value
    };

    var url = urlBase + '/SearchContact.php';
    var contactList = "";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                var jsonObject = JSON.parse( xhr.responseText );

                for( var i=0; i<jsonObject.contacts.length; i++ )
                {
                    contactList += "<tr>";
                    contactList += "<td>" + jsonObject.contacts[i].First_Name + " ";
                    contactList += jsonObject.contacts[i].Last_Name + "</td>";
                    contactList += "<td>" + jsonObject.contacts[i].Phone + "</td>";
                    contactList += "<td>" + jsonObject.contacts[i].Email + "</td>";
                    contactList += "</tr>";
                }
                document.getElementById("tableRow").innerHTML += contactList;
            }
        };
        xhr.send(JSON.stringify(querySearch));
    }
    catch(err)
    {
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
