import "./styles.css";
import TodoBase from './todoBase.js';
import Todo from './todo.js';
import Project from './todoProject.js';

const mailPackage = new Todo("Mail Jenny's Package", "Get packing tape and send package off", "January 14th, 2025", "urgent");
console.log(mailPackage);

console.log(mailPackage.dueDate);
console.log(mailPackage.description)
