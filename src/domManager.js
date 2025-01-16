export default class DOMManager {
  constructor(todoController) {
    this.todoController = todoController;
    this.projectForm = document.getElementById('new-project-form');
    this.projectsContainer = document.querySelector('.projects-container');
    this.standaloneTaskBtn = document.querySelector('.standalone-task-form button');
    this.standaloneTaskContainer = document.querySelector('.standalone-task-form');
    this.activeTaskForm = null;
  }

  initializeEventListeners() {
    // Project form handler
    this.projectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('project-title').value;
      const newProject = this.todoController.createProject(title);
      this.renderAllProjects();
      this.projectForm.reset();
    });

    // Standalone task button handler
    this.standaloneTaskBtn.addEventListener('click', () => {
      const taskForm = this.createTaskForm();
      
      // Remove any existing task form
      const existingForm = this.standaloneTaskContainer.querySelector('.task-form');
      if (existingForm) existingForm.remove();
      
      // Add new form after the button
      this.standaloneTaskBtn.insertAdjacentElement('afterend', taskForm);
    });

    // Project add task button handler (using event delegation)
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

  createTaskForm(projectIndex = null) {
    if (this.activeTaskForm) {
      this.activeTaskForm.remove();
    }

    const taskForm = document.createElement('form');
    taskForm.classList.add('task-form');
    taskForm.innerHTML = `
      <input type="text" class="task-title" placeholder="Task Title" required>
      <textarea class="task-description" placeholder="Description"></textarea>
      <input type="date" 
         class="task-due-date" 
         pattern="\d{2}/\d{2}"
         placeholder="MM/DD">
      <select class="task-priority">
        <option value="urgent">Urgent</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <div class="task-form-buttons">
        <button type="submit">Submit</button>
        <button type="button" class="cancel-task">Cancel</button>
      </div>
    `;

    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = taskForm.querySelector('.task-title').value;
      const description = taskForm.querySelector('.task-description').value;
      const dueDate = taskForm.querySelector('.task-due-date').value;
      const priority = taskForm.querySelector('.task-priority').value;
      
      if (projectIndex !== null) {
        const project = this.todoController.getProject(projectIndex);
        const newTask = this.todoController.createTodo(title, description, dueDate, priority);
        console.log('New project task:', {title, description, dueDate, priority});
        console.log('Task object:', newTask);
        project.addTodo(newTask);
        this.renderAllProjects();
      } else {
        // Add standalone task
        const newTask = this.todoController.createTodo(title, description, dueDate, priority);
        console.log('New standalone task:', {title, description, dueDate, priority});
        console.log('Task object:', newTask); 
        this.todoController.addStandaloneTask(newTask);
        this.renderStandaloneTasks();
      }
      
      taskForm.remove();
      this.activeTaskForm = null;
    });

    taskForm.querySelector('.cancel-task').addEventListener('click', () => {
      taskForm.remove();
      this.activeTaskForm = null;
    });

    this.activeTaskForm = taskForm;
    return taskForm;
  }

  renderTask(task, isProjectTask = false, projectIndex= null) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('todo-item', task.priority);
    
    // Create checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.isComplete || false;
    checkbox.classList.add('task-checkbox');
    checkbox.addEventListener('change', () => {
      task.toggleComplete();
      // You might want to save state here
    });
  
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-task-btn');
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this task?')) {
        if (isProjectTask && projectIndex !== null) {
          const project = this.todoController.getProject(projectIndex);
          project.removeTodoByTask(task);
          this.renderAllProjects();
        } else {
          const taskIndex = this.todoController.standalone_tasks.indexOf(task);
          if (taskIndex > -1) {
            this.todoController.removeStandaloneTask(taskIndex);
          }
          this.renderStandaloneTasks();
        }
      }
    });
    taskElement.appendChild(checkbox);
    
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('task-content');
    contentDiv.innerHTML = `
      <h4>${task.title}</h4>
      <p>${task.dueDate ? `${this.formatDate(task.dueDate)}` : ''}</p>
    `;
    
    taskElement.appendChild(contentDiv);
    taskElement.appendChild(deleteBtn);
    
    return taskElement;
  }

  renderStandaloneTasks() {
    const tasksContainer = document.createElement('div');
    tasksContainer.classList.add('standalone-tasks');
    
    this.todoController.getStandaloneTasks().forEach(task => {
      tasksContainer.appendChild(this.renderTask(task));
    });

    const existingContainer = this.standaloneTaskContainer.querySelector('.standalone-tasks');
    if (existingContainer) {
      existingContainer.replaceWith(tasksContainer);
    } else {
      this.standaloneTaskContainer.appendChild(tasksContainer);
    }
  }

  renderProject(project, projectIndex) {
    const projectElement = document.createElement('div');
    projectElement.classList.add('project');
    
    // Create header
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('project-header');
    
    // Create title wrapper
    const titleWrapper = document.createElement('div');
    titleWrapper.classList.add('title-wrapper');
    
    // Create title
    const title = document.createElement('h3');
    title.textContent = project.title;
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-task-btn');
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this project and all its tasks?')) {
        this.todoController.removeProject(projectIndex);
        this.renderAllProjects();
      }
    });
    
    // Create add task button
    const addTaskBtn = document.createElement('button');
    addTaskBtn.classList.add('add-task-btn');
    addTaskBtn.textContent = 'Add Task';
    addTaskBtn.type = 'button';
  
    // Create containers for form and tasks
    const formContainer = document.createElement('div');
    formContainer.classList.add('task-form-container');
    
    const todoListContainer = document.createElement('div');
    todoListContainer.classList.add('todo-list');
  
    // Build the structure
    titleWrapper.appendChild(title);
    titleWrapper.appendChild(deleteBtn);
    
    headerDiv.appendChild(titleWrapper);
    headerDiv.appendChild(addTaskBtn);
    
    projectElement.appendChild(headerDiv);
    projectElement.appendChild(formContainer);
    projectElement.appendChild(todoListContainer);
  
    // Add tasks
    project.getTodoList().forEach(todo => {
      todoListContainer.appendChild(this.renderTask(todo, true, projectIndex));
    });
  
    return projectElement;
  }

  renderAllProjects() {
    this.projectsContainer.innerHTML = '';
    this.todoController.getAllProjects().forEach((project, index) => {
      const projectElement = this.renderProject(project, index);
      this.projectsContainer.appendChild(projectElement);
    });
  }

  formatDate(date) {
    const d = new Date(date);
    const month = d.toLocaleString('default', { month: 'short' });
    const day = d.getDate();
    return `${month} ${day}`;
  }
}