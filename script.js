let editId = null;
const taskName = document.getElementById('taskName');
const category = document.getElementById('category');
const priority = document.getElementById('priority');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterStatus = document.getElementById("filterStatus");
const filterCategory = document.getElementById("filterCategory");
const clearAllBtn = document.getElementById('clearAllBtn');
const dummyTaskBtn = document.getElementById('dummyTaskBtn');



class Task {
    constructor(name, category, priority) {
        this.name = name;
        this.category = category;
        this.priority = priority;
        this.completed = false;
        this.id = crypto.randomUUID();
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
    getCount() {
        let total = 0;
        let completed = 0;
        let inCompleted = 0;
        this.tasks.forEach((task) => {
            total++;
            task.completed === true ? completed++ : inCompleted++;
        })
        return { total, completed, inCompleted }
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
    if (editId !== null) {
        const taskToUpdate = taskManager.editTask(editId);
        taskToUpdate.name = taskNameValue;
        taskToUpdate.category = categoryValue;
        taskToUpdate.priority = priorityValue;
        taskManager.saveToLocalStorage();
        editId = null;
        addBtn.textContent = "Add Task";
        addBtn.style.background = "#3f51b5";
        taskName.value = '';
        category.value = '';
        priority.value = '';
        renderTasks();
    }else{
    const task = new Task(taskNameValue, categoryValue, priorityValue);
    taskManager.addTask(task);
    taskName.value = '';
        category.value = '';
        priority.value = '';
    renderTasks();
    }
});

window.onload = renderTasks;

clearAllBtn.addEventListener('click', () => {
    taskManager.tasks = [];
    taskManager.saveToLocalStorage();
     dummyTaskBtn.style.display = "block"
    renderTasks();
});


dummyTaskBtn.addEventListener('click', () => {
    const dummyData = [
        {
            name: "Javascript",
            category: "Work",
            priority: "High",
            completed: false
        },
        {
            name: "Php",
            category: "Study",
            priority: "Low",
            completed: true
        },
        {
            name: "C#",
            category: "Personal",
            priority: "Medium",
            completed: false
        },
        {
            name: "Javascript",
            category: "Work",
            priority: "High",
            completed: true
        }
    ];
     taskManager.tasks = [];
     dummyData.forEach((data) => {
        const task = new Task(data.name,data.category,data.priority);
        task.completed = data.completed;
        taskManager.addTask(task);
        console.log("Loaded dummy task:", task.name, task.id);
     })
     

    renderTasks();
});

function renderTasks() {
    taskList.innerHTML = '';
    const allTasks = taskManager.getAllTasks();
    allTasks.forEach(renderTask);
    updateCount(allTasks);
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
        updateCount();
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
        editId = task.id;
        addBtn.textContent = "Update Task";
        addBtn.style.background = "red";
        taskName.focus();
        renderFilteredTasks();
    });

    deleteBtn.addEventListener("click", () => {
        taskManager.deleteTask(task.id);
        renderFilteredTasks();
    });

    if(taskManager.getAllTasks().length > 0){
    dummyTaskBtn.style.display = "none"
}
}

function updateCount(array) {
    let total = 0;
    let completed = 0;
    let inCompleted = 0;
    if (array === undefined) {
        array = taskManager.getAllTasks();
    }
    array.forEach((task) => {
        total++;
        task.completed === true ? completed++ : inCompleted++;
    })
    document.getElementById('total-count').textContent = total;
    document.getElementById('completed-count').textContent = completed;
    document.getElementById('incomplete-count').textContent = inCompleted;
    return { total, completed, inCompleted };
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
    updateCount(filteredTasks);
}
