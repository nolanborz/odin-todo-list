import TodoBase from './todoBase.js';
export default class Project extends TodoBase {
  constructor(title, description, dueDate, priority, todoList = []) {
    super(title, description, dueDate, priority);
    this.todoList = todoList;
  }

  addTodo(task) {
    this.todoList.push(task);
  }

  removeTodoByTask(task) {
    const index = this.todoList.indexOf(task);
    if (index > -1) {
      this.todoList.splice(index, 1);
    }
  }
}
