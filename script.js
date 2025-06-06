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

// Dark mode toggle setup
const toggleBtn = document.getElementById("dark-mode-toggle");

// Initialize theme based on saved preference or system preference
function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    toggleBtn.textContent = "☀️";
  } else if (savedTheme === "light") {
    document.body.classList.remove("dark-mode");
    toggleBtn.textContent = "🌙";
  } else {
    // No saved preference, use system preference
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark-mode");
      toggleBtn.textContent = "☀️";
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      toggleBtn.textContent = "🌙";
      localStorage.setItem("theme", "light");
    }
  }
}

// Toggle dark mode on button click
toggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  if (isDark) {
    toggleBtn.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    toggleBtn.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
});

// Run on page load
initTheme();
