import "./styles.css";
import TodoBase from "./todoBase.js";
import DOMManager from "./domManager.js";
import Todo from "./todo.js";
import Project from "./todoProject.js";
import TodoController from "./todoController.js";
import TabManager from "./tabManager.js";

const todoController = new TodoController();
const domManager = new DOMManager(todoController);
const tabManager = new TabManager();

domManager.initializeEventListeners();
domManager.renderAllProjects();
domManager.renderStandaloneTasks();
