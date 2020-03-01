var addTaskButton = document.querySelector('.add-task-button').addEventListener('click', addTaskInAside);
var taskItemInput = document.getElementById('task-item-input');

function addTaskInAside(){
  document.querySelector('.draft-tasks').innerHTML += `<li>${taskItemInput.value}</li>`;
  taskItemInput.value = '';
}
