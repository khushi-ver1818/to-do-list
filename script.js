const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

const prioritySelect = document.getElementById("prioritySelect");
const dueDateInput = document.getElementById("dueDate");
const clearCompletedButton = document.getElementById("clearCompleted");

const searchInput = document.getElementById("searchInput");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");


// Update task counter
function updateTaskCount() {
    const total = taskList.querySelectorAll(".task-item").length;
    const completed = document.querySelectorAll(".completed").length;
    const pending = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
    const emptyMessage = document.getElementById("emptyMessage");

    if (taskList.querySelectorAll(".task-item").length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }
}


// Save tasks to LocalStorage
function saveTasks() {
    const tasks = [];

    document.querySelectorAll(".task-item").forEach(function (taskItem) {

        const taskText = taskItem.querySelector("span").textContent;
        const priority = taskItem.querySelector("small").textContent.toLowerCase();

        const dueDateElement = taskItem.querySelector(".due-date");
        const dueDate = dueDateElement
            ? dueDateElement.textContent.replace("📅 ", "").split(" ")[0]
            : "";
        tasks.push({
            text: taskText,
            completed: taskItem.classList.contains("completed"),
            priority: priority,
            dueDate: dueDate
        });

    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Create a task
function createTask(taskText, isCompleted = false, priority = "medium", dueDate = "") {

    const taskItem = document.createElement("li");
    taskItem.className = "task-item";

    if (isCompleted) {
        taskItem.classList.add("completed");
    }


    // Task text
    const taskTextElement = document.createElement("span");
    const priorityElement = document.createElement("small");
    const dueDateElement = document.createElement("small");

    if (dueDate) {
       dueDateElement.textContent = "📅 " + dueDate;
       dueDateElement.className = "due-date";

       const today = new Date().toISOString().split("T")[0];

       if (dueDate < today && !isCompleted) {
         dueDateElement.textContent = "📅 " + dueDate + " ⚠️ Overdue";
         dueDateElement.classList.add("overdue");
        }
       else if (dueDate === today) {
         dueDateElement.textContent = "📅 " + dueDate + " ⭐ Today";
         dueDateElement.classList.add("today-date");
        }
        else if (dueDate > today) {
         dueDateElement.textContent = "📅 " + dueDate + " 📌 Upcoming";
         dueDateElement.classList.add("upcoming-date");
        }
    }

    priorityElement.textContent = priority.toUpperCase();
    priorityElement.className = "priority-" + priority;
    taskTextElement.textContent = taskText;


    // Complete button
    const completeButton = document.createElement("button");
    completeButton.textContent = "✓";
    completeButton.className = "complete-btn";


    // Edit button
    const editButton = document.createElement("button");
    editButton.textContent = "✏️";
    editButton.className = "edit-btn";


    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "🗑";
    deleteButton.className = "delete-btn";


    // Complete task
    completeButton.addEventListener("click", function () {

        taskItem.classList.toggle("completed");

        updateTaskCount();
        saveTasks();
    });


    // Edit task
    editButton.addEventListener("click", function () {

        const newTask = prompt(
           "Edit your task:",
            taskTextElement.textContent
        );

        if (newTask !== null && newTask.trim() !== "") {

           taskTextElement.textContent = newTask.trim();

           const newDate = prompt(
              "Enter new due date (YYYY-MM-DD):",
               dueDate
            );

            if (newDate !== null && newDate.trim() !== "") {

                dueDate = newDate.trim();

                dueDateElement.textContent = "📅 " + dueDate;
                dueDateElement.className = "due-date";

                const today = new Date().toISOString().split("T")[0];

                if (dueDate < today && !taskItem.classList.contains("completed")) {
                   dueDateElement.textContent += " ⚠️ Overdue";
                   dueDateElement.classList.add("overdue");
                }    
                else if (dueDate === today) {
                   dueDateElement.textContent += " ⭐ Today";
                   dueDateElement.classList.add("today-date");
                }
                else if (dueDate > today) {
                   dueDateElement.textContent += " 📌 Upcoming";
                   dueDateElement.classList.add("upcoming-date");
                }  
           }

           saveTasks();
        }
    });

    // Delete task
    deleteButton.addEventListener("click", function () {

        taskItem.remove();

        updateTaskCount();
        saveTasks();
    });


    // Add elements to task
    taskItem.appendChild(taskTextElement);
    taskItem.appendChild(completeButton);
    taskItem.appendChild(priorityElement);
    if (dueDate) {
         taskItem.appendChild(dueDateElement);
    }
    taskItem.appendChild(editButton);
    taskItem.appendChild(deleteButton);

    taskList.appendChild(taskItem);
}


// Add new task
addTaskButton.addEventListener("click", function () {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    createTask(taskText, false, prioritySelect.value, dueDateInput.value);

    taskInput.value = "";
    dueDateInput.value = "";

    updateTaskCount();
    saveTasks();
});

taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        addTaskButton.click();
    }

});


// Load saved tasks
function loadTasks() {

    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {

        const tasks = JSON.parse(savedTasks);

        tasks.forEach(function (task) {

            createTask(
                task.text,
                task.completed,
                task.priority || "medium",
                task.dueDate ? task.dueDate.split(" ")[0] : ""
            );

        });

    }

    updateTaskCount();
}

// Load tasks when website opens
loadTasks();
searchInput.addEventListener("input", function () {
    applyFilters();
});

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        filterButtons.forEach(function (btn) {
            btn.classList.remove("active-filter");
        });

        button.classList.add("active-filter");

        applyFilters();
    });

});

        
const darkModeBtn = document.getElementById("darkModeBtn");

darkModeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        darkModeBtn.textContent = "☀️ Light Mode";

        localStorage.setItem("darkMode", "enabled");

    } else {

        darkModeBtn.textContent = "🌙 Dark Mode";

        localStorage.setItem("darkMode", "disabled");

    }

});


// Remember dark mode after refresh
if (localStorage.getItem("darkMode") === "enabled") {

    document.body.classList.add("dark-mode");

    darkModeBtn.textContent = "☀️ Light Mode";

}

clearCompletedButton.addEventListener("click", function () {

    const completedTasksList = document.querySelectorAll(".completed");

    completedTasksList.forEach(function (task) {
        task.remove();
    });

    updateTaskCount();
    saveTasks();

});
const priorityFilters = document.querySelectorAll(".priority-filter");

priorityFilters.forEach(function (button) {

    button.addEventListener("click", function () {

        priorityFilters.forEach(function (btn) {
            btn.classList.remove("active-priority");
        });

        button.classList.add("active-priority");

        applyFilters();
    });

});



function applyFilters() {

    const selectedPriority =
        document.querySelector(".active-priority")?.dataset.priority || "all";

    const selectedStatus =
        document.querySelector(".active-filter")?.dataset.filter || "all";

    const searchText = searchInput.value.toLowerCase();

    const allTasks = document.querySelectorAll(".task-item");

    allTasks.forEach(function (task) {

        const taskText =
            task.querySelector("span").textContent.toLowerCase();

        const priorityElement =
            task.querySelector("small[class^='priority-']");

        const taskPriority = priorityElement
            ? priorityElement.className.replace("priority-", "")
            : "medium";

        const isCompleted = task.classList.contains("completed");

        let matchesSearch = taskText.includes(searchText);

        let matchesPriority =
            selectedPriority === "all" ||
            taskPriority === selectedPriority;

        let matchesStatus =
            selectedStatus === "all" ||
            (selectedStatus === "active" && !isCompleted) ||
            (selectedStatus === "completed" && isCompleted);

        if (matchesSearch && matchesPriority && matchesStatus) {
            task.style.display = "flex";
        } else {
            task.style.display = "none";
        }

    });
}