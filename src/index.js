import "./styles.css";
import TodoBase from './todoBase.js';
import Todo from './todo.js';
import Project from './todoProject.js';
import TodoController from './todoController.js';



const mailPackage = new Todo("Mail Jenny's Package", "Get packing tape and send package off", "January 14th, 2025", "urgent");
const birthdayParty = new Project("Bob's Party", "Bob's 31st birthday", "January 14th, 2014", "High");
console.log(birthdayParty.description);
birthdayParty.addTodo(mailPackage);
console.log(birthdayParty.todoList[0].description);
console.log(new Date(8.64e15).toString());