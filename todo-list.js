class ToDo {
  constructor(title, iDToDo, tasks, urgency, completed) {
    this.title = title;
    this.iDToDo = iDToDo;
    this.tasks = tasks;
    this.urgency = urgency || false;
    this.completed = completed || false;
  }

  toggleCompleted() {
    this.completed = !this.completed;
  }

  toggleUrgent() {
    this.urgency = !this.urgency;
  }
}
