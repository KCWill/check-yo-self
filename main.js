var addTaskButton = document.querySelector('.add-task-button').addEventListener('click', addTaskInAside);
var tasksInAside = document.querySelector('.draft-tasks');
var deleteTaskInAside = tasksInAside.addEventListener('click', deleteTaskInAside);
var taskItemInput = document.getElementById('task-item-input');
var taskTitleInput = document.querySelector('.task-title-input')
var taskCounterAside = 0;
var taskCounterClass = 0;
var toDoCounter = 0;
var toDoArray = [];
var taskArrayAside = [];
var taskArrayClass = [];

function addTaskInAside() {
  tasksInAside.innerHTML += `<li><input type='submit' value='' class='remove-task-button' data-tempNum='${taskCounterAside}'>${taskItemInput.value}</li>`;
  taskArrayAside.push(taskItemInput.value);
  taskCounterAside++;
  taskItemInput.value = '';
}

function deleteTaskInAside(event) {
  if (event.target.classList.contains('remove-task-button')){
  var numOfTasksInAside = tasksInAside.children.length;
  var whichTaskToDelete = event.target.dataset.tempnum;
  var whichLiToDelete = document.querySelector(`.remove-task-button[data-tempNum='${whichTaskToDelete}']`).parentNode;
  taskArrayAside.splice(whichTaskToDelete, 1, null);
  whichLiToDelete.remove();
  console.log(taskArrayAside);
  }
}

function makeTaskList() {
  for (var i = 0; i < taskArrayAside.length; i++){
    if (taskArrayAside[i] !== null){
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
}
