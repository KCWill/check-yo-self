class Task {
  constructor(text, taskNumber, completed) {
    this.text = text;
    this.taskNumber = taskNumber;
    this.completed = completed || false;
  }
  toggleCompleted(){
    this.completed = !this.completed;
  }
}
