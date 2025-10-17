// Global Variables
let todos = [];
let currentFilter = 'all';

// DOM Elements
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const dateInput = document.getElementById('dateInput');
const todoList = document.getElementById('todoList');
const searchInput = document.getElementById('searchInput');
const filterBtn = document.getElementById('filterBtn');
const filterOptions = document.getElementById('filterOptions');
const deleteAllBtn = document.getElementById('deleteAllBtn');

const totalTasks = document.getElementById('totalTasks');
const completedTasks = document.getElementById('completedTasks');
const pendingTasks = document.getElementById('pendingTasks');
const progressPercentage = document.getElementById('progressPercentage');

// Event Listeners
todoForm.addEventListener('submit', addTodo);
searchInput.addEventListener('input', renderTodos);
filterBtn.addEventListener('click', toggleFilter);
deleteAllBtn.addEventListener('click', deleteAll);

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', setFilter);
});

// Validate Input Function
function validateInput() {
    const todoText = todoInput.value.trim();
    const todoDate = dateInput.value;
    
    if (todoText === '') {
        alert('Please enter a task!');
        todoInput.focus();
        return false;
    }
    
    if (todoDate === '') {
        alert('Please select a date!');
        dateInput.focus();
        return false;
    }
    
    const selectedDate = new Date(todoDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        alert('Date cannot be in the past!');
        dateInput.focus();
        return false;
    }
    
    return true;
}

// Add Todo Function
function addTodo(e) {
    e.preventDefault();
    
    if (!validateInput()) {
        return;
    }
    
    const todo = {
        id: Date.now(),
        text: todoInput.value.trim(),
        date: dateInput.value,
        completed: false
    };
    
    todos.push(todo);
    todoInput.value = '';
    dateInput.value = '';
    
    renderTodos();
    updateStats();
}

// Render Todo Function
function renderTodos() {
    let filtered = filterTodos();
    
    if (filtered.length === 0) {
        todoList.innerHTML = `
            <tr>
                <td colspan="4" class="px-4 py-8 text-center text-gray-400">
                    No tasks found
                </td>
            </tr>
        `;
        return;
    }
    
    todoList.innerHTML = filtered.map(todo => `
        <tr class="todo-row ${todo.completed ? 'completed' : ''}">
            <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        ${todo.completed ? 'checked' : ''}
                        onchange="toggleComplete(${todo.id})"
                        class="w-4 h-4 cursor-pointer"
                    >
                    <span class="task-text">${todo.text}</span>
                </div>
            </td>
            <td class="px-4 py-3 text-gray-600 text-sm">${formatDate(todo.date)}</td>
            <td class="px-4 py-3">
                <span class="${todo.completed ? 'status-completed' : 'status-pending'}">
                    ${todo.completed ? 'Completed' : 'Pending'}
                </span>
            </td>
            <td class="px-4 py-3">
                <div class="flex gap-2">
                    <button onclick="editTodo(${todo.id})" class="btn-edit">Edit</button>
                    <button onclick="deleteTodo(${todo.id})" class="btn-delete">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Toggle Complete Function
function toggleComplete(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        renderTodos();
        updateStats();
    }
}

// Edit Todo Function
function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        const newText = prompt('Edit task:', todo.text);
        if (newText && newText.trim() !== '') {
            todo.text = newText.trim();
            renderTodos();
        }
    }
}

// Delete Todo Function
function deleteTodo(id) {
    if (confirm('Delete this task?')) {
        todos = todos.filter(t => t.id !== id);
        renderTodos();
        updateStats();
    }
}

// Delete All Function
function deleteAll() {
    if (todos.length === 0) {
        alert('No tasks to delete!');
        return;
    }
    
    if (confirm('Delete all tasks?')) {
        todos = [];
        renderTodos();
        updateStats();
    }
}

// Filter Functions
function toggleFilter() {
    filterOptions.classList.toggle('hidden');
}

function setFilter(e) {
    currentFilter = e.target.dataset.filter;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    renderTodos();
}

function filterTodos() {
    let filtered = todos;
    
    if (currentFilter === 'completed') {
        filtered = filtered.filter(t => t.completed);
    } else if (currentFilter === 'pending') {
        filtered = filtered.filter(t => !t.completed);
    }
    
    const search = searchInput.value.toLowerCase();
    if (search) {
        filtered = filtered.filter(t => t.text.toLowerCase().includes(search));
    }
    
    return filtered;
}

// Update Statistics Function
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
    progressPercentage.textContent = progress + '%';
}

// Format Date Function
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Initialize
updateStats();