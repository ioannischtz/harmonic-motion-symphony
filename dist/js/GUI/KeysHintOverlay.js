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
var KeysHintOverlay = /*#__PURE__*/ function() {
    "use strict";
    function KeysHintOverlay(gameInstance) {
        _class_call_check(this, KeysHintOverlay);
        this.gameInstance = gameInstance;
        this.keysHintOverlayElm = document.getElementById("keysHintOverlay");
    }
    _create_class(KeysHintOverlay, [
        {
            // Function to update the keys-hint content
            key: "updateKeysHint",
            value: function updateKeysHint() {
                var keysHint = document.getElementById("keysHint");
                var currentState = this.gameInstance.StateMachine.current;
                switch(currentState){
                    case this.gameInstance.GAME_STATES.MENU:
                        keysHint.innerHTML = "\n        <p><kbd>Esc</kbd> close the menu</p>\n      ";
                        break;
                    case this.gameInstance.GAME_STATES.EDITING:
                        keysHint.innerHTML = "\n        <p><kbd>Esc</kbd> open the menu</p>\n        <p><kbd>Space</kbd> switch to playing mode</p>\n      ";
                        break;
                    case this.gameInstance.GAME_STATES.PLAYING:
                        keysHint.innerHTML = "\n        <p><kbd>Esc</kbd> open the menu</p>\n        <p><kbd>Space</kbd> switch to editing mode</p>\n      ";
                        break;
                    case this.gameInstance.GAME_STATES.SETTINGS:
                        keysHint.innerHTML = "\n        <p><kbd>Backspace</kbd> switch back to main menu</p>\n      ";
                        break;
                    default:
                        keysHint.innerHTML = ""; // Clear the content
                        break;
                }
            }
        }
    ]);
    return KeysHintOverlay;
}();
export { KeysHintOverlay as default };
