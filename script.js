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

const assignedValue = document.querySelectorAll(".name-value");
const assignedWrapper = document.getElementById("assigned-wrapper");

const assignedClick = (event) => {
  const value = event.target.dataset.name;
  assignedWrapper.append(value);
};

assignedValue.forEach((name) => {
  name.addEventListener("click", assignedClick);
});

const priorityValue = document.querySelectorAll(".priority");
const priorityWrapper = document.getElementById("priority-wrapper");

const priorityClick = (event) => {
  const value = event.target.dataset.name;
  priorityWrapper.append(value);
};

priorityValue.forEach((priority) => {
  priority.addEventListener("click", priorityClick);
});

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
    const markup = `<div class="task">
    <div class="btn-close-wrapper">
      <div class="task-name">${tasks[i].taskTitle}</div>
      <button id="delete-task" class="button-close">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <div class="task-discription">${tasks[i].taskDiscription}</div>
    <div class="task-wrapper">
      <div class="task-parameter">Assigned:</div>
      <img
        src="img/smiley.svg.webp"
        alt="Assigned photo"
        class="assigned-img"
      />
      <div class="assigned-value">${tasks[i].assigned}</div>
    </div>

    <div class="task-wrapper">
      <div class="task-parameter">Priority:</div>
      <div class="priority-value">${tasks[i].priority}</div>
    </div>

    <div class="task-wrapper">
      <div class="task-parameter">Due Date:</div>
      <div class="date-value">${tasks[i].date}</div>
    </div>

    <div class="tag-edit-wrapper">
      <button class="btn-tag">+Tag</button>
      <button class="btn-edit"><i class="fa-solid fa-pen"></i></button>
    </div>
  </div>`;

    const backLog = document.getElementById("back-log");
    backLog.innerHTML += markup;
  }
}

// Delete Task

// Open dropdown with click

// const dropDownPriority = document.getElementById("priority-wrapper");
// const dropDownValue = document.getElementById("priority-value");

// dropDownPriority.addEventListener("click", openPriority);

// function openPriority() {
//   dropDownValue.style.opacity = "1";
// }

// localStorage.clear();
