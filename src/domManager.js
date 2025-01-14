export default class DOMManager {
  constructor(todoController) {
    this.todoController = todoController;
    this.projectForm = document.getElementById('new-project-form');
    this.projectsContainer = document.querySelector('.projects-container');
    this.activeTaskForm = null;
  }

  initializeEventListeners() {
    this.projectForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('project-title').value;
      const description = document.getElementById('project-description').value;
      const dueDate = document.getElementById('project-due-date').value;
      const priority = document.getElementById('project-priority').value;

      const newProject = this.todoController.createProject(title, description, dueDate, priority);
      this.renderAllProjects(); // Render all projects instead of just the new one
      this.projectForm.reset();
    });

    // Add event delegation for project container
    this.projectsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-task-btn')) {
        const projectElement = e.target.closest('.project');
        const projectIndex = Array.from(this.projectsContainer.children).indexOf(projectElement);
        
        const taskFormContainer = projectElement.querySelector('.task-form-container');
        const taskForm = this.createTaskForm(projectIndex);
        taskFormContainer.innerHTML = '';
        taskFormContainer.appendChild(taskForm);
      }
    });
  }

  createTaskForm(projectIndex) {
    if (this.activeTaskForm) {
      this.activeTaskForm.remove();
    }

    const taskForm = document.createElement('form');
    taskForm.classList.add('task-form');
    taskForm.innerHTML = `
      <h3>Add New Task</h3>
      <input type="text" class="task-title" placeholder="Task Title" required>
      <textarea class="task-description" placeholder="Description"></textarea>
      <input type="date" class="task-due-date">
      <select class="task-priority">
        <option value="urgent">Urgent</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <div class="task-form-buttons">
        <button type="submit">Add Task</button>
        <button type="button" class="cancel-task">Cancel</button>
      </div>
    `;

    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const project = this.todoController.getProject(projectIndex);

      const title = taskForm.querySelector('.task-title').value;
      const description = taskForm.querySelector('.task-description').value;
      const dueDate = taskForm.querySelector('.task-due-date').value;
      const priority = taskForm.querySelector('.task-priority').value;
      
      const newTask = this.todoController.createTodo(title, description, dueDate, priority);
      project.addTodo(newTask);
      
      this.renderAllProjects();
      this.activeTaskForm = null;
    });

    taskForm.querySelector('.cancel-task').addEventListener('click', () => {
      taskForm.remove();
      this.activeTaskForm = null;
    });

    this.activeTaskForm = taskForm;
    return taskForm;
  }

  renderProject(project) {
    const projectElement = document.createElement('div');
    projectElement.classList.add('project');
    
    projectElement.innerHTML = `
      <div class="project-header">
        <h3>${project.title}</h3>
        <button class="add-task-btn" type="button">Add Task</button>
      </div>
      <p>${project.description}</p>
      <p>Due: ${project.dueDate}</p>
      <p>Priority: ${project.priority}</p>
      <div class="task-form-container"></div>
      <div class="todo-list">
        ${project.todoList.map(todo => `
          <div class="todo-item">
            <h4>${todo.title}</h4>
            <p>${todo.description}</p>
            <p>Due: ${todo.dueDate}</p>
            <p>Priority: ${todo.priority}</p>
          </div>
        `).join('')}
      </div>
    `;
    
    return projectElement;
  }

  renderAllProjects() {
    this.projectsContainer.innerHTML = '';
    this.todoController.getAllProjects().forEach(project => {
      const projectElement = this.renderProject(project);
      this.projectsContainer.appendChild(projectElement);
    });
  }
}