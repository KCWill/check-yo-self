class ToDo {
  constructor(title, iDToDo, tasks){
    this.title = title;
    this.iDToDo = iDToDo;
    this.tasks = tasks;
    this.urgency = false;
    this.completed = false;
  }
  saveToStorage() {
    var savingArray = [];
    savingArray.push(this.title);
    savingArray.push(this.idTask);
    savingArray.push(this.tasks);
    savingArray.push(this.urgency);
    savingArray.push(this.completed);
    return savingArray;
  }
  deleteFromStorage(tasks){

  }
  updateToDo(titleUp,urgencyUp){
    this.title = titleUp;
    this.title = urgencyUp;
  }
  updateTask(taskUp, textUp, completedUp){
    taskUp.text = textUp;
    taskUp.text = completedUp;
  }
}
