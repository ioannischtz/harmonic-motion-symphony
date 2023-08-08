import SettingsOverlay from "./SettingsOverlay";

export default class MenuOverlay {
  constructor(gameInstance, overlayElements) {
    this.gameInstance = gameInstance;

    // overlay
    this.menuOverlayElm = overlayElements.menuOverlayElm;
    this.editingOverlayElm = overlayElements.editingOverlayElm;
    this.playingOverlayElm = overlayElements.playingOverlayElm;
    this.keysHintOverlayElm = overlayElements.keysHintOverlayElm;

    // menu buttons
    this.newGameButton = document.getElementById("new-game-button");
    this.resumeButton = document.getElementById("resume-button");
    this.resetButton = document.getElementById("reset-button");
    this.settingsButton = document.getElementById("settings-button");

    // SettingsOverlay Object
    this.SettingsOverlay = new SettingsOverlay(this.gameInstance);
    this.SettingsOverlay.overlayElm.style.display = "none";

    this.resumeButton.style.display = "none";
    this.resetButton.style.display = "none";
    this._setupEventListeners();
  }

  newGame() {
    this.newGameButton.style.display = "none";
    this.resumeButton.style.display = "block";
    this.resetButton.style.display = "block";

    // hide the game menu
    this.menuOverlayElm.style.display = "none";
    this.editingOverlayElm.style.display = "flex";
    this.playingOverlayElm.style.display = "none";

    this.gameInstance.newGame();
  }

  play() {
    this.menuOverlayElm.style.display = "none";
    this.editingOverlayElm.style.display = "none";
    this.playingOverlayElm.style.display = "flex";

    this.gameInstance.play();
  }

  edit() {
    this.menuOverlayElm.style.display = "none";
    this.editingOverlayElm.style.display = "flex";
    this.playingOverlayElm.style.display = "none";

    this.gameInstance.edit();
  }

  openMenu() {
    this.menuOverlayElm.style.display = "flex";

    this.gameInstance.openMenu();
  }

  resume() {
    let prevGameState = this.gameInstance.StateMachine.history.getLast();

    const secondToLastState = this.gameInstance.StateMachine.history
      .getSecondToLast();

    console.info("resume(): historyLast", prevGameState);
    console.info("resume(): history2ndToLast", secondToLastState);

    if (prevGameState === this.gameInstance.GAME_STATES.SETTINGS) {
      prevGameState = secondToLastState;
    }
    if (prevGameState === this.gameInstance.GAME_STATES.PLAYING) {
      this.play();
    } else if (prevGameState === this.gameInstance.GAME_STATES.EDITING) {
      this.edit();
    }
  }

  reset() {
    this.gameInstance.reset();
    this.resume();
  }

  openSettings() {
    console.group("MenuOverlay");
    console.info("openSettings called");
    console.groupEnd();

    this.menuOverlayElm.style.display = "none";
    this.editingOverlayElm.style.display = "none";
    this.playingOverlayElm.style.display = "none";
    this.keysHintOverlayElm.style.display = "flex";
    this.SettingsOverlay.overlayElm.style.display = "flex";

    this.gameInstance.openSettings();
  }

  closeSettings() {
    this.menuOverlayElm.style.display = "flex";
    this.editingOverlayElm.style.display = "none";
    this.playingOverlayElm.style.display = "none";
    this.keysHintOverlayElm.style.display = "flex";
    this.SettingsOverlay.overlayElm.style.display = "none";

    this.gameInstance.closeSettings();
  }

  _setupEventListeners() {
    this.newGameButton.addEventListener("click", this.newGame.bind(this));

    this.resumeButton.addEventListener("click", this.resume.bind(this));

    this.resetButton.addEventListener("click", this.reset.bind(this));

    this.settingsButton.addEventListener("click", this.openSettings.bind(this));
  }
}
