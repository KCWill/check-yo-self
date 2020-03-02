var addTaskButton = document.querySelector('.add-task-button').addEventListener('click', addTaskInAside);
var tasksInAside = document.querySelector('.draft-tasks');
var deleteTaskInAside = tasksInAside.addEventListener('click', deleteTaskInAside);
var taskItemInput = document.getElementById('task-item-input');
var taskTitleInput = document.querySelector('.task-title-input')
var taskCounterAside = 0;
var taskCounterClass = 0;
var toDoCounter = 0;
var objectArrayFromLS = [];
var toDoArray = [];
var taskArrayAside = [];
var taskArrayClass = [];

// var stringifiedData;
window.addEventListener('load', retrieveFromLocalStorage);

function addTaskInAside() {
  tasksInAside.innerHTML += `<li><input type='submit' value='' class='remove-task-button' data-tempNum='${taskCounterAside}'>${taskItemInput.value}</li>`;
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
  var toDo = new ToDo(taskTitleInput.value, toDoCounter, taskArrayClass);
  toDoArray.push(toDo);
  toDoCounter++;
  tasksInAside.innerHTML = '';
  taskTitleInput.value = '';
  taskArrayAside = [];
  taskArrayClass = [];
  taskCounterAside = 0;
  taskCounterClass = 0;
  console.log('make task output', toDoArray);
  pushToLocalStorage();
  displayToDo();
}

function displayToDo(){
  
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
}

function reinstantiateFromLocalStorage() {
  var tasks = [];
  console.log('objectArrayFromLS', objectArrayFromLS);
  for (var i = 0; i < objectArrayFromLS.length; i++) {
    for (var j = 0; j < objectArrayFromLS[i].length; j++) {
      var task = new Task(objectArrayFromLS[i].text, j, objectArrayFromLS[i].completed);
      tasks.push(task);
      console.log('tasks', tasks);
    }
    var toDo = new ToDo(objectArrayFromLS[i].title, objectArrayFromLS[i].iDToDo, tasks, objectArrayFromLS[i].urgency, objectArrayFromLS[i].completed);
    toDoArray.push(toDo);
  }

}
