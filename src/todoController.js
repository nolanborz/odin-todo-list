import Todo from './todo.js';
import Project from './todoProject.js';
import TodoBase from './todoBase.js';
import StorageManager from './storageManager.js';
export default class TodoController {
  constructor(name = "THE GRAND TO DO LIST") {
    this.name = name;
    this.project_array = [];
    this.standalone_tasks = [];
    this.loadSavedData();
  }

  // todoController.js
saveData() {
  const simplifiedTasks = this.standalone_tasks.map(task => ({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority,
    isComplete: task.isComplete
  }));

  const simplifiedProjects = this.project_array.map(project => ({
    title: project.title,
    todoList: project.todoList.map(task => ({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      isComplete: task.isComplete
    }))
  }));

  const data = {
    standalone_tasks: simplifiedTasks,
    project_array: simplifiedProjects
  };

  localStorage.setItem('todoData', JSON.stringify(data));
}

loadSavedData() {
  const savedData = localStorage.getItem('todoData');
  if (savedData) {
      const parsedData = JSON.parse(savedData);
      
      // Reconstruct todos with controller reference and completion state
      this.standalone_tasks = parsedData.standalone_tasks.map(taskData => {
          const todo = new Todo(taskData.title, taskData.description, taskData.dueDate, taskData.priority, this);
          todo.isComplete = taskData.isComplete || false;
          return todo;
      });

      // Reconstruct projects with their todos
      this.project_array = parsedData.project_array.map(projectData => {
          const project = new Project(projectData.title, [], this);
          project.todoList = projectData.todoList.map(taskData => {
              const todo = new Todo(taskData.title, taskData.description, taskData.dueDate, taskData.priority, this);
              todo.isComplete = taskData.isComplete || false;
              return todo;
          });
          return project;
      });
  }
}

  createProject(title) {
    const newProject = new Project(title, [], this);
    this.project_array.push(newProject);
    this.saveData();
    return newProject;
  }

  createTodo(title, description, dueDate, priority) {
    const todo = new Todo(title, description, dueDate, priority, this);
    return todo;
  }

  addStandaloneTask(task) {
    this.standalone_tasks.push(task);
    this.saveData();
  }

  getStandaloneTasks() {
    this.orderTasksByUrgency();
    return this.standalone_tasks;
  }

  removeStandaloneTask(index) {
    this.standalone_tasks.splice(index, 1);
    this.saveData();
  }

  removeProject(index) {
    this.project_array.splice(index, 1);
    this.saveData();
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