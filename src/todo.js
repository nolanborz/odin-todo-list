import TodoBase from "./todoBase.js";

export default class Todo extends TodoBase {
  constructor(title, description, dueDate, priority, controller) {
    super(title, description, dueDate, priority, controller);
  }
}
