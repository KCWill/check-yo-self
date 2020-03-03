var addTaskButton = document.querySelector('.add-task-button').addEventListener('click', addTaskInAside);
var tasksInAside = document.querySelector('.draft-tasks');
var deleteTaskInAside = tasksInAside.addEventListener('click', deleteTaskInAside);
var taskItemInput = document.getElementById('task-item-input');
var taskTitleInput = document.querySelector('.task-title-input')
var taskCounterAside = 0;
var taskCounterClass = 0;
var objectArrayFromLS = [];
var toDoArray = [];
var taskArrayAside = [];
var taskArrayClass = [];

window.addEventListener('load', retrieveFromLocalStorage);

function addTaskInAside() {
  tasksInAside.innerHTML += `<li class='draft-tasks'><input type='submit' value='' class='remove-task-button' data-tempNum='${taskCounterAside}'>${taskItemInput.value}</li>`;
  taskArrayAside.push(taskItemInput.value);
  taskCounterAside++;
  taskItemInput.value = '';
}

function deleteTaskInAside(event) {
  if (event.target.classList.contains('remove-task-button')) {
    var numOfTasksInAside = tasksInAside.children.length;
    var whichTaskToDelete = event.target.dataset.tempnum;
    var whichLiToDelete = document.querySelector(`.remove-task-button[data-tempNum='${whichTaskToDelete}']`).parentNode;
    taskArrayAside.splice(whichTaskToDelete, 1, null);
    whichLiToDelete.remove();
    console.log(taskArrayAside);
  }
}

function makeTaskList() {
  for (var i = 0; i < taskArrayAside.length; i++) {
    if (taskArrayAside[i] !== null) {
      var task = new Task(taskArrayAside[i], taskCounterClass);
      taskCounterClass++;
      taskArrayClass.push(task);
    }
  }
  var toDo = new ToDo(taskTitleInput.value, toDoArray.length+1, taskArrayClass);
  toDoArray.push(toDo);
  tasksInAside.innerHTML = '';
  taskTitleInput.value = '';
  taskArrayAside = [];
  taskArrayClass = [];
  taskCounterAside = 0;
  taskCounterClass = 0;
  console.log('make task output', toDoArray);
  pushToLocalStorage();
  displayToDoSkeleton();
}

function displayToDoSkeleton(){
  document.querySelector('.todo-list-cards').innerHTML = '';
  for (var i = 0; i < toDoArray.length; i++){
  document.querySelector('.todo-list-cards').innerHTML += `
  <section class='card-contents-container'>
    <section class='title-container'>
      <h3>${toDoArray[i].title}</h3>
    </section>
    <section class='tasks-container-in-card'>
      <ul class='list-of-tasks-in-card' data-listid='${toDoArray[i].iDToDo}'>
      </ul>
    </section>
    <section class='urgent-and-delete'>
      <section class='urgent-and-text'>
        <input type='submit' value='' class='urgent-button'><h5 class='urgent-label'>Urgent</h5>
      </section>
      <section class='delete-and-text'>
        <input type='submit' value='' class='delete-todo'>
        <h5 class='delete-label'>Delete</h5>
      </section>
    </section>
  </section>`
  for (var j = 0; j < toDoArray[i].tasks.length; j++){
  document.querySelector(`[data-listid='${toDoArray[i].iDToDo}']`).innerHTML +=`
    <li class='list-of-tasks-in-card' data-taskid ='${toDoArray[i].tasks[j].taskNumber}'><input type='submit' value='' class='complete-task-button'>${toDoArray[i].tasks[j].text}</li>`;
    }
  }
}

function pushToLocalStorage() {
  var dataToSave = [];
  for (var i = 0; i < toDoArray.length; i++) {
    dataToSave.push(toDoArray[i]);
  }
  console.log('pushToLocalStorage', dataToSave)
  var stringifiedData = JSON.stringify(dataToSave);
  var storedData = localStorage.setItem('storedData', stringifiedData);
}

function retrieveFromLocalStorage() {
  var stringifiedData = localStorage.getItem('storedData');
  objectArrayFromLS = JSON.parse(stringifiedData);
  reinstantiateFromLocalStorage();
  displayToDoSkeleton();
}

function reinstantiateFromLocalStorage() {
  for (var i = 0; i < objectArrayFromLS.length; i++) {
    var tasks = [];
    for (var j = 0; j < objectArrayFromLS[i].tasks.length; j++) {
      var task = new Task(objectArrayFromLS[i].tasks[j].text, j, objectArrayFromLS[i].completed);
      tasks.push(task);
      console.log('tasks', tasks);
    }
    var toDo = new ToDo(objectArrayFromLS[i].title, objectArrayFromLS[i].iDToDo, tasks, objectArrayFromLS[i].urgency, objectArrayFromLS[i].completed);
    toDoArray.push(toDo);
  }
    console.log(toDoArray);
}
