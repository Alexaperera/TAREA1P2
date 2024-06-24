document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('taskForm').addEventListener('submit', addTask);

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => displayTask(task));
}

function addTask(e) {
    e.preventDefault();
    
    const taskName = document.getElementById('taskName').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const responsible = document.getElementById('responsible').value;

    if (new Date(startDate) > new Date(endDate)) {
        alert('La fecha de fin no puede ser menor a la fecha de inicio');
        return;
    }

    const task = {
        name: taskName,
        start: startDate,
        end: endDate,
        responsible: responsible,
        completed: false
    };

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    displayTask(task);
    document.getElementById('taskForm').reset();
}

function displayTask(task) {
    const taskList = document.getElementById('taskList');

    const li = document.createElement('li');
    li.className = 'list-group-item bg-dark p-3 border border-light mb-2 rounded';
    li.innerHTML = `
        <div>
            <h5 class="text-white">${task.name}</h5>
            <p class="text-white">Contenido: ${task.responsible}</p>
            <p class="text-white">Inicio: ${task.start} - Fin: ${task.end}</p>
            <button class="btn btn-success btn-custom btn-sm" onclick="toggleComplete(this)">Marcar como resuelta</button>
            <button class="btn btn-danger btn-sm" onclick="deleteTask(this)">Eliminar</button>
            <p id="vencida" style="color:red; display: none;">¡Tarea vencida!</p>
        </div>
    `;

    const currentDate = new Date();
    const endDate = new Date(task.end);

    if (task.completed) {
        li.classList.add('completed');
        li.querySelector('.btn-success').innerText = 'Desmarcar';
    } else if (currentDate > endDate) {
        li.classList.add('expired');
        const button = li.querySelector('.btn-success');
        if (button) {
            button.classList.remove('btn-success');
            button.classList.add('btn-danger');
            button.classList.add('btn-danger-disabled');
            button.disabled = true;
            button.innerText = 'Vencida';
        }
        const vencidaMessage = li.querySelector('#vencida');
        if (vencidaMessage) {
            vencidaMessage.style.display = 'block';
        }
    }

    taskList.appendChild(li);
}

function toggleComplete(button) {
    const li = button.parentElement.parentElement;
    const taskName = li.querySelector('h5').innerText;
    const tasks = JSON.parse(localStorage.getItem('tasks'));

    const task = tasks.find(t => t.name === taskName);
    task.completed = !task.completed;

    localStorage.setItem('tasks', JSON.stringify(tasks));
    li.classList.toggle('completed');
    button.innerText = task.completed ? 'Desmarcar' : 'Marcar como resuelta';
}

function deleteTask(button) {
    const li = button.parentElement.parentElement;
    const taskName = li.querySelector('h5').innerText;
    let tasks = JSON.parse(localStorage.getItem('tasks'));

    tasks = tasks.filter(t => t.name !== taskName);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    li.remove();
}
