function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var PlayingOverlay = function PlayingOverlay(gameInstance, overlayElements) {
    "use strict";
    _class_call_check(this, PlayingOverlay);
    this.gameInstance = gameInstance;
    // overlay
    this.menuOverlayElm = overlayElements.menuOverlayElm;
    this.editingOverlayElm = overlayElements.editingOverlayElm;
    this.playingOverlayElm = overlayElements.playingOverlayElm;
    this.keysHintOverlayElm = overlayElements.keysHintOverlayElm;
};
export { PlayingOverlay as default };
