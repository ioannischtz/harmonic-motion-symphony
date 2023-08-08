import EditingOverlay from "./EditingOverlay/EditingOverlay";
import KeysHintOverlay from "./KeysHintOverlay";
import MenuOverlay from "./MenuOverlay/MenuOverlay";
import PlayingOverlay from "./PlayingOverlay/PlayingOverlay";

export default class GUI {
  constructor(
    gameInstance,
    canvasParams = {
      canvasId,
      width: window.innerWidth - 32,
      height: window.innerHeight - 32,
    },
  ) {
    this.gameInstance = gameInstance;
    this.canvasParams = canvasParams;

    // overlays
    //
    this.overlayElms = {
      menuOverlayElm: document.getElementById("menuOverlay"),
      editingOverlayElm: document.getElementById("editingOverlay"),
      playingOverlayElm: document.getElementById("playingOverlay"),
      keysHintOverlayElm: document.getElementById("keysHintOverlay"),
    };

    this.overlayElms.menuOverlayElm.style.display = "flex";
    this.overlayElms.editingOverlayElm.style.display = "none";
    this.overlayElms.playingOverlayElm.style.display = "none";
    this.overlayElms.keysHintOverlayElm.style.display = "flex";

    this.MenuOverlay = new MenuOverlay(this.gameInstance, this.overlayElms);
    this.KeysHintOverlay = new KeysHintOverlay(this.gameInstance);
    this.PlayingOVerlay = new PlayingOverlay(
      this.gameInstance,
      this.overlayElms,
    );
    this.EditingOverlay = new EditingOverlay(
      this.gameInstance,
      this.overlayElms,
    );

    const fpsCap = this.MenuOverlay.SettingsOverlay.fspCap;
    const simCoeffs = {
      gAccel: this.MenuOverlay.SettingsOverlay.gAccel,
      dampingCoeff: this.MenuOverlay.SettingsOverlay.dampingCoeff,
    };

    // set fpsCap and simCoeffs
    this.gameInstance.fpsCap = fpsCap;
    this.gameInstance.simCoeffs = simCoeffs;

    // Initial update to set the keys-hint
    this.KeysHintOverlay.updateKeysHint();

    this._setupEventListeners();
  }

  handleKeyPress(event) {
    const curr = this.gameInstance.StateMachine.current;
    // const lastIndex = this.gameInstance.StateMachine.history.size - 1;
    // const prev = this.gameInstance.StateMachine.history.buffer[lastIndex];
    switch (event.key) {
      case "Escape":
      case "Esc":
        // If the game just loaded, pressing `ESC` shouldn't have any effect
        if (this.gameInstance.StateMachine.history.size === 0) return;
        // If state = settings only `Backspace` should have an effect
        if (curr === this.gameInstance.GAME_STATES.SETTINGS) return;

        // Pressing `ESC` key will toggle the menu overlay
        if (curr === this.gameInstance.GAME_STATES.MENU) {
          this.MenuOverlay.resume();
        } else {
          this.MenuOverlay.openMenu();
        }
        break;
      case " ":
        // If state = settings only `Backspace` should have an effect
        if (curr === this.gameInstance.GAME_STATES.SETTINGS) return;
        // Pressing `SPACE` key will toggle between editing and playing mode
        if (curr === this.gameInstance.GAME_STATES.EDITING) {
          this.overlayElms.playingOverlayElm.style.display = "flex";
          this.overlayElms.editingOverlayElm.style.display = "none";
          this.gameInstance.play();
        } else if (curr === this.gameInstance.GAME_STATES.PLAYING) {
          this.overlayElms.playingOverlayElm.style.display = "none";
          this.overlayElms.editingOverlayElm.style.display = "flex";
          this.gameInstance.edit();
        }
        break;
      case "Backspace":
        if (curr === this.gameInstance.GAME_STATES.SETTINGS) {
          this.MenuOverlay.closeSettings();
        }
        break;
      default:
        // If the game is in MENU or SETTINGS state, pressing SPACE shouldn't have any effect.
        break;
    }
  }

  _setupEventListeners() {
    document.addEventListener("keydown", this.handleKeyPress.bind(this));

    this.gameInstance.eventEmitter.on("gameStateChange", (stateObj) => {
      console.info("gameStateChange: StateObj:", stateObj);
      this.KeysHintOverlay.updateKeysHint();
    });
  }
}
