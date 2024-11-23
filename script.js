document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");
    const clearAllBtn = document.getElementById("clear-all-btn");
    const filterTasks = document.getElementById("filter-tasks");
    const themeToggle = document.getElementById("theme-toggle");
    const notification = document.getElementById("notification");

    const sortPriorityBtn = document.getElementById("sort-priority-btn");
    const sortDeadlineBtn = document.getElementById("sort-deadline-btn");

    let darkMode = localStorage.getItem("darkMode") === "enabled";
    if (darkMode) document.body.classList.add("dark");

    themeToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark');
        darkMode = !darkMode;
        localStorage.setItem("darkMode", darkMode ? "enabled" : "disabled");
    });

    addTaskBtn.addEventListener("click", function () {
        const taskText = taskInput.value.trim();
        const priority = document.querySelector('.priority-select').value;
        const deadline = document.getElementById("task-deadline").value;

        if (taskText !== "" && deadline) {
            addTask(taskText, priority, deadline);
            taskInput.value = "";
            clearAllBtn.style.display = "inline-block"; // Show the button
            saveTasks();
        } else {
            showNotification("Please fill in the task and deadline.");
        }
    });

    function addTask(taskText, priority, deadline) {
        const li = document.createElement("li");
        li.classList.add(priority);

        const now = new Date();
        const taskDeadline = new Date(deadline);
        if (taskDeadline < now) {
            li.classList.add("overdue");
        }

        li.innerHTML = `
            <span>${taskText}</span>
            <span class="deadline">${new Date(deadline).toLocaleString()}</span>
            <button class="complete-btn">Completed</button>
            <button class="delete-btn">Delete</button>
        `;

        li.querySelector('.complete-btn').addEventListener("click", function () {
            li.classList.toggle("completed");
            updateProgress();
        });

        li.querySelector('.delete-btn').addEventListener("click", function () {
            if (confirm("Are you sure you want to delete this task?")) {
                li.remove();
                updateProgress();
                saveTasks();
            }
        });

        taskList.appendChild(li);
        updateProgress();
    }

    clearAllBtn.addEventListener("click", function () {
        if (confirm("Are you sure you want to clear all tasks?")) {
            taskList.innerHTML = "";
            clearAllBtn.style.display = "none";
            saveTasks();
        }
    });

    function updateProgress() {
        const tasks = Array.from(taskList.children);
        const completedTasks = tasks.filter(task => task.classList.contains("completed")).length;
        const progressPercentage = (completedTasks / tasks.length) * 100;
        document.querySelector(".progress").style.width = progressPercentage + "%";
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(task => {
            tasks.push({
                text: task.querySelector('span').textContent,
                completed: task.classList.contains('completed'),
                priority: task.classList.contains('high') ? 'high' : task.classList.contains('medium') ? 'medium' : 'low',
                deadline: task.querySelector('.deadline').textContent
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTask(task.text, task.priority, task.deadline);
            const lastTask = taskList.lastElementChild;
            if (task.completed) lastTask.classList.add('completed');
        });
        updateProgress();
        if (taskList.children.length > 0) clearAllBtn.style.display = "inline-block";
    }

    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
    }

    loadTasks();
});
