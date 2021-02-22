const openButtons = document.querySelectorAll('[data-btn-target]');
const closeButtons = document.querySelectorAll('[data-close-btn]');
const overlay = document.getElementById('overlay');
const addContactBtn = document.querySelector('.btn-crud--add');
const addContactModal = document.querySelector('.add-contact-modal');
const updateContactBtn = document.querySelector('.btn-crud--update');
const updateContactModal = document.querySelector('.update-contact-modal');
const deleteContactBtn = document.querySelector('.btn-crud--delete');
const deleteContactModal = document.querySelector('.delete-contact-modal');
const userId = getCookie('userId');
const urlBase = 'http://ourcontactmanager.rocks/API';
const searchBar = document.getElementById("searchBar");

if (!userId) window.location.href = '/sign-in';

// user action feedback (toast notification)

const Toast = {
  init() {
    this.hideTimeout = null;

    this.el = document.createElement("div");
    this.el.className = "toast";
    document.body.appendChild(this.el);
  },

  show(message, state) {
    clearTimeout(this.hideTimeout);

    this.el.textContent = message;
    this.el.className = "toast toast--visible";

    if (state) {
      this.el.classList.add(`toast--${state}`);
    }

    this.hideTimeout = setTimeout(() => {
      this.el.classList.remove("toast--visible");
    }, 3000);
  }
};

document.addEventListener("DOMContentLoaded", () => Toast.init());



// Add contact modal
addContactBtn.addEventListener('click', (event) => {
    addContactModal.classList.add('active');
    overlay.classList.add('active');
})

// Update contact modal
updateContactBtn.addEventListener('click', (event) => {
    let activeRow = document.querySelector("tr.active");
    if (!activeRow) return;

    updateContactModal.classList.add('active');
    overlay.classList.add('active');

    let first = document.getElementById("updateFirst");
    let last = document.getElementById("updateLast");
    let phone = document.getElementById("updatePhone");
    let email = document.getElementById("updateEmail");

    first.value = activeRow.children[0].innerText;
    last.value = activeRow.children[1].innerText;
    phone.value = activeRow.children[2].innerText;
    email.value = activeRow.children[3].innerText;
})

// Delete contact modal
deleteContactBtn.addEventListener('click', (event) => {
    let activeRow = document.querySelector("tr.active");
    if (!activeRow) return;

    deleteContactModal.classList.add('active');
    overlay.classList.add('active');
})

let closeModal = overlay.addEventListener('click', () => {
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

viewAll.addEventListener('click', () => {
    document.getElementById("searchBar").value = "";
    searchContact();
});

// Send query to database
addContactButton.addEventListener('click', () => {
    const button = document.querySelector('.btn.active')
    closeButton(button);
    addContact();
});

updateContactButton.addEventListener('click', () => {
    const button = document.querySelector('.btn.active')
    closeButton(button);
    updateContact();
});

searchBar.addEventListener('keydown', onEnterPress);

// load all contacts on window load
window.onload = searchContact;

let locked = false;
deleteContactButton.addEventListener('click', () => {
    const button = document.querySelector('.btn.active')

    if (!locked)
    {
        // Prevent user from deleteing more contacts
        locked = true;
        // Delete only one contact
        deleteContact();

        // Close modal
        setTimeout(function(){
            closeButton(button);
        },1000);

        // Unlocks
        setTimeout(function(){
            locked = false;
            document.getElementsByTagName('h4')[0].innerHTML = "Are you sure you want to delete this contact?";
        },2000);
    }
});

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

    const queryAdd = {
        User_ID: userId,
        First_Name: firstName,
        Last_Name: lastName,
        Phone: phoneNumber,
        Email: email
    }

   var url = urlBase + '/CreateContact.php';
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
   try
   {
      xhr.onreadystatechange = function()
      {
           if (this.readyState == 4 && this.status == 200)
           {
              try
              {
               var jsonObject = JSON.parse( xhr.responseText );
               if(jsonObject.error != "") throw new Error(jsonObject.error);
               Toast.show("Contact added successfully", "success");
               }
               catch(errCode)
               {
                 showErrorWithToast(errCode.message);
               }
           }
      };
      xhr.send(JSON.stringify(queryAdd));
   }
   catch(err)
   {

   }
}

function showErrorWithToast(errCode)
{
   let message = "An unexpected error has occured";
   switch(errCode)
   {
      case "DUP_CONTACT":
         message = "Contact already exists";
         break;
      case "BAD_CONTACT_ID":
         message = "Contact does not exist";
         break;
   }
   Toast.show(message, "error");
}

function searchContact()
{
    const querySearch = {
      User_ID: userId,
      Query: searchBar.value
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

                var table = document.getElementById("tableRow");
                while (table.rows.length > 1) {
                    table.deleteRow(1);
                }

                for( var i=0; i<jsonObject.contacts.length; i++ )
                {
                    contactList += `<tr data-contact-id=${jsonObject.contacts[i].Contact_ID}>`;
                    contactList += "<td>" + jsonObject.contacts[i].First_Name + "</td>";
                    contactList += "<td>" + jsonObject.contacts[i].Last_Name + "</td>";
                    contactList += "<td>" + jsonObject.contacts[i].Phone + "</td>";
                    contactList += "<td>" + jsonObject.contacts[i].Email + "</td>";
                    contactList += "</tr>";
                }
                document.getElementById("tableRow").innerHTML += contactList;

                var elements= document.querySelectorAll('tr:not(tr.header)');
                for(var i=0; i<elements.length;i++)
                {
                    (elements)[i].addEventListener("click", setActive);
                }
            }
        };
        xhr.send(JSON.stringify(querySearch));
    }
    catch(err)
    {
    }
}

function setActive(event)
{
    // let activeElement = document.querySelector(".active");
    // 
    // if (activeElement)
    // {
    //     activeElement.classList.remove("active");
    // }

    event.target.parentElement.classList.toggle("active");
    if(document.querySelectorAll(".active").length == 0)
    {
      updateContactBtn.classList.add("disabledButton");
      deleteContactBtn.classList.add("disabledButton");
   }
   else
   {
      updateContactBtn.classList.remove("disabledButton");
      deleteContactBtn.classList.remove("disabledButton");
   }
}

function updateContact()
{
    let first = document.getElementById("updateFirst").value.trim();
    let last = document.getElementById("updateLast").value.trim();
    let phone = document.getElementById("updatePhone").value.trim();
    let email = document.getElementById("updateEmail").value.trim();

    let selectedRow = document.querySelector(".active");
    let contactID = selectedRow.dataset.contactId;

    const queryUpdate = {
        Contact_ID: contactID,
        First_Name: first,
        Last_Name: last,
        Phone: phone,
        Email: email
    }

    var url = urlBase + '/UpdateContact.php';

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
               try
               {
                var jsonObject = JSON.parse( xhr.responseText );
                if(jsonObject.error != "") throw new Error(jsonObject.error);
                selectedRow.children[0].innerText = first;
                selectedRow.children[1].innerText = last;
                selectedRow.children[2].innerText = phone;
                selectedRow.children[3].innerText = email;
                Toast.show("Contact updated successfully", "success");
                }
                catch(errCode)
                {
                  showErrorWithToast(errCode.message);
                }
            }
        };
        xhr.send(JSON.stringify(queryUpdate));
    }
    catch(err)
    {

    }
}

function deleteContact()
{
    let selectedRow = document.querySelector(".active");
    let contactID = selectedRow.dataset.contactId;

    const queryDelete = {
        Contact_ID: contactID,
    }

    var url = urlBase + '/DeleteContact.php';

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                document.getElementsByTagName('h4')[0].innerHTML = "Contact deleted successfully!";
                document.getElementById('tableRow').deleteRow(selectedRow.rowIndex);
            }
        };
        xhr.send(JSON.stringify(queryDelete));
    }
    catch(err)
    {
    }
}

function onEnterPress(event) {
  // Login when enter is pressed in any of the inputs
  if (event.key === 'Enter' && !event.repeat) {
    // Cancel the default action
    event.preventDefault();
    searchContact();
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

function doLogout()
{
	document.cookie = `userId=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}
