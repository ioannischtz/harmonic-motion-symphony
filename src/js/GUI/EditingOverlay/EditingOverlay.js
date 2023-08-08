import AddPendulumOverlay from "./AddPendulumOverlay";
import EditPendulumOverlay from "./EditPendulumOverlay";

export default class EditingOverlay {
  constructor(gameInstance, overlayElements) {
    this.gameInstance = gameInstance;
    // overlay
    this.menuOverlayElm = overlayElements.menuOverlayElm;
    this.editingOverlayElm = overlayElements.editingOverlayElm;
    this.playingOverlayElm = overlayElements.playingOverlayElm;
    this.keysHintOverlayElm = overlayElements.keysHintOverlayElm;

    // tab menu
    this.tabButtons = document.querySelectorAll(".tab-button");
    this.tabContents = document.querySelectorAll(".tab-content");
    // AddPendulumOverlay object
    this.AddPendulumOverlay = new AddPendulumOverlay(
      this.gameInstance,
      overlayElements,
    );
    // EditPendulumOverlay object
    this.EditPendulumOverlay = new EditPendulumOverlay(
      this.gameInstance,
      overlayElements,
    );

    this._setupEventHandlers();
  }

  _setupEventHandlers() {
    this.tabButtons.forEach((button) => {
      button.addEventListener(
        "click",
        (() => {
          this.handleTabClick(button);
        }).bind(this),
      );
    });
  }

  handleTabClick(button) {
    const tabName = button.dataset.tab;

    this.tabButtons.forEach((btn) => btn.classList.remove("active"));
    this.tabContents.forEach((content) => content.classList.remove("active"));

    button.classList.add("active");
    document.getElementById(tabName).classList.add("active");
  }
}
