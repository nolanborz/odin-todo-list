export default class TabManager {
  constructor() {
    this.tabButtons = document.querySelectorAll(".tab-btn");
    this.tabPanels = document.querySelectorAll(".tab-panel");
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    this.tabButtons.forEach((button) => {
      button.addEventListener("click", () =>
        this.switchTab(button.dataset.tab),
      );
    });
  }

  switchTab(tabId) {
    // Update button states
    this.tabButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.tab === tabId);
    });

    // Update panel visibility
    this.tabPanels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === tabId);
    });
  }
}
