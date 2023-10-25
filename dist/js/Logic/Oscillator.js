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
var Oscillator = /*#__PURE__*/ function() {
    "use strict";
    function Oscillator(gameCtx, params) {
        _class_call_check(this, Oscillator);
        this.gameCtx = gameCtx;
        this.type = params.type;
        this.baseFreq = params.baseFreq;
        this.gainValue = params.gain;
        this.A = params.adsr[0];
        this.D = params.adsr[1];
        this.S = params.adsr[2];
        this.R = params.adsr[3];
        this.detune = params.detune;
        this.oscillatorNode = null;
        this.gainNode = null;
        this._isStopped = true;
    }
    _create_class(Oscillator, [
        {
            key: "stop",
            value: function stop(currentTime) {
                var _this = this;
                if (!this._isStopped) {
                    this._isStopped = true;
                    // Set the gain to 0 immediately to stop the sound
                    this.gainNode.gain.cancelScheduledValues(currentTime);
                    this.gainNode.gain.setValueAtTime(0, currentTime);
                    // Stop the oscillator immediately
                    this.oscillatorNode.stop(currentTime);
                    // Schedule the cleanup after the release has finished
                    this.oscillatorNode.onended = function() {
                        _this.oscillatorNode.disconnect();
                        _this.gainNode.disconnect();
                        _this.oscillatorNode = null;
                        _this.gainNode = null;
                        _this.gameCtx.decrActiveSoundsCounterCallback();
                    };
                }
            }
        },
        {
            key: "playNote",
            value: function playNote(currentTime) {
                var durationInSecs = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0.65;
                var _this = this;
                if (this._isStopped) {
                    this._isStopped = false;
                    this.oscillatorNode = this.gameCtx.audioCtx.createOscillator();
                    this.gainNode = this.gameCtx.audioCtx.createGain();
                    this.oscillatorNode.type = this.type;
                    console.info("Playnote baseFreq: ", this.baseFreq);
                    this.oscillatorNode.frequency.setValueAtTime(this.baseFreq, currentTime);
                    this.oscillatorNode.detune.setValueAtTime(this.detune, currentTime);
                    this.oscillatorNode.connect(this.gainNode);
                    this.gainNode.connect(this.gameCtx.audioCtx.destination);
                    // Increment the active oscillators count in the Game class
                    this.gameCtx.incrActiveSoundsCounterCallback();
                    // Scale down the gain based on the total number of active oscillators
                    var scaledGain = this.gameCtx._nActiveSounds === 0 ? this.gainValue : this.gainValue / this.gameCtx._nActiveSounds;
                    console.info("this.gainValue = ", this.gainValue);
                    console.info("scaledGain = ", scaledGain);
                    console.info("_nActiveSounds = ", this.gameCtx._nActiveSounds);
                    // Apply an ADSR envelope to the gain node
                    this.gainNode.gain.setValueAtTime(0, currentTime);
                    this.gainNode.gain.linearRampToValueAtTime(scaledGain, currentTime + this.A);
                    this.gainNode.gain.linearRampToValueAtTime(this.S * scaledGain, currentTime + this.A + this.D);
                    // Start the oscillator
                    this.oscillatorNode.start();
                    // Apply exponential ramp to smoothly decrease volume and create a fade-out effect
                    var fadeOutDuration = 0.015; // Adjust this value for the desired fade-out duration
                    // Stop the oscillator after the specified duration
                    this.oscillatorNode.stop(currentTime + durationInSecs + fadeOutDuration);
                    this.gainNode.gain.linearRampToValueAtTime(0, currentTime + durationInSecs + fadeOutDuration + this.R);
                    // Schedule the cleanup after the release has finished
                    this.oscillatorNode.onended = function() {
                        _this.oscillatorNode.disconnect();
                        _this.gainNode.disconnect();
                        _this.oscillatorNode = null;
                        _this.gainNode = null;
                        _this._isStopped = true;
                        // Decrement the active oscillators count in the Game class
                        _this.gameCtx.decrActiveSoundsCounterCallback();
                    };
                }
            }
        }
    ]);
    return Oscillator;
}();
export { Oscillator as default };
