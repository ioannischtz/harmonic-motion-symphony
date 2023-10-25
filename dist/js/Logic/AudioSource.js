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
import Oscillator from "./Oscillator";
var AudioSource = /*#__PURE__*/ function() {
    "use strict";
    function AudioSource(gameCtx, oscParamsArray) {
        var _this = this;
        _class_call_check(this, AudioSource);
        this.gameCtx = gameCtx;
        this.oscParamsArray = oscParamsArray;
        this.oscillators = [];
        // this._isStopped = true;
        this.oscParamsArray.forEach(function(oscParams) {
            _this.addOscillator(oscParams);
        });
    }
    _create_class(AudioSource, [
        {
            key: "addOscillator",
            value: function addOscillator(oscParams) {
                // Create a new oscillatorNode and add it
                // to the audioSource's oscillators array
                if (this.oscillators.length > 0) {
                    oscParams.gain = oscParams.gain / (this.oscillators.length + 1);
                    this.oscillators.gain = this.oscillators.gain / (this.oscillators.length + 1);
                }
                var oscillator = new Oscillator(this.gameCtx, oscParams);
                this.oscillators.push(oscillator);
            }
        },
        {
            key: "stop",
            value: function stop() {
                var _this = this;
                if (!this._isStopped) {
                    this._isStopped = true;
                    this.oscillators.forEach(function(osc) {
                        osc.stop(_this.gameCtx.audioCtx.currentTime);
                    });
                }
            }
        },
        {
            key: "playNote",
            value: function playNote(durationInSecs) {
                var _this = this;
                console.info("AudioSource.playNote");
                console.info("AudioSource._isStopped", this._isStopped);
                this._isStopped = false;
                this.oscillators.forEach(function(osc) {
                    // !! Maybe we will need to pass a specific time,
                    // for synchronization
                    var currentTime = _this.gameCtx.audioCtx.currentTime;
                    console.info("currentTime = ", currentTime);
                    osc.playNote(currentTime, durationInSecs);
                });
            }
        }
    ]);
    return AudioSource;
}();
export { AudioSource as default };
