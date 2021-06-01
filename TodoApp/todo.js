//selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-btn");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelectorAll(".tab");
const noTodos = document.querySelector(".no-todos");

//event listeners
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteAndCheck);
filterOption.forEach((t) => t.addEventListener("click", filterTodo));
document.addEventListener("DOMContentLoaded", getTodos);

function createTodoDiv(todo) {
  const todoDiv = document.createElement("div");
  todoDiv.setAttribute("todo-id", todo.todoId);
  todoDiv.classList.add("todo");
  const checkBtn = document.createElement("button");
  checkBtn.innerHTML = '<i class="fas fa-check"></i>';
  checkBtn.classList.add("complete-btn");

  todoDiv.appendChild(checkBtn);
  const newTodo = document.createElement("li");
  newTodo.innerText = todo.todo;
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);
  if (todo.completed === 1) {
    newTodo.classList.add("completed");
  }
  const trashBtn = document.createElement("button");
  trashBtn.innerHTML = '<i class="fas fa-trash"></i>';
  trashBtn.classList.add("trash-btn");
  todoDiv.appendChild(trashBtn);
  todoList.appendChild(todoDiv);
}

function removeNoTodo(flag) {
  noTodos.classList.toggle("remove");
  noTodos.addEventListener("transitionend", function () {
    if (flag) noTodos.style.display = "none";
    else noTodos.style.display = "block";
  });
}

function addTodo(event) {
  event.preventDefault();
  if (todoInput.value.length === 0) return;
  const t = {
    todo: todoInput.value,
    completed: 0,
    todoId: Math.floor(1e4 * Math.random()),
  };
  createTodoDiv(t);
  //adding to local
  saveLocalTodos(t);
  todoInput.value = ""; //
  removeNoTodo(true);
}

function saveLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}
function getTodos() {
  let actTab = 1;
  filterOption.forEach((t, ind) => {
    if (t.classList.contains("active")) {
      actTab = ind + 1;
    }
  });
  console.log(actTab);
  todoList.innerHTML = "";
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.forEach(function (todo) {
    if (actTab === 1) {
      createTodoDiv(todo);
    } else if (actTab === 2 && todo.completed === 1) {
      createTodoDiv(todo);
    } else if (actTab === 3 && todo.completed === 0) {
      createTodoDiv(todo);
    }
  });
  if (todos.length !== 0) {
    removeNoTodo(true);
  }
}

function deleteAndCheck(e) {
  const item = e.target;
  const id = item.parentElement.getAttribute("todo-id");
  const list = JSON.parse(localStorage.getItem("todos"));
  if (item.classList[0] === "trash-btn") {
    localStorage.setItem(
      "todos",
      JSON.stringify(list.filter((l) => l.todoId != id))
    );
    getTodos();
  } else if (item.classList[0] === "complete-btn") {
    localStorage.setItem(
      "todos",
      JSON.stringify(
        list.map((l) => {
          if (l.todoId === parseInt(id)) {
            l.completed = l.completed === 1 ? 0 : 1;
          }
          return l;
        })
      )
    );
    getTodos();
  }
}

function filterTodo(e) {
  filterOption.forEach((t) => t.classList.remove("active"));
  e.target.classList.add("active");
  getTodos();
}
