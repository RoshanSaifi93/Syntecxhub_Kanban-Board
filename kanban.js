const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const columns = document.querySelectorAll('.task-list');

loadTasks();

addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const task = createTask(taskText);
    document.querySelector('#todo .task-list').appendChild(task);

    saveTasks();
    taskInput.value = '';
});

function createTask(text) {
    const task = document.createElement('div');
    task.className = 'task';
    task.draggable = true;
    
    task.innerHTML = `<span>${text}</span>
        <button class="delete-btn"> ✕ </button>
    `;

    task.querySelector('.delete-btn').addEventListener('click', () => {
        task.remove();
        saveTasks();
    });

    task.addEventListener('dragstart', () => {
        task.classList.add('dragging');
    });

    task.addEventListener('dragend', () => {
        task.classList.remove('dragging');
        saveTasks();
    });

    return task;
}

columns.forEach(column => {
    column.addEventListener('dragover', e => {
        e.preventDefault();
        const draggingTask = document.querySelector('.dragging');
        if (draggingTask) {
            column.appendChild(draggingTask);
        }
    });
});

function saveTasks() {
    const data = {
        todo: [],
        doing: [],
        done: []
    };

    document.querySelectorAll('#todo .task').forEach(task => {
        data.todo.push(task.querySelector('span').innerText);
    });
    document.querySelectorAll('#doing .task').forEach(task => {
        data.doing.push(task.querySelector('span').innerText);
    });
    document.querySelectorAll('#done .task').forEach(task => {
        data.done.push(task.querySelector('span').innerText);
    });

    localStorage.setItem('kanbanData', JSON.stringify(data));
}

function loadTasks() {
    const data = JSON.parse(localStorage.getItem('kanbanData'));
    if (!data) return;  

    data.todo.forEach(text => {
        document.querySelector('#todo .task-list').appendChild(createTask(text));
    });

    data.doing.forEach(text => {
        document.querySelector('#doing .task-list').appendChild(createTask(text));
    });

    data.done.forEach(text => {
        document.querySelector('#done .task-list').appendChild(createTask(text));
    });
}

taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addTaskBtn.click();
    }
});