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
    checkbox.checked = task.isComplete;
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
      <p>${task.dueDate ? `Due: ${this.formatDate(task.dueDate)}` : ''}</p>
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

  renderProject(project) {
    const projectElement = document.createElement('div');
    projectElement.classList.add('project');
    
    projectElement.innerHTML = `
      <div class="project-header">
        <h3>${project.title}</h3>
        <button class="add-task-btn" type="button">Add Task</button>
      </div>
      <div class="task-form-container"></div>
      <div class="todo-list"></div>
    `;
  
    // Add tasks to the todo-list container
    const todoList = projectElement.querySelector('.todo-list');
    project.getTodoList().forEach(todo => {
      todoList.appendChild(this.renderTask(todo));
    });
  
    return projectElement;
  }

  renderAllProjects() {
    this.projectsContainer.innerHTML = '';
    this.todoController.getAllProjects().forEach(project => {
      const projectElement = this.renderProject(project);
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