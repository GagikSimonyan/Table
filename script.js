let currentUser = {};
let editMode = false;
const url = "http://localhost:3000/interns";

window.addEventListener("DOMContentLoaded", () => {
  getUsers();
  addEventsToButtons();
  addEventsToInputs();
});

function getUsers() {
  fetch(url)
    .then((data) => data.json())
    .then((data) => {
      drawTable(data);
      deleteUser(data);
      updatePopup(data);
    })
    .catch((err) => console.error(err));
}

function addEventsToButtons() {
  const addButton = document.querySelector('.add');
  const cancelBtn = document.querySelector('.cancel');
  const saveBtn = document.querySelector('.save');

  addButton.addEventListener("click", showPopup);
  cancelBtn.addEventListener("click", closePopup);
  saveBtn.addEventListener("click", checkMode);
}

function addEventsToInputs() {
  const nameInput = document.getElementById('name');
  const surnameInput = document.getElementById('surname');
  const emailInput = document.getElementById('email');
  
  nameInput.addEventListener('input', (e) => {onInputChange(e, 'name')});
  surnameInput.addEventListener('input', (e) => {onInputChange(e, 'username')});
  emailInput.addEventListener('input', (e) => {onInputChange(e, 'email')});
}

function onInputChange(e, key) {
  currentUser[key] = e.target.value;
}

function drawTable(data) {
  for (let i = 0; i < data.length; i++) {
    let row = document.createElement("tr");
    row.innerHTML = `
    <td>${data[i].id}</td>
    <td>${data[i].name}</td>
    <td>${data[i].surname}</td>
    <td>${data[i].email}</td>
    <td><button class="edit">Edit</button></td>
    <td><button class="delete">Delete</button></td>
    `;
    document.querySelector('.tbody').appendChild(row);
  }
}

function checkMode() {
  if (editMode) {
    updateUser(currentUser);
  } else {
    addUser();
  }
  closePopup();
}

function addUser() {
  editMode = false;
  let user = createUser();

  fetch(url, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((data) => drawTable(data))
    .catch((err) => console.error(err));
}

function updatePopup(data) {
  const editButtons = document.querySelectorAll('.edit');
  editButtons.forEach((editButton) => {
    editButton.addEventListener('click', (e) => {
      showPopup();
      let userId = Number(e.target.closest("tr").firstElementChild.textContent);
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === userId) {
          currentUser = data[i];
          editMode = true;
          document.getElementById("name").value = data[i].name;
          document.getElementById("surname").value = data[i].surname;
          document.getElementById("email").value = data[i].email;
        }
      }
    });
  });
}

function updateUser(currentUser) {
  fetch(`${url}/${currentUser.id}`, {
  method: 'PUT',
  body: JSON.stringify(currentUser),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((data) => drawTable(data));
}

function deleteUser(data) {
  const deleteBtns = document.querySelectorAll(".delete");
  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", (e) => {
      let userId = Number(e.target.closest("tr").firstElementChild.textContent);
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === userId) {
          fetch(`${url}/${userId}`, {
            method: "DELETE",
          });
        }
      }
    });
  });
}

function createUser() {
  const user = {
    name: document.getElementById("name").value,
    surname: document.getElementById("surname").value,
    email: document.getElementById("email").value,
  };
  closePopup();
  return user;
}

function clearInputs() {
  document.getElementById("name").value = null;
  document.getElementById("surname").value = null;
  document.getElementById("email").value = null;
}

function closePopup() {
  clearInputs();
  document.querySelector(".popup__wrap").classList.remove("showPopup");
}

function showPopup() {
  document.querySelector(".popup__wrap").classList.add("showPopup");
}