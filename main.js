var addTaskButton = document.querySelector('.add-task-button').addEventListener('click', addTaskInAside);
var tasksInAside = document.querySelector('.draft-tasks');
var deleteTaskInAside = tasksInAside.addEventListener('click', deleteTaskInAside);
var taskItemInput = document.getElementById('task-item-input');
var taskTitleInput = document.querySelector('.task-title-input')
var cardContainer = document.querySelector('.todo-list-cards');
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
  var toDo = new ToDo(taskTitleInput.value, toDoArray.length, taskArrayClass);
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

function displayToDoSkeleton() {
  cardContainer.innerHTML = '';
  for (var i = 0; i < toDoArray.length; i++) {
    cardContainer.innerHTML += `
  <section class='card-contents-container' data-taskid=${toDoArray[i].iDToDo}>
    <section class='title-container'>
      <h3>${toDoArray[i].title}</h3>
    </section>
    <section class='tasks-container-in-card'>
      <ul class='list-of-tasks-in-card' data-listid='${toDoArray[i].iDToDo}'>
      </ul>
    </section>
    <section class='urgent-and-delete'>
      <section class='urgent-and-text'>
        <input type='submit' value='' class='urgent-button' data-listid='${toDoArray[i].iDToDo}'><h5 class='urgent-label'>Urgent</h5>
      </section>
      <section class='delete-and-text'>
        <input type='submit' value='' class='delete-todo'>
        <h5 class='delete-label'>Delete</h5>
      </section>
    </section>
  </section>`
    for (var j = 0; j < toDoArray[i].tasks.length; j++) {
      document.querySelector(`[data-listid='${toDoArray[i].iDToDo}']`).innerHTML += `
    <li class='list-of-tasks-in-card' data-taskid ='${toDoArray[i].tasks[j].taskNumber}'><input type='submit' value='' class='complete-task-button' data-listid='${toDoArray[i].iDToDo}' data-taskid='${toDoArray[i].tasks[j].taskNumber}'>${toDoArray[i].tasks[j].text}</li>`;
    }
  }
}

function pushToLocalStorage() {
  var dataToSave = [];
  for (var i = 0; i < toDoArray.length; i++) {
    dataToSave.push(toDoArray[i]);
  }
  var stringifiedData = JSON.stringify(dataToSave);
  var storedData = localStorage.setItem('storedData', stringifiedData);
}

function retrieveFromLocalStorage() {
  var stringifiedData = localStorage.getItem('storedData');
  objectArrayFromLS = JSON.parse(stringifiedData);
  reinstantiateFromLocalStorage();
  displayToDoSkeleton();
  persistCompletedTasks();
  persistUrgentToDos();
}

function reinstantiateFromLocalStorage() {
  for (var i = 0; i < objectArrayFromLS.length; i++) {
    var tasks = [];
    for (var j = 0; j < objectArrayFromLS[i].tasks.length; j++) {
      var task = new Task(objectArrayFromLS[i].tasks[j].text, j, objectArrayFromLS[i].tasks[j].completed);
      tasks.push(task);
      console.log('tasks', tasks);
    }
    var toDo = new ToDo(objectArrayFromLS[i].title, objectArrayFromLS[i].iDToDo, tasks, objectArrayFromLS[i].urgency, objectArrayFromLS[i].completed);
    toDoArray.push(toDo);
  }
  console.log(toDoArray);
}

cardContainer.addEventListener('click', eventHandler);

function eventHandler(event) {
  if (event.target.classList.contains('complete-task-button')) {
    markCompleted(event);
  } else if (event.target.classList.contains('urgent-button')) {
    markUrgent(event);
  }
}





function markCompleted(event) {
  event.target.parentNode.classList.toggle('completed-task-text');
  event.target.classList.toggle('complete-task-button-checked');
  var taskNum = event.target.dataset.taskid;
  var listNum = event.target.dataset.listid;
  toDoArray[listNum].tasks[taskNum].toggleCompleted();
  pushToLocalStorage();
}

function persistCompletedTasks() {
  for (var i = 0; i < toDoArray.length; i++) {
    for (var j = 0; j < toDoArray[i].tasks.length; j++) {
      if (toDoArray[i].tasks[j].completed) {
        var tempToDoList = document.querySelectorAll(`[data-listid='${toDoArray[i].iDToDo}']`);
        console.log('tempToDoList', tempToDoList);
        tempToDoList[j + 1].classList.toggle('complete-task-button-checked');
        tempToDoList[j + 1].parentNode.classList.toggle('completed-task-text');
      }
    }
  }
}

function markUrgent(event) {
  var whichList = event.target.dataset.listid;
  toDoArray[whichList].toggleUrgent();
  event.target.parentNode.parentNode.parentNode.classList.toggle('urgent-container');
  event.target.classList.toggle('urgent-button-marked');
  event.target.nextSibling.classList.toggle('urgent-label-active');
  event.target.parentNode.parentNode.children[1].children[1].classList.toggle('delete-label-when-urgent-active');
  event.target.parentNode.parentNode.parentNode.children[1].classList.toggle('urgent-container')
  event.target.parentNode.parentNode.parentNode.children[0].classList.toggle('urgent-container')
  pushToLocalStorage();
}

function persistUrgentToDos(){
  for (var i = 0; i < toDoArray.length; i++){
    if (toDoArray[i].urgency){
      var listOfTasks = document.querySelector(`[data-listid='${toDoArray[i].iDToDo}']`);
      listOfTasks.parentNode.parentNode.classList.toggle('urgent-container');
      listOfTasks.parentNode.parentNode.children[2].children[0].children[0].classList.toggle('urgent-button-marked');
      listOfTasks.parentNode.parentNode.children[2].children[0].children[1].classList.toggle('urgent-label-active')
      listOfTasks.parentNode.parentNode.children[2].children[1].children[1].classList.toggle('delete-label-when-urgent-active');
      listOfTasks.parentNode.classList.toggle('urgent-container');
      listOfTasks.parentNode.parentNode.children[0].classList.toggle('urgent-container');
    }
  }
}
