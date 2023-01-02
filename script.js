document.addEventListener("DOMContentLoaded", renderTasks);

let tasksBacklog = JSON.parse(localStorage.getItem("tasksBacklog"));
let tasksInProgress = JSON.parse(localStorage.getItem("tasksInProgress"));
let tasksDone = JSON.parse(localStorage.getItem("tasksDone"));

let taskId;

function renderTasks() {
  if (tasksBacklog !== null || tasksInProgress !== null || tasksDone !== null) {
    renderAllTask();
  }
}

function createTaskMarkup(task) {
  return `<div id="${task.id}" class="task" draggable="true">
  <div class="btn-close-wrapper">
    <div class="task-name">${task.taskTitle}</div>
    <button class="button-close">
      <i class="fa-solid fa-xmark"></i>
    </button>
  </div>

  <div class="task-discription">${task.taskDiscription}</div>
  <div class="task-wrapper">
    <div class="task-parameter">Assigned:</div>
    <img
      src="img/smiley.svg.webp"
      alt="Assigned photo"
      class="assigned-img"
    />
    <div class="assigned-value">${task.assigned}</div>
  </div>

  <div class="task-wrapper">
    <div class="task-parameter">Priority:</div>
    <div class="priority-value">${task.priority}</div>
  </div>

  <div class="task-wrapper">
    <div class="task-parameter">Due Date:</div>
    <div class="date-value">${task.date}</div>
  </div>

  <div class="tag-edit-wrapper">
    <button class="btn-tag">+Tag</button>
    <button class="btn-edit"><i class="fa-solid fa-pen"></i></button>
  </div>
</div>`;
}

function renderAllTask() {
  if (tasksBacklog !== null && tasksBacklog.length !== 0) {
    for (let taskIndex = 0; taskIndex < tasksBacklog.length; taskIndex++) {
      const drawBacklog = createTaskMarkup(tasksBacklog[taskIndex]);

      const backlog = document.getElementById("backlog");
      backlog.innerHTML += drawBacklog;
    }
  }

  if (tasksInProgress !== null && tasksInProgress.length !== 0) {
    for (let taskIndex = 0; taskIndex < tasksInProgress.length; taskIndex++) {
      const drawInProgress = createTaskMarkup(tasksInProgress[taskIndex]);

      const inProgress = document.getElementById("in-progress");
      inProgress.innerHTML += drawInProgress;
    }
  }

  if (tasksDone !== null && tasksDone.length !== 0) {
    for (let taskIndex = 0; taskIndex < tasksDone.length; taskIndex++) {
      const drawDone = createTaskMarkup(tasksDone[taskIndex]);

      const done = document.getElementById("done");
      done.innerHTML += drawDone;
    }
  }
  const getBtnDelete = document.querySelectorAll(
    ".btn-close-wrapper .button-close"
  );

  getBtnDelete.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", deleteTask);
  });

  const getBtnUpdate = document.querySelectorAll(".btn-edit");

  getBtnUpdate.forEach((updateBtn) => {
    updateBtn.addEventListener("click", getModalToUpdate);
  });

  // Drag and drop task

  const getAllTasks = document.querySelectorAll(".task");
  getAllTasks.forEach((task) => {
    task.addEventListener("mousedown", dropAndDrag);
  });

  function dropAndDrag(event) {
    const taskId = parseInt(event.currentTarget.id);
    const getIdToMove = document.getElementById(taskId);
    const zoneBacklog = document.querySelector(".backlog");
    const zoneInProgress = document.querySelector(".in-progress");
    const zoneDone = document.querySelector(".done");

    zoneBacklog.ondragover = allowDrop;
    zoneInProgress.ondragover = allowDrop;
    zoneDone.ondragover = allowDrop;

    function allowDrop(event) {
      event.preventDefault();
    }

    getIdToMove.ondragstart = drag;

    function drag(event) {
      event.dataTransfer.setData("id", event.target.id);
    }

    zoneBacklog.ondrop = drop;
    zoneInProgress.ondrop = drop;
    zoneDone.ondrop = drop;

    function drop(event) {
      const itemId = event.dataTransfer.getData("id");
      event.target.append(document.getElementById(itemId));
    }

    changePlaceInArray(taskId);
  }
  function changePlaceInArray(task) {
    for (let taskIndex = 0; taskIndex < tasksBacklog.length; taskIndex++) {
      if (task === tasksBacklog[taskIndex].id) {
        // deleteTaskFromArray(tasksBacklog, taskId);
      }
    }
  }
}

// Delete task
function deleteTask(event) {
  const taskId = parseInt(event.currentTarget.parentElement.parentElement.id);

  for (let taskIndex = 0; taskIndex < tasksBacklog.length; taskIndex++) {
    if (taskId === tasksBacklog[taskIndex].id) {
      const parent = this.parentElement.parentElement;
      parent.parentElement.removeChild(parent);
      deleteTaskFromArray(tasksBacklog, taskId);
    }
  }

  if (tasksInProgress !== null && tasksInProgress.length !== 0) {
    for (let taskIndex = 0; taskIndex < tasksInProgress.length; taskIndex++) {
      if (taskId === tasksInProgress[taskIndex].id) {
        const parent = this.parentElement.parentElement;
        parent.parentElement.removeChild(parent);
        deleteTaskFromArray(tasksInProgress, taskId);
      }
    }
  }
  if (tasksDone !== null && tasksDone.length !== 0) {
    for (let taskIndex = 0; taskIndex < tasksDone.length; taskIndex++) {
      if (taskId === tasksDone[taskIndex].id) {
        const parent = this.parentElement.parentElement;
        parent.parentElement.removeChild(parent);
        deleteTaskFromArray(tasksDone, taskId);
      }
    }
  }
}

function deleteTaskFromArray(arr, id) {
  const taskId = arr.findIndex((task) => task.id === id);
  arr.splice(taskId, 1);
  localStorage.setItem("tasksBacklog", JSON.stringify(tasksBacklog));
  localStorage.setItem("tasksInProgress", JSON.stringify(tasksInProgress));
  localStorage.setItem("tasksDone", JSON.stringify(tasksDone));
}

//Update task

function getModalToUpdate(event) {
  const updateTaskId = parseInt(
    event.currentTarget.parentElement.parentElement.id
  );

  for (let taskId = 0; taskId < tasksBacklog.length; taskId++) {
    if (updateTaskId === tasksBacklog[taskId].id) {
      document.getElementById("title").value = tasksBacklog[taskId].taskTitle;
      document.getElementById("discription").value =
        tasksBacklog[taskId].taskDiscription;
      document
        .getElementById("assigned-wrapper")
        .append(tasksBacklog[taskId].assigned);
      document
        .getElementById("priority-wrapper")
        .append(tasksBacklog[taskId].priority);
      document.getElementById("date").value = tasksBacklog[taskId].date;
    }
  }

  if (tasksInProgress !== null && tasksInProgress.length !== 0) {
    for (let taskId = 0; taskId < tasksInProgress.length; taskId++) {
      if (updateTaskId === tasksInProgress[taskId].id) {
        document.getElementById("title").value =
          tasksInProgress[taskId].taskTitle;
        document.getElementById("discription").value =
          tasksInProgress[taskId].taskDiscription;
        document
          .getElementById("assigned-wrapper")
          .append(tasksInProgress[taskId].assigned);
        document
          .getElementById("priority-wrapper")
          .append(tasksInProgress[taskId].priority);
        document.getElementById("date").value = tasksInProgress[taskId].date;
      }
    }
  }

  if (tasksDone !== null && tasksDone.length !== 0) {
    for (let taskId = 0; taskId < tasksDone.length; taskId++) {
      if (updateTaskId === tasksDone[taskId].id) {
        document.getElementById("title").value = tasksDone[taskId].taskTitle;
        document.getElementById("discription").value =
          tasksDone[taskId].taskDiscription;
        document
          .getElementById("assigned-wrapper")
          .append(tasksDone[taskId].assigned);
        document
          .getElementById("priority-wrapper")
          .append(tasksDone[taskId].priority);
        document.getElementById("date").value = tasksDone[taskId].date;
      }
    }
  }

  form.style.display = "block";

  const changeBtnAddToUpdate = document.querySelector(".add-button");
  changeBtnAddToUpdate.innerHTML = "Change";
  changeBtnAddToUpdate.addEventListener("click", updateTask);

  function updateTask() {
    for (let taskId = 0; taskId < tasksBacklog.length; taskId++) {
      if (updateTaskId === tasksBacklog[taskId].id) {
        tasksBacklog[taskId].taskTitle = document.getElementById("title").value;
        tasksBacklog[taskId].taskDiscription =
          document.getElementById("discription").value;
        tasksBacklog[taskId].assigned =
          document.getElementById("assigned-wrapper").innerText;
        tasksBacklog[taskId].priority =
          document.getElementById("priority-wrapper").innerText;
        tasksBacklog[taskId].date = document.getElementById("date").value;
        localStorage.setItem("tasksBacklog", JSON.stringify(tasksBacklog));
      }
    }
    if (tasksInProgress !== null && tasksInProgress.length !== 0) {
      for (let taskId = 0; taskId < tasksInProgress.length; taskId++) {
        if (updateTaskId === tasksInProgress[taskId].id) {
          tasksInProgress[taskId].taskTitle =
            document.getElementById("title").value;
          tasksInProgress[taskId].taskDiscription =
            document.getElementById("discription").value;
          tasksInProgress[taskId].assigned =
            document.getElementById("assigned-wrapper").innerText;
          tasksInProgress[taskId].priority =
            document.getElementById("priority-wrapper").innerText;
          tasksInProgress[taskId].date = document.getElementById("date").value;
          localStorage.setItem(
            "tasksInProgress",
            JSON.stringify(tasksInProgress)
          );
        }
      }
    }
    if (tasksDone !== null && tasksDone.length !== 0) {
      for (let taskId = 0; taskId < tasksDone.length; taskId++) {
        if (updateTaskId === tasksDone[taskId].id) {
          tasksDone[taskId].taskTitle = document.getElementById("title").value;
          tasksDone[taskId].taskDiscription =
            document.getElementById("discription").value;
          tasksDone[taskId].assigned =
            document.getElementById("assigned-wrapper").innerText;
          tasksDone[taskId].priority =
            document.getElementById("priority-wrapper").innerText;
          tasksDone[taskId].date = document.getElementById("date").value;
          localStorage.setItem("tasksDone", JSON.stringify(tasksDone));
        }
      }
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
  const saveTaskBtn = document.getElementById("add-btn-form");

  saveTaskBtn.addEventListener("click", saveNewTask);
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

function saveNewTask() {
  if (tasksBacklog === null || tasksBacklog.length === 0) {
    tasksBacklog = [];
    taskId = 0;
  } else {
    taskId = tasksBacklog[tasksBacklog.length - 1].id;
  }

  tasksBacklog.push({
    id: (taskId += 1),
    taskTitle: document.getElementById("title").value,
    taskDiscription: document.getElementById("discription").value,
    assigned: document.getElementById("assigned-wrapper").innerText,
    priority: document.getElementById("priority-wrapper").innerText,
    date: document.getElementById("date").value,
  });

  localStorage.setItem("tasksBacklog", JSON.stringify(tasksBacklog));

  form.style.display = "none";

  alert(
    "You added the new task " +
      tasksBacklog[tasksBacklog.length - 1].taskTitle +
      "!"
  );
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
