export default class KeysHintOverlay {
  constructor(gameInstance) {
    this.gameInstance = gameInstance;

    this.keysHintOverlayElm = document.getElementById("keysHintOverlay");
  }

  // Function to update the keys-hint content

  updateKeysHint() {
    const keysHint = document.getElementById("keysHint");

    const currentState = this.gameInstance.StateMachine.current;

    switch (currentState) {
      case this.gameInstance.GAME_STATES.MENU:
        keysHint.innerHTML = `
        <p><kbd>Esc</kbd> close the menu</p>
      `;
        break;
      case this.gameInstance.GAME_STATES.EDITING:
        keysHint.innerHTML = `
        <p><kbd>Esc</kbd> open the menu</p>
        <p><kbd>Space</kbd> switch to playing mode</p>
      `;
        break;
      case this.gameInstance.GAME_STATES.PLAYING:
        keysHint.innerHTML = `
        <p><kbd>Esc</kbd> open the menu</p>
        <p><kbd>Space</kbd> switch to editing mode</p>
      `;
        break;
      case this.gameInstance.GAME_STATES.SETTINGS:
        keysHint.innerHTML = `
        <p><kbd>Backspace</kbd> switch back to main menu</p>
      `;
        break;
      default:
        keysHint.innerHTML = ""; // Clear the content
        break;
    }
  }
}
