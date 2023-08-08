export default class SettingsOverlay {
  constructor(gameInstance) {
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

  handleApplySettingsBtnClick() {
    console.info("Apply Settings CLicked");
    this.updateValues();
  }

  handleResetSettingsBtnClick() {
    console.info("Reset Settings CLicked");
    this.resetValues();
    this.updateValues();
  }

  _setupEventListeners() {
    this.applySettingsButton.addEventListener(
      "click",
      this.handleApplySettingsBtnClick.bind(this),
    );
    this.resetSettingsButton.addEventListener(
      "click",
      this.handleResetSettingsBtnClick.bind(this),
    );
  }

  updateValues() {
    this.fpsCap = parseInt(this.fpsCapInput.value);
    this.gAccel = parseInt(this.gAccelInput.value);
    this.dampingCoeff = parseInt(this.dampingInput.value);

    this.gameInstance.fpsCap = this.fpsCap;
    this.gameInstance.simCoeffs = {
      gAccel: this.gAccel,
      dampingCoeff: this.dampingCoeff,
    };
  }

  resetValues() {
    this.fpsCap = 60;
    this.gAccel = 0.00015;
    this.dampingCoeff = 0.00005;

    this.fpsCapInput.value = this.fpsCap;
    this.gAccelInput.value = this.gAccel;
    this.dampingInput.value = this.dampingCoeff;
  }
}
