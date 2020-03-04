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
var urgencyCheck = 0;
window.addEventListener('load', retrieveFromLocalStorage);
cardContainer.addEventListener('click', eventHandler);



function enableButtons() {
  if (taskTitleInput.value.length === 0 && taskItemInput.value.length === 0 && taskArrayAside.length === 0) {
    document.querySelector('.add-task-button').disabled = true;
    document.querySelector('.clear-all-button').disabled = true;
    document.querySelector('.make-task-list-button').disabled = true;
  } else if (taskTitleInput.value.length > 0 && taskArrayAside.length > 0 && taskItemInput.value.length === 0) {
    document.querySelector('.make-task-list-button').disabled = false;
    document.querySelector('.clear-all-button').disabled = false;
    document.querySelector('.add-task-button').disabled = true;
  } else if (taskItemInput.value.length > 0) {
    document.querySelector('.add-task-button').disabled = false;
    document.querySelector('.clear-all-button').disabled = false;
  } else if (taskTitleInput.value.length > 0) {
    document.querySelector('.clear-all-button').disabled = false;
  } else if (taskTitleInput.value.length === 0) {
    document.querySelector('.make-task-list-button').disabled = true;
    document.querySelector('.clear-all-button').disabled = true;
  }
}

function clearAllInputs() {
  taskCounterAside = 0;
  taskCounterClass = 0;
  taskArrayAside = [];
  taskArrayClass = [];
  taskTitleInput.value = '';
  taskItemInput.value = '';
  tasksInAside.innerHTML = '';
  enableButtons();
}

function searchTasks() {
  for (var i = 0; i < toDoArray.length; i++) {
    var term = document.querySelector('.search-input').value;
    var matchSearch = toDoArray[i].title.indexOf(term);
    var cardToHide = document.querySelector(`[data-hidesearchurgency='${i}']`)
    if (matchSearch == -1) {
      cardToHide.classList.add('hide');
    } else {
      cardToHide.classList.remove('hide');
    }
  }
};

function filterByUrgency() {
  if (urgencyCheck === 0) {
    document.querySelector('.filter-by-urgency-button').classList.add('filter-by-urgency-button-active');
    for (var i = 0; i < toDoArray.length; i++) {
      if (!toDoArray[i].urgency) {
        var cardToHide = document.querySelector(`[data-hidesearchurgency='${i}']`)
        cardToHide.classList.add('hide');

      }
    }
    urgencyCheck++;
    return;
  } else if (urgencyCheck === 1) {
    document.querySelector('.filter-by-urgency-button').classList.remove('filter-by-urgency-button-active')
    for (var j = 0; j < toDoArray.length; j++) {
      cardToHide = document.querySelector(`[data-hidesearchurgency='${j}']`)
      cardToHide.classList.remove('hide');
    }

    urgencyCheck = 0;
  }
}

function addTaskInAside() {
  tasksInAside.innerHTML += `<li class='draft-tasks'><input type='submit' value='' class='remove-task-button' data-tempNum='${taskCounterAside}'>${taskItemInput.value}</li>`;
  taskArrayAside.push(taskItemInput.value);
  taskCounterAside++;
  taskItemInput.value = '';
  enableButtons();
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
  clearAllInputs()
  pushToLocalStorage();
  displayToDoSkeleton();
  retrieveFromLocalStorage();
  enableButtons();
}

function displayToDoSkeleton() {
  cardContainer.innerHTML = '';
  for (var i = 0; i < toDoArray.length; i++) {
    cardContainer.innerHTML += `
  <section class='card-contents-container' data-hidesearchurgency='${toDoArray[i].iDToDo}' data-taskid='${toDoArray[i].iDToDo}'>
    <section class='title-container'>
      <h3>${toDoArray[i].title}</h3>
    </section>
    <section class='tasks-container-in-card'>
      <ul class='list-of-tasks-in-card' data-listid='${toDoArray[i].iDToDo}'>
      </ul>
    </section>
    <section class='urgent-and-delete'>
      <section class='urgent-and-text'>
        <input type='submit' value='' class='urgent-button' data-listid='${toDoArray[i].iDToDo}' ><h5 class='urgent-label'>Urgent</h5>
      </section>
      <section class='delete-and-text'>
        <input type='submit' value='' class='delete-todo' data-buttonid='${toDoArray[i].iDToDo}'disabled>
        <h5 class='delete-label'>Delete</h5>
      </section>
    </section>
  </section>`
    for (var j = 0; j < toDoArray[i].tasks.length; j++) {
      document.querySelector(`[data-listid='${toDoArray[i].iDToDo}']`).innerHTML += `
    <li class='list-of-tasks-in-card' data-taskid ='${toDoArray[i].tasks[j].taskNumber}'><input type='submit' value='' class='complete-task-button' data-listid='${toDoArray[i].iDToDo}' data-taskid='${toDoArray[i].tasks[j].taskNumber}'>${toDoArray[i].tasks[j].text}</li>`;
    }
  }
  displayDelete();
}

function pushToLocalStorage() {
  localStorage.clear();
  var dataToSave = [];
  for (var i = 0; i < toDoArray.length; i++) {
    dataToSave.push(toDoArray[i]);
  }
  var stringifiedData = JSON.stringify(dataToSave);
  var storedData = localStorage.setItem('storedData', stringifiedData);
}

function retrieveFromLocalStorage() {
  var stringifiedData = localStorage.getItem('storedData');
  if (stringifiedData === null) {
    return
  }
  objectArrayFromLS = JSON.parse(stringifiedData);
  reinstantiateFromLocalStorage();
  displayToDoSkeleton();
  persistCompletedTasks();
  persistUrgentToDos();
}

function reinstantiateFromLocalStorage() {
  toDoArray = [];
  for (var i = 0; i < objectArrayFromLS.length; i++) {
    var tasks = [];
    for (var j = 0; j < objectArrayFromLS[i].tasks.length; j++) {
      var task = new Task(objectArrayFromLS[i].tasks[j].text, j, objectArrayFromLS[i].tasks[j].completed);
      tasks.push(task);
    }
    var toDo = new ToDo(objectArrayFromLS[i].title, i, tasks, objectArrayFromLS[i].urgency, objectArrayFromLS[i].completed);
    toDoArray.push(toDo);
  }
}

function eventHandler(event) {
  if (event.target.classList.contains('complete-task-button')) {
    markCompleted(event);
  } else if (event.target.classList.contains('urgent-button')) {
    markUrgent(event);
  } else if (event.target.classList.contains('delete-todo') && event.target.disabled === false) {
    deleteToDo(event);
  }
}

function deleteToDo(event) {
  var whichToDo = event.target.dataset.buttonid;
  console.log(whichToDo)
  toDoArray.splice(whichToDo, 1);
  pushToLocalStorage();
  retrieveFromLocalStorage();
}

function markCompleted(event) {
  event.target.parentNode.classList.toggle('completed-task-text');
  event.target.classList.toggle('complete-task-button-checked');
  var taskNum = event.target.dataset.taskid;
  var listNum = event.target.dataset.listid;
  toDoArray[listNum].tasks[taskNum].toggleCompleted();
  pushToLocalStorage();
  retrieveFromLocalStorage();
}

function persistCompletedTasks() {
  for (var i = 0; i < toDoArray.length; i++) {
    for (var j = 0; j < toDoArray[i].tasks.length; j++) {
      if (toDoArray[i].tasks[j].completed) {
        var tempToDoList = document.querySelectorAll(`[data-listid='${toDoArray[i].iDToDo}']`);
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
  retrieveFromLocalStorage();
}

function persistUrgentToDos() {
  for (var i = 0; i < toDoArray.length; i++) {
    if (toDoArray[i].urgency) {
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

function displayDelete() {
  for (var i = 0; i < toDoArray.length; i++) {
    var completeCounter = 0;
    for (var j = 0; j < toDoArray[i].tasks.length; j++) {
      var currentListOfTasks = document.querySelector(`[data-listid='${toDoArray[i].iDToDo}']`);
      currentListOfTasks.parentNode.parentNode.children[2].children[1].children[0].classList.remove('delete-todo-active');
      if (toDoArray[i].tasks[j].completed === true) {
        completeCounter++;
      };
      if (completeCounter === toDoArray[i].tasks.length) {
        currentListOfTasks.parentNode.parentNode.children[2].children[1].children[0].classList.add('delete-todo-active');
        document.querySelector(`[data-buttonid='${toDoArray[i].iDToDo}']`).disabled = false;
      }
    }
  }
}
