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
var SettingsOverlay = /*#__PURE__*/ function() {
    "use strict";
    function SettingsOverlay(gameInstance) {
        _class_call_check(this, SettingsOverlay);
        this.gameInstance = gameInstance;
        this.overlayElm = document.getElementById("settingsOverlay");
        this.fpsCapInput = document.getElementById("fpsCap");
        this.gAccelInput = document.getElementById("gAcceleration");
        this.dampingInput = document.getElementById("damping");
        this.applySettingsButton = document.getElementById("apply-settings-button");
        this.resetSettingsButton = document.getElementById("reset-settings-button");
        this.fpsCap = parseInt(this.fpsCapInput.value);
        this.gAccel = parseFloat(this.gAccelInput.value);
        this.dampingCoeff = parseFloat(this.dampingInput.value);
        this._setupEventListeners();
    }
    _create_class(SettingsOverlay, [
        {
            key: "handleApplySettingsBtnClick",
            value: function handleApplySettingsBtnClick() {
                console.info("Apply Settings CLicked");
                this.updateValues();
            }
        },
        {
            key: "handleResetSettingsBtnClick",
            value: function handleResetSettingsBtnClick() {
                console.info("Reset Settings CLicked");
                this.resetValues();
                this.updateValues();
            }
        },
        {
            key: "_setupEventListeners",
            value: function _setupEventListeners() {
                this.applySettingsButton.addEventListener("click", this.handleApplySettingsBtnClick.bind(this));
                this.resetSettingsButton.addEventListener("click", this.handleResetSettingsBtnClick.bind(this));
            }
        },
        {
            key: "updateValues",
            value: function updateValues() {
                this.fpsCap = parseInt(this.fpsCapInput.value);
                this.gAccel = parseInt(this.gAccelInput.value);
                this.dampingCoeff = parseInt(this.dampingInput.value);
                this.gameInstance.fpsCap = this.fpsCap;
                this.gameInstance.simCoeffs = {
                    gAccel: this.gAccel,
                    dampingCoeff: this.dampingCoeff
                };
                // Since the physics simulation rely on a fixed time step, we need to reset
                this.gameInstance.reset();
            }
        },
        {
            key: "resetValues",
            value: function resetValues() {
                this.fpsCap = 60;
                this.gAccel = 0.00015;
                this.dampingCoeff = 0.00005;
                this.fpsCapInput.value = this.fpsCap;
                this.gAccelInput.value = this.gAccel;
                this.dampingInput.value = this.dampingCoeff;
            }
        }
    ]);
    return SettingsOverlay;
}();
export { SettingsOverlay as default };
