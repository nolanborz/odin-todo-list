import Project from './todoProject.js';
import Todo from './todo.js';

export default class TodoController {
  constructor(name = "THE GRAND TO DO LIST") {
    this.name = name;
    this.project_array = [];
  }

  createProject(title, description, dueDate, priority) {
    const newProject = new Project(title, description, dueDate, priority);
    this.project_array.push(newProject);
    return newProject;
  }

  createTodo(title, description, dueDate, priority) {
    return new Todo(title, description, dueDate, priority);
  }
//Some useful functions I'll probably need
  removeProject(index) {
    this.project_array.splice(index, 1);
  }

  getProject(index) {
    return this.project_array[index];
  }

  getAllProjects() {
    return this.project_array;
  }

  //functions I want in this controller
  // 1. Store each project
  // 2. Store each todo
  // 3. Call all of their functions
}