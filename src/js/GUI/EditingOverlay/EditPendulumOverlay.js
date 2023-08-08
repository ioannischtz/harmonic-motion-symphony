export default class EditPendulumOverlay {
  constructor(gameInstance, overlayElements) {
    this.gameInstance = gameInstance;

    // overlay
    this.menuOverlayElm = overlayElements.menuOverlayElm;
    this.editingOverlayElm = overlayElements.editingOverlayElm;
    this.playingOverlayElm = overlayElements.playingOverlayElm;
    this.keysHintOverlayElm = overlayElements.keysHintOverlayElm;
  }
}
