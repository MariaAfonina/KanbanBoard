document.addEventListener("DOMContentLoaded", activeTasks);

const getTasks = localStorage.getItem("tasksBackLog");
let tasks = JSON.parse(getTasks);
let id;

function activeTasks() {
  if (getTasks !== null) {
    markup();
  }
}

function markup() {
  for (let i = 0; i < tasks.length; i++) {
    const markUp = `<div class="task">
      <div class="btn-close-wrapper">
        <div class="task-name">${tasks[i].taskTitle}</div>
        <button id="${tasks[i].id}" class="button-close">
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
    backLog.innerHTML += markUp;
  }
  const deleteBtn = document.querySelectorAll(
    ".btn-close-wrapper .button-close"
  );

  deleteBtn.forEach((element) => {
    element.addEventListener("click", deleteTask);
  });
}

// Delete task
function deleteTask(event) {
  const taskId = parseInt(event.currentTarget.id);
  // tasks.filter((el) => el.id !== taskId);

  for (let i = 0; i < tasks.length; i++) {
    if (taskId === tasks[i].id) {
      const parent = this.parentElement.parentElement;
      parent.parentElement.removeChild(parent);
    }
  }
}

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

const assignedWrapper = document.getElementById("assigned-wrapper");
const priorityWrapper = document.getElementById("priority-wrapper");

const MAP_FIELD_NAME_TO_DROPDOWN = {
  assigned: assignedWrapper,
  priority: priorityWrapper,
};

assignedWrapper.addEventListener("click", handleDropdownClick);
priorityWrapper.addEventListener("click", handleDropdownClick);

function handleDropdownClick(event) {
  const currentFiled = event.currentTarget.dataset.fieldName;

  if (event.target.tagName === "LI") {
    const value = event.target.dataset.name;
    MAP_FIELD_NAME_TO_DROPDOWN[currentFiled].append(value);
  }
}

// Add new task to localStorage and window

const saveTaskBtn = document.getElementById("add-btn-form");

saveTaskBtn.addEventListener("click", saveNewTask);

function saveNewTask(e) {
  if (getTasks === null) {
    tasks = [];
    id = 0;
  } else {
    id = tasks[tasks.length - 1].id;
  }

  tasks.push({
    id: (id += 1),
    taskTitle: document.getElementById("title").value,
    taskDiscription: document.getElementById("discription").value,
    assigned: document.getElementById("assigned-wrapper").innerText,
    priority: document.getElementById("priority-wrapper").innerText,
    date: document.getElementById("date").value,
  });

  localStorage.setItem("tasksBackLog", JSON.stringify(tasks));

  markup();

  form.style.display = "none";
  alert("You added the new task " + tasks[tasks.length - 1].taskTitle + "!");
}

// Open dropdown with click

// const dropDownPriority = document.getElementById("priority-wrapper");
// const dropDownValue = document.getElementById("priority-value");

// dropDownPriority.addEventListener("click", openPriority);

// function openPriority() {
//   dropDownValue.style.opacity = "1";
// }

// e.preventDefault();

// localStorage.clear();
