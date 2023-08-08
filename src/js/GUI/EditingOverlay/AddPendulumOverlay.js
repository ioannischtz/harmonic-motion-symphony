import { baseFrequencies, oscillatorTypes } from "../../utils";

export default class AddPendulumOverlay {
  constructor(gameInstance, overlayElements) {
    this.gameInstance = gameInstance;
    // overlay
    this.menuOverlayElm = overlayElements.menuOverlayElm;
    this.editingOverlayElm = overlayElements.editingOverlayElm;
    this.playingOverlayElm = overlayElements.playingOverlayElm;
    this.keysHintOverlayElm = overlayElements.keysHintOverlayElm;

    // add pendulum gui
    this.weightInput = document.getElementById("weightInput");
    this.radiusInput = document.getElementById("radiusInput");
    this.xCoordinateInput = document.getElementById("xCoordinateInput");
    this.yCoordinateInput = document.getElementById("yCoordinateInput");
    // audioSource gui
    this.audioSourceGui = document.getElementById("audioSourceGui");
    this.typeSelect = document.getElementById("typeSelect");
    this.baseFrequencySelect = document.getElementById("baseFrequencySelect");
    this.gainInput = document.getElementById("gainInput");
    this.aInput = document.getElementById("aInput");
    this.dInput = document.getElementById("dInput");
    this.sInput = document.getElementById("sInput");
    this.rInput = document.getElementById("rInput");
    this.detuneInput = document.getElementById("detuneInput");
    this.addOscillatorButton = document.getElementById("addOscillatorButton");
    this.oscillatorCountLabel = document.getElementById("oscillatorCountLabel");

    this.addPendulumButton = document.getElementById("add-pendulum-button");

    // input values
    this.weightVal = parseInt(this.weightInput.value);
    this.radiusVal = parseInt(this.radiusInput.value);
    this.coords = {
      x: parseInt(this.xCoordinateInput.value),
      y: parseInt(this.yCoordinateInput.value),
    };
    this.oscillatorsParams = [];

    this._populateBaseFreqOptions();
    this._populateOscTypeOptions();
    this._setupEventListeners();
  }

  handleAddOscillatorBtnClick() {
    const A = parseFloat(aInput.value);
    const D = parseFloat(dInput.value);
    const S = parseFloat(sInput.value);
    const R = parseFloat(rInput.value);
    const adsr = [A, D, S, R];
    const oscillatorParams = {
      type: typeSelect.value,
      baseFrequency: parseFloat(baseFrequencySelect.value),
      gain: parseFloat(gainInput.value),
      adsr,
      detune: parseInt(detuneInput.value),
    };

    // Store the oscillatorParams object in the oscillatorsParams array
    this.oscillatorsParams.push(oscillatorParams);

    // Update the oscillatorCountLabel to show the number of oscillators added
    this.oscillatorCountLabel.textContent =
      `Number of Oscillators: ${this.oscillatorsParams.length}`;
  }

  handleAddPendulumBtnClick() {
    console.info("handleAddPendulumBtnClick");
    console.info(this.gameInstance);
    const weightValue = parseInt(this.weightInput.value);
    const radiusValue = parseInt(this.radiusInput.value);
    const coordXval = parseInt(this.xCoordinateInput.value);
    const coordYval = parseInt(this.yCoordinateInput.value);
    this.gameInstance.addPendulum(
      { x: coordXval, y: coordYval },
      weightValue,
      radiusValue,
      this.oscillatorsParams,
    );
    this.oscillatorsParams.length = 0;
    // Update the oscillatorCountLabel to show the number of oscillators added
    this.oscillatorCountLabel.textContent =
      `Number of Oscillators: ${this.oscillatorsParams.length}`;
  }

  _populateBaseFreqOptions() {
    // Dynamically populate the baseFrequencySelect options from the baseFrequencies object
    for (const note in baseFrequencies) {
      const option = document.createElement("option");
      option.value = baseFrequencies[note];
      option.text = note;
      this.baseFrequencySelect.appendChild(option);
    }
  }

  _populateOscTypeOptions() {
    // Dynamically populate the type options from the oscillatorTypes
    for (const oscType of oscillatorTypes) {
      const option = document.createElement("option");
      option.value = oscillatorTypes[oscType];
      option.text = oscType;
      this.typeSelect.appendChild(option);
    }
  }

  _setCoordsFromCanvasClick(event) {
    console.info("Canvas Clicked");
    const canvasRect = this.gameInstance.canvas.getBoundingClientRect();
    const offsetX = event.clientX - canvasRect.left;
    const offsetY = event.clientY - canvasRect.top;

    // Now you have the coordinates offsetX and offsetY
    // You can use these values to update the input fields for x and y coordinates

    // Set the input values based on the click coordinates
    xCoordinateInput.value = offsetX;
    yCoordinateInput.value = offsetY;
  }

  _setupEventListeners() {
    console.info(this);
    this.gameInstance.canvas.addEventListener(
      "click",
      this._setCoordsFromCanvasClick.bind(this),
    );
    this.addOscillatorButton.addEventListener(
      "click",
      this.handleAddOscillatorBtnClick.bind(this),
    );
    this.addPendulumButton.addEventListener(
      "click",
      this.handleAddPendulumBtnClick.bind(this),
    );
  }
}
