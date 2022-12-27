// функції, що реагують на якусб подію, прийнато називати з перфікса on або handle і далі назва івенту handleDOMContentLoaded/onDOMContentLoaded
// або назва може показувати що саме вона робить, тк твоя функція малює таски, то її можна назвати renderTasks
document.addEventListener("DOMContentLoaded", activeTasks);


// 1. В подальшому ти зможеш змінювати статут таски і вони повинні залишатись в локал стораджі,  
// тому при лоаді треба рендерети всі типи тасок, а не тільки, що відносяться до беклогу
// 2. З дієслова прийнято називати функції, тому що вони описують якусь дію
// Змінні зі значенням називають просто за контентом, який і них лежить
// 3. Ти можеш зкомбінувати зчитування з локал стораджу і парсинг отриманих даних в одному рядку
// JSON.parse(localStorage.getItem("tasksBackLog")) -> виконная коду тут буде йти зправа наліва, тому спочкату зчитаються 
// дані з локал стораджу, те, що повернуться з виразу localStorage.getItem("tasksBackLog") відразу піде як аргумент до фугкції
// JSON.parse(повернене_значення_з_операції_зчитування_з_локал_стораджу)
// 4. JSON.parse(null) повертає null, тому getTask можна взагалі не використовувати
const getTasks = localStorage.getItem("tasksBackLog");
let tasks = JSON.parse(getTasks);
let id;

function activeTasks() {
  if (getTasks !== null || getTasks === []) {
    markup();
  }
}

// По сути ця функція робить додавання нових DOM елементів, тому краще придумати назву, яка більш відповідє тому, що 
// відбувається всередені неї
// Часто можна зустріти, що подібні функції мають назву починаючи зі слова render, а далі що саме рендериться
function markup() {
  // краще уникати скорочень. всім зрозуміло, що i -  це індекс, але taskIndex буде ще зрозуміліше :)
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

    // здається backlog це одне слово
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
  console.log('delete')
  const taskId = parseInt(event.currentTarget.id);

  for (let i = 0; i < tasks.length; i++) {
    if (taskId === tasks[i].id) {
      const parent = this.parentElement.parentElement;
      parent.parentElement.removeChild(parent);
      deleteTaskFromArray(tasks, taskId);
    }

    function deleteTaskFromArray(arr, id) {
      const objId = arr.findIndex((obj) => obj.id === id);
      arr.splice(objId, 1);
      localStorage.setItem("tasksBackLog", JSON.stringify(tasks));
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
  if (getTasks === null || getTasks === "[]") {
    tasks = [];
    // краще нахвати цю змінну taskId
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

  // робата з DOM (додавання, видалення DOM node) з точки зору продктивності дуже затртна, тому треба уникати пермелавання усії сторінки
  // через це треба переботи це місце таким чином, щоб при додаванні домальовувалась одна таска, а не перемальовувались усі :)
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
