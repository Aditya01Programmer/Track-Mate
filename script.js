// Save tasks to localStorage with a timestamp
function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("lastUpdated", Date.now().toString());
}

// Load tasks from localStorage
function loadTasks() {
  const lastUpdated = parseInt(localStorage.getItem("lastUpdated"));
  const now = Date.now();
  if (now - lastUpdated > 86400000) {
    localStorage.removeItem("tasks");
    localStorage.removeItem("lastUpdated");
    return [];
  }
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function renderTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.checked;
    checkbox.onchange = () => {
      tasks[index].checked = checkbox.checked;
      saveTasks(tasks);
      text.style.textDecoration = checkbox.checked ? "line-through" : "none";
    };

    const text = document.createElement("input");
    text.type = "text";
    text.value = task.text;
    text.placeholder = "Enter your goal...";
    text.oninput = () => {
      tasks[index].text = text.value;
      saveTasks(tasks);
    };
    text.style.textDecoration = checkbox.checked ? "line-through" : "none";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => {
      showConfirmation(() => {
        tasks.splice(index, 1);
        saveTasks(tasks);
        renderTasks();
      });
    };

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(text);
    taskDiv.appendChild(deleteBtn);
    taskList.appendChild(taskDiv);
  });
}

function addTask() {
  tasks.push({ text: "", checked: false });
  saveTasks(tasks);
  renderTasks();
}

// Custom confirmation modal logic
function showConfirmation(callback) {
  const modal = document.getElementById("confirmModal");
  modal.style.display = "flex";

  const yesBtn = document.getElementById("yesDelete");
  const noBtn = document.getElementById("noDelete");

  yesBtn.onclick = () => {
    modal.style.display = "none";
    callback();
  };

  noBtn.onclick = () => {
    modal.style.display = "none";
  };
}

// Initialization
let tasks = loadTasks();
if (tasks.length === 0) {
  tasks = [{ text: "", checked: false }];
  saveTasks(tasks);
}
renderTasks();
