const form = document.getElementById("form");
const addNewTaskBtn = document.getElementById("btn-add-new-task");
const closeModalBtn = document.getElementById("close-modal");

addNewTaskBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);

function openModal() {
  form.style.display = "block";
}

function closeModal() {
  form.style.display = "none";
}

// Choose one version from dropdown

const janeDoe = document.getElementById("Jane_Doe");
const johnDoe = document.getElementById("John_Doe");
const assignedValue = document.getElementById("assigned-wrapper");

janeDoe.addEventListener("click", addValueJaneDoe);
johnDoe.addEventListener("click", addValueJohnDoe);

function addValueJaneDoe() {
  assignedValue.textContent = "Jane Doe";
}

function addValueJohnDoe() {
  assignedValue.textContent = "John Doe";
}

// Add new task to localStorage and window

const saveTaskBtn = document.getElementById("add-btn-form");

saveTaskBtn.addEventListener("click", saveNewTask);

function saveNewTask(e) {
  e.preventDefault();

  const getTasks = localStorage.getItem("tasksBackLog");
  let tasks;
  let id;

  if (getTasks === null) {
    tasks = [];
    id = 0;
  } else {
    tasks = JSON.parse(getTasks);
    id = tasks[tasks.length - 1].id;
  }

  tasks.push({
    id: (id += 1),
    taskTitle: document.getElementById("title").value,
    taskDiscription: document.getElementById("discription").value,
    assigned: document.getElementById("assigned-wrapper").value,
    priority: document.getElementById("priority-wrapper").value,
    date: document.getElementById("date").value,
  });

  localStorage.setItem("tasksBackLog", JSON.stringify(tasks));

  for (let i = 0; i < tasks.length; i++) {
    let ul = document.createElement("ul");
    let liTitle = document.createElement("li");
    let liDiscription = document.createElement("li");
    let liAssigned = document.createElement("li");
    let liPriority = document.createElement("li");
    let liDate = document.createElement("li");
    let liBtnTag = document.createElement("button");
    let liBtnEdit = document.createElement("button");

    liTitle.innerText = tasks[i].taskTitle;
    liDiscription.innerText = tasks[i].taskDiscription;
    liAssigned.innerText = tasks[i].assignee;
    liPriority.innerText = tasks[i].priority;
    liDate.innerText = tasks[i].date;
    liBtnTag.innerText = "+Tag";
    liBtnEdit.innerText = "";
    liBtnEdit.onclick = function () {
      editTasks(tasks[i]);
    };

    ul.appendChild(liTitle);
    ul.appendChild(liDiscription);
    ul.appendChild(liAssigned);
    ul.appendChild(liPriority);
    ul.appendChild(liDate);
    ul.appendChild(liBtnTag);
    ul.appendChild(liBtnEdit);

    const backLog = document.getElementById("back-log");
    backLog.appendChild(ul);
  }
}

// Delete Task

// const deleteTask = getElementById("delete-task");

// deleteTask.addEventListener("click", deleteTask);

// function deleteTask(id) {

// }

// Open dropdown with click

// const dropDownPriority = document.getElementById("priority-wrapper");
// const dropDownValue = document.getElementById("priority-value");

// dropDownPriority.addEventListener("click", openPriority);

// function openPriority() {
//   dropDownValue.style.opacity = "1";
// }

// localStorage.clear();
