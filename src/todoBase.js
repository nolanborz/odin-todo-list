export default class TodoBase {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.isComplete = false;
  }
  toggleComplete() {
    this.isComplete = !this.isComplete;
    return this.isComplete;
  }
  setDueDate(newDate) {
    this.dueDate = newDate;
    return this.dueDate
  }
  changePriority(priority) {
    this.priority = priority;
    return this.priority;
  }
}