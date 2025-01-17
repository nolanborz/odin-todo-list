export default class TodoBase {
  constructor(title, description, dueDate, priority, controller) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.isComplete = false;
    this.controller = controller;
  }

  static orderByUrgency(tasks) {
    const priorityOrder = {
      urgent: 0,
      high: 1,
      medium: 2,
      low: 3,
    };

    return tasks.sort((a, b) => {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  toggleComplete() {
    this.isComplete = !this.isComplete;
    if (this.controller) {
      this.controller.saveData();
    }
    return this.isComplete;
  }
  setDueDate(newDate) {
    this.dueDate = newDate;
    return this.dueDate;
  }
  changePriority(priority) {
    this.priority = priority;
    return this.priority;
  }
}
