import TodoBase from "./todoBase.js";

export default class Project extends TodoBase {
  constructor(title, todoList = [], controller = null) {
    super(title);
    this.todoList = todoList;
    this.controller = controller;
  }

  addTodo(task) {
    this.todoList.push(task);
    if (this.controller) {
      this.controller.saveData();
    }
  }

  removeTodoByTask(task) {
    const index = this.todoList.indexOf(task);
    if (index > -1) {
      this.todoList.splice(index, 1);
      if (this.controller) {
        this.controller.saveData();
      }
    }
  }
  getTodoList() {
    return TodoBase.orderByUrgency(this.todoList);
  }
}
