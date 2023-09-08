document.addEventListener("DOMContentLoaded", renderTasks);

function getTasksGroup() {
  return {
    tasksBacklog: JSON.parse(localStorage.getItem("tasksBacklog")),
    tasksInProgress: JSON.parse(localStorage.getItem("tasksInProgress")),
    tasksDone: JSON.parse(localStorage.getItem("tasksDone")),
  };
}

let taskId;

function renderTasks() {
  const { tasksBacklog, tasksInProgress, tasksDone } = getTasksGroup();
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

  <div class="task-description">${task.taskDescription}</div>
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

function renderTaskGroup(group, groupId) {
  if (group !== null && group.length !== 0) {
    for (let taskIndex = 0; taskIndex < group.length; taskIndex++) {
      const taskMarkup = createTaskMarkup(group[taskIndex]);

      const groupContainer = document.getElementById(groupId);
      groupContainer.innerHTML += taskMarkup;
    }
  }
  if (group !== null && group.length !== 0) {
    for (let taskIndex = 0; taskIndex < group.length; taskIndex++) {
      const taskId = document.getElementById(group[taskIndex].id);
      const taskPriorityValue = group[taskIndex].priority;
      const taskPriority = taskId.children[3].children[1];

      if (taskPriorityValue === "High") {
        taskPriority.classList.add("priority-value-high");
      }
      if (taskPriorityValue === "Medium") {
        taskPriority.classList.add("priority-value-medium");
      }
      if (taskPriorityValue === "Low") {
        taskPriority.classList.add("priority-value-low");
      }

      const taskAssignedValue = group[taskIndex].assigned;
      const taskAssigned = taskId.children[2].children[1];
      console.log(taskAssignedValue);

      if (taskAssignedValue === "Jane Doe") {
        taskAssigned.src = "img/smiley.svg.webp";
      }
      if (taskAssignedValue === "John Doe") {
        taskAssigned.src = "img/smiley2.png";
      }
    }
  }
}

function renderAllTask() {
  const { tasksBacklog, tasksInProgress, tasksDone } = getTasksGroup();

  renderTaskGroup(tasksBacklog, "backlog");
  renderTaskGroup(tasksInProgress, "in-progress");
  renderTaskGroup(tasksDone, "done");

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
      event.dataTransfer.setData(
        "data-task-group-status",
        event.target.parentElement.dataset.taskGroupStatus
      );
    }

    zoneBacklog.ondrop = drop;
    zoneInProgress.ondrop = drop;
    zoneDone.ondrop = drop;

    function drop(event) {
      const itemId = Number(event.dataTransfer.getData("id"));
      event.target.append(document.getElementById(itemId));

      const previousGroupName = event.dataTransfer.getData(
        "data-task-group-status"
      );
      const nextGroupName = event.target.dataset.taskGroupStatus;

      const previousArray = JSON.parse(localStorage.getItem(previousGroupName));
      const nextGroupArray =
        JSON.parse(localStorage.getItem(nextGroupName)) || [];

      const taskPush = previousArray.find((task) => task.id === itemId);
      nextGroupArray.push(taskPush);

      deleteTaskFromArray(previousArray, itemId);

      localStorage.setItem(previousGroupName, JSON.stringify(previousArray));
      localStorage.setItem(nextGroupName, JSON.stringify(nextGroupArray));
    }
  }
}

// Delete task

function deleteTaskFromArray(arr, id, groupName) {
  const taskId = arr.findIndex((task) => task.id === id);
  arr.splice(taskId, 1);

  if (groupName === "backlog") {
    localStorage.setItem("tasksBacklog", JSON.stringify(arr));
  }

  if (groupName === "inProgress") {
    localStorage.setItem("tasksInProgress", JSON.stringify(arr));
  }

  if (groupName === "done") {
    localStorage.setItem("tasksDone", JSON.stringify(arr));
  }
}

function deleteTaskGroup(taskId, group, parent, groupName) {
  if (group !== null && group.length !== 0) {
    for (let taskIndex = 0; taskIndex < group.length; taskIndex++) {
      if (taskId === group[taskIndex].id) {
        parent.parentElement.removeChild(parent);
        deleteTaskFromArray(group, taskId, groupName);
      }
    }
  }
}

function deleteTask(event) {
  const taskId = parseInt(event.currentTarget.parentElement.parentElement.id);
  const parent = this.parentElement.parentElement;

  const { tasksBacklog, tasksInProgress, tasksDone } = getTasksGroup();

  deleteTaskGroup(taskId, tasksBacklog, parent, "backlog");
  deleteTaskGroup(taskId, tasksInProgress, parent, "inProgress");
  deleteTaskGroup(taskId, tasksDone, parent, "done");
}

//Update task

function saveUpdateValue(group, updateTaskId, groupName) {
  if (group !== null && group.length !== 0) {
    for (let taskId = 0; taskId < group.length; taskId++) {
      if (updateTaskId === group[taskId].id) {
        group[taskId].taskTitle = document.getElementById("title").value;
        group[taskId].taskDescription =
          document.getElementById("description").value;
        group[taskId].assigned =
          document.getElementById("assigned-wrapper").innerText;
        group[taskId].priority =
          document.getElementById("priority-wrapper").innerText;
        group[taskId].date = document.getElementById("date").value;
      }
    }
  }
  if (groupName === "backlog") {
    localStorage.setItem("tasksBacklog", JSON.stringify(group));
  }
  if (groupName === "inProgress") {
    localStorage.setItem("tasksInProgress", JSON.stringify(group));
  }
  if (groupName === "done") {
    localStorage.setItem("tasksDone", JSON.stringify(group));
  }
}

function updateTask(updateTaskId) {
  return function () {
    const { tasksBacklog, tasksInProgress, tasksDone } = getTasksGroup();
    saveUpdateValue(tasksBacklog, updateTaskId, "backlog");
    saveUpdateValue(tasksInProgress, updateTaskId, "inProgress");
    saveUpdateValue(tasksDone, updateTaskId, "done");
  };
}

function getValueToUpdate(group, updateTaskId) {
  if (group !== null && group.length !== 0) {
    for (let taskId = 0; taskId < group.length; taskId++) {
      if (updateTaskId === group[taskId].id) {
        document.getElementById("title").value = group[taskId].taskTitle;
        document.getElementById("description").value =
          group[taskId].taskDescription;
        document
          .getElementById("assigned-wrapper")
          .append(group[taskId].assigned);
        document
          .getElementById("priority-wrapper")
          .append(group[taskId].priority);
        document.getElementById("date").value = group[taskId].date;
      }
    }
  }
}

function getModalToUpdate(event) {
  const updateTaskId = parseInt(
    event.currentTarget.parentElement.parentElement.id
  );

  const { tasksBacklog, tasksInProgress, tasksDone } = getTasksGroup();

  getValueToUpdate(tasksBacklog, updateTaskId);
  getValueToUpdate(tasksInProgress, updateTaskId);
  getValueToUpdate(tasksDone, updateTaskId);

  form.style.display = "block";

  const changeBtnAddToUpdate = document.querySelector(".add-button");
  changeBtnAddToUpdate.innerHTML = "Change";
  changeBtnAddToUpdate.addEventListener("click", updateTask(updateTaskId));
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
  let { tasksBacklog } = getTasksGroup();
  if (tasksBacklog === null || tasksBacklog.length === 0) {
    tasksBacklog = [];
    taskId = 0;
  } else {
    taskId = tasksBacklog[tasksBacklog.length - 1].id;
  }

  tasksBacklog.push({
    id: (taskId += 1),
    taskTitle: document.getElementById("title").value,
    taskDescription: document.getElementById("description").value,
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
