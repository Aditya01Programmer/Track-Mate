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

    // Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "❌";
    deleteButton.className = "delete-btn";
    deleteButton.onclick = () => {
      const confirmDelete = confirm("Are you sure you want to delete this task?");
      if (confirmDelete) {
        tasks.splice(index, 1); // Remove task
        saveTasks(tasks);
        renderTasks(); // Re-render list
      }
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

// Render tasks on page load
renderTasks();
