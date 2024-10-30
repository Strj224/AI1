// Pobranie zadań z Local Storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Funkcja do wyświetlania zadań
function displayTasks(filteredTasks = tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Czyszczenie listy przed ponownym renderowaniem

    filteredTasks.forEach((task, index) => {
        const listItem = document.createElement('li');

        // Tworzenie elementu listy z nazwą, datą i przyciskiem usuwania
        listItem.innerHTML = `
            <span class="task-name" onclick="enableEditTaskName(${index})">${highlightText(task.name, document.getElementById('search').value)}</span>
            <span class="task-deadline" onclick="enableEditTaskDeadline(${index})">${formatDate(task.deadline) || 'Brak'}</span>
            <button onclick="deleteTask(${index})">Usuń</button>
        `;

        taskList.appendChild(listItem);
    });
}

// Funkcja formatowania daty do formatu 'dd/mm/yyyy'
function formatDate(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

// Zapisanie zadań do Local Storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Wyświetlanie zadań na starcie
displayTasks();

// Dodawanie nowego zadania
document.getElementById('addTask').addEventListener('click', () => {
    const newTask = document.getElementById('newTask').value.trim();
    const deadline = document.getElementById('deadline').value;

    // Walidacja
    if (newTask.length < 3 || newTask.length > 255) {
        alert('Zadanie musi mieć co najmniej 3 znaki i nie więcej niż 255.');
        return;
    }

    if (deadline && new Date(deadline) < new Date()) {
        alert('Termin musi być w przyszłości.');
        return;
    }

    // Dodanie nowego zadania
    tasks.push({ name: newTask, deadline: deadline || null });
    saveTasks();
    displayTasks();

    // Wyczyść pola
    document.getElementById('newTask').value = '';
    document.getElementById('deadline').value = '';
});

// Usuwanie zadania
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    displayTasks();
}

// Wyszukiwanie zadań
document.getElementById('search').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();

    // Filtruj zadania na podstawie wyszukiwania
    const filteredTasks = tasks.filter(task => task.name.toLowerCase().includes(query));

    // Wyświetlaj tylko zadania, które pasują do wyszukiwania
    displayTasks(filteredTasks);
});

// Funkcja wyróżniania wyszukiwanej frazy
function highlightText(text, query) {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, "<mark>$1</mark>");
}

// Edycja nazwy zadania
function enableEditTaskName(index) {
    const taskNameElement = document.querySelectorAll('.task-name')[index];
    const input = document.createElement('input');
    input.type = 'text';
    input.value = tasks[index].name;

    // Po kliknięciu poza pole edycji zapisuje zmiany
    input.addEventListener('blur', () => {
        const newValue = input.value.trim();
        if (newValue.length >= 3 && newValue.length <= 255) {
            tasks[index].name = newValue;
            saveTasks();
            displayTasks();
        } else {
            alert('Zadanie musi mieć co najmniej 3 znaki i nie więcej niż 255.');
        }
    });

    taskNameElement.innerHTML = ''; // Czyścimy oryginalny element
    taskNameElement.appendChild(input);
    input.focus();
}

// Edycja terminu zadania
function enableEditTaskDeadline(index) {
    const taskDeadlineElement = document.querySelectorAll('.task-deadline')[index];
    const input = document.createElement('input');
    input.type = 'date';
    input.value = tasks[index].deadline ? tasks[index].deadline.split('T')[0] : '';

    // Po kliknięciu poza pole edycji zapisuje zmiany
    input.addEventListener('blur', () => {
        const newValue = input.value;
        if (!newValue || new Date(newValue) > new Date()) {
            tasks[index].deadline = newValue || null;
            saveTasks();
            displayTasks();
        } else {
            alert('Termin musi być w przyszłości.');
        }
    });

    taskDeadlineElement.innerHTML = ''; // Czyścimy oryginalny element
    taskDeadlineElement.appendChild(input);
    input.focus();
}

// Wyświetlenie zadań na starcie
displayTasks();
