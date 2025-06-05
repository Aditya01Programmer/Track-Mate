// Save the current date when tasks are stored
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

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  return tasks;
}

let tasks = loadTasks(); // Load tasks from storage
let taskToDeleteIndex = null; // Track index of task to delete

function renderTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.checked;
    checkbox.onchange = () => {
      tasks[index].checked = checkbox.checked;
      saveTasks(tasks);
      text.style.textDecoration = checkbox.checked ? "line-through" : "none";
    };

    // Text input
    const text = document.createElement("input");
    text.type = "text";
    text.value = task.text;
    text.placeholder = "Enter your goal...";
    text.oninput = () => {
      tasks[index].text = text.value;
      saveTasks(tasks);
    };
    text.style.textDecoration = checkbox.checked ? "line-through" : "none";

    // Delete Button using popup
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "🗑️";
    deleteButton.className = "delete-btn";
    deleteButton.onclick = () => {
      taskToDeleteIndex = index;
      document.getElementById("popup").style.display = "flex";
    };

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(text);
    taskDiv.appendChild(deleteButton);
    taskList.appendChild(taskDiv);
  });
}

// Add a new task to the list
function addTask() {
  const newTask = {
    text: "",
    checked: false
  };
  tasks.push(newTask);
  saveTasks(tasks);
  renderTasks();
}

// Handle popup confirmation
document.getElementById("confirm-delete").onclick = () => {
  if (taskToDeleteIndex !== null) {
    tasks.splice(taskToDeleteIndex, 1);
    saveTasks(tasks);
    renderTasks();
    taskToDeleteIndex = null;
    document.getElementById("popup").style.display = "none";
  }
};

document.getElementById("cancel-delete").onclick = () => {
  taskToDeleteIndex = null;
  document.getElementById("popup").style.display = "none";
};

// Render tasks on page load
renderTasks();
