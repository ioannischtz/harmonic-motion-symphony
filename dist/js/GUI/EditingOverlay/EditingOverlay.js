function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
import AddPendulumOverlay from "./AddPendulumOverlay";
import EditPendulumOverlay from "./EditPendulumOverlay";
var EditingOverlay = /*#__PURE__*/ function() {
    "use strict";
    function EditingOverlay(gameInstance, overlayElements) {
        _class_call_check(this, EditingOverlay);
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
        this.AddPendulumOverlay = new AddPendulumOverlay(this.gameInstance, overlayElements);
        // EditPendulumOverlay object
        this.EditPendulumOverlay = new EditPendulumOverlay(this.gameInstance, overlayElements);
        this._setupEventHandlers();
    }
    _create_class(EditingOverlay, [
        {
            key: "_setupEventHandlers",
            value: function _setupEventHandlers() {
                var _this = this;
                this.tabButtons.forEach(function(button) {
                    button.addEventListener("click", (function() {
                        _this.handleTabClick(button);
                    }).bind(_this));
                });
            }
        },
        {
            key: "handleTabClick",
            value: function handleTabClick(button) {
                var tabName = button.dataset.tab;
                this.tabButtons.forEach(function(btn) {
                    return btn.classList.remove("active");
                });
                this.tabContents.forEach(function(content) {
                    return content.classList.remove("active");
                });
                button.classList.add("active");
                document.getElementById(tabName).classList.add("active");
            }
        }
    ]);
    return EditingOverlay;
}();
export { EditingOverlay as default };
