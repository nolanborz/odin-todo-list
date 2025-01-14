import TodoBase from './todoBase.js';
export default class Project extends TodoBase {
  constructor(title, todoList = []) {
    super(title);
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
  getTodoList() {
    return TodoBase.orderByUrgency(this.todoList);
  }
}
