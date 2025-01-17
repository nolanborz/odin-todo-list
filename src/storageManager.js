export default class StorageManager {
  static save(todoController) {
    const data = {
      standalone_tasks: todoController.standalone_tasks,
      project_array: todoController.project_array,
    };
    localStorage.setItem("todoData", JSON.stringify(data));
  }

  static load() {
    const data = localStorage.getItem("todoData");
    return data ? JSON.parse(data) : null;
  }
}
