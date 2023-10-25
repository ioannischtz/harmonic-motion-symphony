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
import { baseFrequencies, findKeyByValue, mapRangeInverseToList, oscillatorTypes } from "../../utils";
var AddPendulumOverlay = /*#__PURE__*/ function() {
    "use strict";
    function AddPendulumOverlay(gameInstance, overlayElements) {
        _class_call_check(this, AddPendulumOverlay);
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
            y: parseInt(this.yCoordinateInput.value)
        };
        this.oscillatorsParams = [];
        this._populateBaseFreqOptions();
        this._populateOscTypeOptions();
        this._updateBaseFreqBasedOnWeight();
        this._setupEventListeners();
    }
    _create_class(AddPendulumOverlay, [
        {
            key: "handleAddOscillatorBtnClick",
            value: function handleAddOscillatorBtnClick() {
                var A = parseFloat(aInput.value);
                var D = parseFloat(dInput.value);
                var S = parseFloat(sInput.value);
                var R = parseFloat(rInput.value);
                var adsr = [
                    A,
                    D,
                    S,
                    R
                ];
                var oscillatorParams = {
                    type: typeSelect.value,
                    baseFrequency: parseFloat(baseFrequencySelect.value),
                    gain: parseFloat(gainInput.value),
                    adsr: adsr,
                    detune: parseInt(detuneInput.value)
                };
                // Store the oscillatorParams object in the oscillatorsParams array
                this.oscillatorsParams.push(oscillatorParams);
                // Update the oscillatorCountLabel to show the number of oscillators added
                this.oscillatorCountLabel.textContent = "Number of Oscillators: ".concat(this.oscillatorsParams.length);
            }
        },
        {
            key: "handleAddPendulumBtnClick",
            value: function handleAddPendulumBtnClick() {
                console.info("handleAddPendulumBtnClick");
                console.info(this.gameInstance);
                var weightValue = parseInt(this.weightInput.value);
                var radiusValue = parseInt(this.radiusInput.value);
                var coordXval = parseInt(this.xCoordinateInput.value);
                var coordYval = parseInt(this.yCoordinateInput.value);
                if (coordYval < this.gameInstance.originPoint.y) {
                    coordYval = this.gameInstance.originPoint.y;
                }
                this.gameInstance.addPendulum({
                    x: coordXval,
                    y: coordYval
                }, weightValue, radiusValue, this.oscillatorsParams);
                this.oscillatorsParams.length = 0;
                // Update the oscillatorCountLabel to show the number of oscillators added
                this.oscillatorCountLabel.textContent = "Number of Oscillators: ".concat(this.oscillatorsParams.length);
            }
        },
        {
            key: "_populateBaseFreqOptions",
            value: function _populateBaseFreqOptions() {
                // Dynamically populate the baseFrequencySelect options from the baseFrequencies object
                for(var note in baseFrequencies){
                    var option = document.createElement("option");
                    option.value = baseFrequencies[note];
                    option.text = note;
                    this.baseFrequencySelect.appendChild(option);
                }
            }
        },
        {
            key: "_populateOscTypeOptions",
            value: function _populateOscTypeOptions() {
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    // Dynamically populate the type options from the oscillatorTypes
                    for(var _iterator = oscillatorTypes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var oscType = _step.value;
                        var option = document.createElement("option");
                        option.value = oscillatorTypes[oscType];
                        option.text = oscType;
                        this.typeSelect.appendChild(option);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        },
        {
            key: "_setCoordsFromCanvasClick",
            value: function _setCoordsFromCanvasClick(event) {
                console.info("Canvas Clicked");
                var canvasRect = this.gameInstance.canvas.getBoundingClientRect();
                var offsetX = event.clientX - canvasRect.left;
                var offsetY = event.clientY - canvasRect.top;
                // Now you have the coordinates offsetX and offsetY
                // You can use these values to update the input fields for x and y coordinates
                // Set the input values based on the click coordinates
                xCoordinateInput.value = offsetX;
                yCoordinateInput.value = offsetY;
            }
        },
        {
            key: "_updateBaseFreqBasedOnWeight",
            value: function _updateBaseFreqBasedOnWeight() {
                var baseFreq = mapRangeInverseToList(this.weightVal, 10, 10000, Object.values(baseFrequencies));
                // const optionToSelect = findKeyByValue(baseFrequencies, baseFreq);
                var optionToSelect = baseFreq.toString();
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this.baseFrequencySelect.options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var option = _step.value;
                        if (option.value === optionToSelect) {
                            console.info("option.value === optionToSelect", option.value);
                            option.selected = true;
                            break; // Exit the loop after finding and selecting the desired option
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        },
        {
            key: "_handleWeightInputChange",
            value: function _handleWeightInputChange(event) {
                this.weightVal = event.target.valueAsNumber;
                this._updateBaseFreqBasedOnWeight();
            }
        },
        {
            key: "_setupEventListeners",
            value: function _setupEventListeners() {
                this.gameInstance.canvas.addEventListener("click", this._setCoordsFromCanvasClick.bind(this));
                this.addOscillatorButton.addEventListener("click", this.handleAddOscillatorBtnClick.bind(this));
                this.addPendulumButton.addEventListener("click", this.handleAddPendulumBtnClick.bind(this));
                this.weightInput.addEventListener("input", this._handleWeightInputChange.bind(this));
            }
        }
    ]);
    return AddPendulumOverlay;
}();
export { AddPendulumOverlay as default };
