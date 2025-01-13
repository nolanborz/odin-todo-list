export default class DOMManager {
  constructor(todoController) {
    this.todoController = todoController;
    this.projectsContainer = document.querySelector('.projects-container');
  }

  displayProject(project) {
    return `
      <div class="project-card" data-project-id="${project.id}">
        <div class="project-header">
          <h2>${project.title}</h2>
          <span class="priority-badge" ${project.priority.toLowerCase()}">${project.priority}</span>
        </div>
        <p>${project.description}</p>
        <p>Due: ${project.dueDate}</p>

        <div class="todo-list">
          ${project.todoList.map(todo => this.displayTodo(todo)).join('')}
        </div>
        <button class="add-todo-btn">AddTask</button>
      </div>
    `;
  }

  displayTodo(todo) {
    return `
      <div class="todo-item">
      <input type="checkbox" ${todo.isComplete ? 'checked' : ''}>
      <h4>${todo.title}</h4>
      <p>${todo.description}</p>
      <span>Due: ${todo.dueDate}</span>
      <span clsas="priority">${todo.priority}</span>
      <button class="delete-todo">Delete</button>
    </div>
    `;
  }

  renderAllProjects() {
    const projects = this.todoController.getAllProjects();
    this.projectsContainer.innerHTML = projects.map(project =>
      this.displayProject(project)
    ).join('');
  }

  initializeEventListeners() {
    const projectForm = document.querySelector('#new-project-form');
    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      //handle new project creation
    });

    this.projectContainer.addEventListener('click', (e) => {
      if (e.target.matches('.delete-todo')) {
        //handle todo deletion
      }
      if (e.target.matches('.add-todo-btn')) {
        //handle adding new todo
      }
    })
  }
}