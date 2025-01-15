import Todo from './todo.js';
import Project from './todoProject.js';
import TodoBase from './todoBase.js';
export default class TodoController {
  constructor(name = "THE GRAND TO DO LIST") {
    this.name = name;
    this.project_array = [];
    this.standalone_tasks = [];
  }

  createProject(title) {
    const newProject = new Project(title);
    this.project_array.push(newProject);
    return newProject;
  }

  createTodo(title, description, dueDate, priority) {
    return new Todo(title, description, dueDate, priority);
  }

  addStandaloneTask(task) {
    this.standalone_tasks.push(task);
  }

  getStandaloneTasks() {
    this.orderTasksByUrgency();
    return this.standalone_tasks;
  }

  removeStandaloneTask(index) {
    this.standalone_tasks.splice(index, 1);
  }

  removeProject(index) {
    this.project_array.splice(index, 1);
  }

  getProject(index) {
    return this.project_array[index];
  }

  getAllProjects() {
    return this.project_array;
  }
  orderTasksByUrgency() {
    return TodoBase.orderByUrgency(this.standalone_tasks);
  }
}