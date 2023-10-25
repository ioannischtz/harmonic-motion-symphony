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
import EditingOverlay from "./EditingOverlay/EditingOverlay";
import KeysHintOverlay from "./KeysHintOverlay";
import MenuOverlay from "./MenuOverlay/MenuOverlay";
import PlayingOverlay from "./PlayingOverlay/PlayingOverlay";
var GUI = /*#__PURE__*/ function() {
    "use strict";
    function GUI(gameInstance) {
        var canvasParams = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
            canvasId: canvasId,
            width: window.innerWidth - 32,
            height: window.innerHeight - 32
        };
        _class_call_check(this, GUI);
        this.gameInstance = gameInstance;
        this.canvasParams = canvasParams;
        // overlays
        //
        this.overlayElms = {
            menuOverlayElm: document.getElementById("menuOverlay"),
            editingOverlayElm: document.getElementById("editingOverlay"),
            playingOverlayElm: document.getElementById("playingOverlay"),
            keysHintOverlayElm: document.getElementById("keysHintOverlay")
        };
        this.overlayElms.menuOverlayElm.style.display = "flex";
        this.overlayElms.editingOverlayElm.style.display = "none";
        this.overlayElms.playingOverlayElm.style.display = "none";
        this.overlayElms.keysHintOverlayElm.style.display = "flex";
        this.MenuOverlay = new MenuOverlay(this.gameInstance, this.overlayElms);
        this.KeysHintOverlay = new KeysHintOverlay(this.gameInstance);
        this.PlayingOVerlay = new PlayingOverlay(this.gameInstance, this.overlayElms);
        this.EditingOverlay = new EditingOverlay(this.gameInstance, this.overlayElms);
        var fpsCap = this.MenuOverlay.SettingsOverlay.fspCap;
        var simCoeffs = {
            gAccel: this.MenuOverlay.SettingsOverlay.gAccel,
            dampingCoeff: this.MenuOverlay.SettingsOverlay.dampingCoeff
        };
        // set fpsCap and simCoeffs
        this.gameInstance.fpsCap = fpsCap;
        this.gameInstance.simCoeffs = simCoeffs;
        // Initial update to set the keys-hint
        this.KeysHintOverlay.updateKeysHint();
        this._setupEventListeners();
    }
    _create_class(GUI, [
        {
            key: "handleKeyPress",
            value: function handleKeyPress(event) {
                var curr = this.gameInstance.StateMachine.current;
                // const lastIndex = this.gameInstance.StateMachine.history.size - 1;
                // const prev = this.gameInstance.StateMachine.history.buffer[lastIndex];
                switch(event.key){
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
                        break;
                }
            }
        },
        {
            key: "_setupEventListeners",
            value: function _setupEventListeners() {
                var _this = this;
                document.addEventListener("keydown", this.handleKeyPress.bind(this));
                this.gameInstance.eventEmitter.on("gameStateChange", function(stateObj) {
                    console.info("gameStateChange: StateObj:", stateObj);
                    _this.KeysHintOverlay.updateKeysHint();
                });
            }
        }
    ]);
    return GUI;
}();
export { GUI as default };
