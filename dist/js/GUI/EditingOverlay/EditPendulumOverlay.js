function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var EditPendulumOverlay = function EditPendulumOverlay(gameInstance, overlayElements) {
    "use strict";
    _class_call_check(this, EditPendulumOverlay);
    this.gameInstance = gameInstance;
    // overlay
    this.menuOverlayElm = overlayElements.menuOverlayElm;
    this.editingOverlayElm = overlayElements.editingOverlayElm;
    this.playingOverlayElm = overlayElements.playingOverlayElm;
    this.keysHintOverlayElm = overlayElements.keysHintOverlayElm;
};
export { EditPendulumOverlay as default };
