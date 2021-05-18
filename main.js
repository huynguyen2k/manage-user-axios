const usersElement = document.getElementById('users-table');

const editModal = document.getElementById('edit-modal');
const editForm = document.forms['edit-form'];

const cancelBtnEditForm = document.getElementById('cancel-edit-form');
const saveBtnEditForm = document.getElementById('save-edit-form');

const addModal = document.getElementById('add-modal');
const addForm = document.forms['add-form'];

const addUserBtn = document.getElementById('add-user-btn');
const saveBtnAddForm = document.getElementById('save-add-form');
const cancelBtnAddForm = document.getElementById('cancel-add-form');


const usersURL = 'http://localhost:3000/users';

function createUserElement(userObject) {
    const rowTable = document.createElement('tr');
    rowTable.classList.add('table__row');
    rowTable.setAttribute('user-id', userObject.id);

    rowTable.innerHTML = `
    <td class="table__col">${userObject.id}</td> 
    <td class="table__col">${userObject.name}</td> 
    <td class="table__col">${userObject.date}</td> 
    <td class="table__col">${userObject.major}</td> 
    <td class="table__col">${userObject.job}</td>
    <td class="table__col text-center">
        <span class="button edit-btn">Edit</span>
        <span class="button error-btn">Delete</span>
    </td>`;

    return rowTable;
}

function deleteUser(url, userId) {
    axios.delete(url + '/' + userId)
    .catch(error => {
        console.log(error);
    });
}

function addClickEventForDeleteBtn(element) {
    element.onclick = function() {
        let userElement = this.closest('.table__row');
        let userId = userElement.getAttribute('user-id');

        deleteUser(usersURL, userId);
        userElement.remove();
    }
}

function addClickEventForEditBtn(element, user) {
    element.onclick = function() {
        showEditModal();
                
        editForm['user-id'].value = user.id;
        editForm['user-name'].value = user.name;
        editForm['user-date'].value = user.date;
        editForm['user-major'].value = user.major;
        editForm['user-job'].value = user.job;
    }
}

function getUsers(url) {
    axios.get(url)
    .then(response => {
        response.data.forEach(item => {
            const userElement = createUserElement(item);
            const editBtn = userElement.querySelector('.edit-btn');
            const deleteBtn = userElement.querySelector('.error-btn');

            usersElement.appendChild(userElement);

            addClickEventForDeleteBtn(deleteBtn);
            addClickEventForEditBtn(editBtn, item);

        });
    })
    .catch(error => {
        console.log(error);
    });
}

function postUser(url, user) {
    axios.post(url, user, {
        headers: {
            'Content-type': 'application/json; charset=utf-8'
        }
    })
    .then(response => {
        const userResponse = response.data;
        const newUserElement = createUserElement(userResponse);
        const editUserBtn = newUserElement.querySelector('.edit-btn');
        const deleteUserBtn = newUserElement.querySelector('.error-btn');

        usersElement.appendChild(newUserElement);
        addClickEventForEditBtn(editUserBtn, userResponse);
        addClickEventForDeleteBtn(deleteUserBtn);
    })
    .catch(error => {
        console.log(error);
    });
}

function showEditModal() {
    editModal.classList.add('modal--active');
}

function hiddenEditModal() {
    editModal.classList.remove('modal--active');
}

function showAddModal() {
    addModal.classList.add('modal--active');
}

function hiddenAddModal() {
    addModal.classList.remove('modal--active');
}

function clearAddUserForm() {
    for (input of addForm) {
        input.value = '';
    }
}

function updateUser(url, data) {
    axios.patch(url, data, {
        headers: {
            'Content-type': 'application/json'
        }
    })
    .then(response => {
        const user = response.data;
        const newUser = createUserElement(user);
        const oldUser = document.querySelector(`.table__row[user-id="${user.id}"]`);
        const editBtn = newUser.querySelector('.edit-btn');
        const deleteBtn = newUser.querySelector('.error-btn');

        addClickEventForEditBtn(editBtn, user);
        addClickEventForDeleteBtn(deleteBtn);
        usersElement.replaceChild(newUser, oldUser);
    })
    .catch(error => {
        console.log(error);
    });
}

getUsers(usersURL);

cancelBtnEditForm.onclick = hiddenEditModal;

saveBtnEditForm.onclick = function() {
    const user = {
        id: editForm['user-id'].value,
        name: editForm['user-name'].value,
        date: editForm['user-date'].value,
        major: editForm['user-major'].value,
        job: editForm['user-job'].value
    };

    updateUser(usersURL + '/' + user.id, user);
    hiddenEditModal();  
};

addUserBtn.onclick = function() {
    showAddModal();
}

cancelBtnAddForm.onclick = hiddenAddModal;

addForm.onsubmit = function(e) {
    e.preventDefault();

    const user = {
        name: addForm['user-name'].value,
        date: addForm['user-date'].value,
        major: addForm['user-major'].value,
        job: addForm['user-job'].value
    };

    postUser(usersURL, user);
    hiddenAddModal();
    clearAddUserForm();
}


testAxios();

function testAxios() {
    axios.get(usersURL, {
        params: {
            _start: 5,
            _limit: 5
        }
    })
    .then(response => {
        console.log(response.data);
    });
}