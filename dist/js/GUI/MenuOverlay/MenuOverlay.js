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
import SettingsOverlay from "./SettingsOverlay";
var MenuOverlay = /*#__PURE__*/ function() {
    "use strict";
    function MenuOverlay(gameInstance, overlayElements) {
        _class_call_check(this, MenuOverlay);
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
    _create_class(MenuOverlay, [
        {
            key: "newGame",
            value: function newGame() {
                this.newGameButton.style.display = "none";
                this.resumeButton.style.display = "block";
                this.resetButton.style.display = "block";
                // hide the game menu
                this.menuOverlayElm.style.display = "none";
                this.editingOverlayElm.style.display = "flex";
                this.playingOverlayElm.style.display = "none";
                this.gameInstance.newGame();
            }
        },
        {
            key: "play",
            value: function play() {
                this.menuOverlayElm.style.display = "none";
                this.editingOverlayElm.style.display = "none";
                this.playingOverlayElm.style.display = "flex";
                this.gameInstance.play();
            }
        },
        {
            key: "edit",
            value: function edit() {
                this.menuOverlayElm.style.display = "none";
                this.editingOverlayElm.style.display = "flex";
                this.playingOverlayElm.style.display = "none";
                this.gameInstance.edit();
            }
        },
        {
            key: "openMenu",
            value: function openMenu() {
                this.menuOverlayElm.style.display = "flex";
                this.gameInstance.openMenu();
            }
        },
        {
            key: "resume",
            value: function resume() {
                var prevGameState = this.gameInstance.StateMachine.history.getLast();
                var secondToLastState = this.gameInstance.StateMachine.history.getSecondToLast();
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
        },
        {
            key: "reset",
            value: function reset() {
                this.gameInstance.reset();
                this.resume();
            }
        },
        {
            key: "openSettings",
            value: function openSettings() {
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
        },
        {
            key: "closeSettings",
            value: function closeSettings() {
                this.menuOverlayElm.style.display = "flex";
                this.editingOverlayElm.style.display = "none";
                this.playingOverlayElm.style.display = "none";
                this.keysHintOverlayElm.style.display = "flex";
                this.SettingsOverlay.overlayElm.style.display = "none";
                this.gameInstance.closeSettings();
            }
        },
        {
            key: "_setupEventListeners",
            value: function _setupEventListeners() {
                this.newGameButton.addEventListener("click", this.newGame.bind(this));
                this.resumeButton.addEventListener("click", this.resume.bind(this));
                this.resetButton.addEventListener("click", this.reset.bind(this));
                this.settingsButton.addEventListener("click", this.openSettings.bind(this));
            }
        }
    ]);
    return MenuOverlay;
}();
export { MenuOverlay as default };
