
const taskName = document.getElementById('taskName');
const category = document.getElementById('category');
const priority = document.getElementById('priority');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterStatus = document.getElementById("filterStatus");
const filterCategory = document.getElementById("filterCategory");

class Task {
    constructor(name, category, priority) {
        this.name = name;
        this.category = category;
        this.priority = priority;
        this.completed = false;
        this.id = Date.now();
    }
}

class TaskManger {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem("TasksList")) || [];
    }
    addTask(task) {
        this.tasks.push(task);
        this.saveToLocalStorage();
    }
    getAllTasks() {
        return this.tasks;
    }
    editTask(id) {
        return this.tasks.find(task => task.id === id);
    }
    deleteTask(id) {
        const index = this.tasks.findIndex((task) => task.id === id);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            this.saveToLocalStorage();
        }
    }
    saveToLocalStorage() {
        localStorage.setItem("TasksList", JSON.stringify(this.tasks));
    }
}

const taskManager = new TaskManger();

addBtn.addEventListener("click", () => {
    const taskNameValue = taskName.value.trim();
    const categoryValue = category.value;
    const priorityValue = priority.value;
    if (!taskNameValue || !categoryValue || !priorityValue) {
        alert("Please fill all fields.");
        return;
    }
    const task = new Task(taskNameValue, categoryValue, priorityValue);
    taskManager.addTask(task);
    renderTasks();
    taskName.value = '';
    category.value = '';
    priority.value = '';
});

window.onload = renderTasks;

function renderTasks() {
    taskList.innerHTML = '';
    taskManager.getAllTasks().forEach(renderTask);
}

function renderTask(task) {
    const li = document.createElement("li");

    const editBtn = document.createElement("button");
    editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    editBtn.className = "edit-btn";

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    deleteBtn.className = "delete-btn";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    const spanElement = document.createElement("span");
    spanElement.textContent = `${task.name} [${task.category}] - ${task.priority} - ${task.completed ? '✅' : '❌'}`;

    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        taskManager.saveToLocalStorage();
        spanElement.textContent = `${task.name} [${task.category}] - ${task.priority} - ${task.completed ? '✅' : '❌'}`;
    });
    li.appendChild(checkbox);
    li.appendChild(spanElement);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);


    editBtn.addEventListener('click', () => {
        taskName.value = task.name;
        category.value = task.category;
        priority.value = task.priority;

          taskManager.deleteTask(task.id);
          renderFilteredTasks();
    });

    deleteBtn.addEventListener("click", () => {
        taskManager.deleteTask(task.id);
        renderFilteredTasks();
    });

}

filterStatus.addEventListener('change', renderFilteredTasks);
filterCategory.addEventListener('change', renderFilteredTasks);


function renderFilteredTasks() {
    const statusValue = filterStatus.value;
    const categoryValue = filterCategory.value;
    taskList.innerHTML = '';

    console.log(`\n🔍 FILTERING TASKS`);
    console.log(`Selected status: ${statusValue}`);
    console.log(`Selected category: ${categoryValue}`);

    const filteredTasks = taskManager.getAllTasks().filter((task) => {
        const matchesStatus =
            statusValue === "all" ||
            (statusValue === "complete" && task.completed) ||
            (statusValue === "incomplete" && !task.completed);

        const matchesCategory =
            categoryValue === "all" || task.category === categoryValue;

        console.log(`\n📝 Task: ${task.name}`);
        console.log(`Completed? ${task.completed}`);
        console.log(`Matches status filter? ${matchesStatus}`);
        console.log(`Matches category filter? ${matchesCategory}`);

        return matchesStatus && matchesCategory;
    });

    filteredTasks.forEach(renderTask);
}
