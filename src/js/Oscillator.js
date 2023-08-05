export default class Oscillator {
  constructor(gameCtx, params) {
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

  stop(currentTime) {
    if (!this._isStopped) {
      this._isStopped = true;

      // Set the gain to 0 immediately to stop the sound
      this.gainNode.gain.cancelScheduledValues(currentTime);
      this.gainNode.gain.setValueAtTime(0, currentTime);

      // Stop the oscillator immediately
      this.oscillatorNode.stop(currentTime);

      // Schedule the cleanup after the release has finished
      this.oscillatorNode.onended = () => {
        this.oscillatorNode.disconnect();
        this.gainNode.disconnect();
        this.oscillatorNode = null;
        this.gainNode = null;
        this.gameCtx.decrActiveSoundsCounterCallback();
      };
    }
  }

  playNote(currentTime, durationInSecs = 0.65) {
    if (this._isStopped) {
      this._isStopped = false;

      this.oscillatorNode = this.gameCtx.audioCtx.createOscillator();
      this.gainNode = this.gameCtx.audioCtx.createGain();

      this.oscillatorNode.type = this.type;

      this.oscillatorNode.frequency.setValueAtTime(
        this.baseFreq * Math.pow(2, this.detune / 12), // Detune in semitones
        currentTime,
      );

      this.oscillatorNode.connect(this.gainNode);
      this.gainNode.connect(this.gameCtx.audioCtx.destination);

      // Increment the active oscillators count in the Game class
      this.gameCtx.incrActiveSoundsCounterCallback();

      // Scale down the gain based on the total number of active oscillators
      const scaledGain = this.gameCtx._nActiveSounds === 0
        ? this.gainValue
        : this.gainValue / this.gameCtx._nActiveSounds;
      // this.gainNode.gain.setValueAtTime(scaledGain, this.audioCtx.currentTime);
      //
      //

      // Apply an ADSR envelope to the gain node

      this.gainNode.gain.setValueAtTime(0, currentTime);
      this.gainNode.gain.linearRampToValueAtTime(
        scaledGain * this.detune,
        currentTime + this.A,
      );
      this.gainNode.gain.linearRampToValueAtTime(
        this.S * scaledGain,
        currentTime + this.A + this.D,
      );

      // Start the oscillator
      this.oscillatorNode.start();

      // Apply exponential ramp to smoothly decrease volume and create a fade-out effect
      const fadeOutDuration = 0.015; // Adjust this value for the desired fade-out duration

      // Stop the oscillator after the specified duration
      this.oscillatorNode.stop(currentTime + durationInSecs + fadeOutDuration);
      this.gainNode.gain.linearRampToValueAtTime(
        0,
        currentTime + durationInSecs + fadeOutDuration + this.R,
      );

      // Schedule the cleanup after the release has finished
      this.oscillatorNode.onended = () => {
        this.oscillatorNode.disconnect();
        this.gainNode.disconnect();
        this.oscillatorNode = null;
        this.gainNode = null;
        this._isStopped = true;

        // Decrement the active oscillators count in the Game class
        this.gameCtx.decrActiveSoundsCounterCallback();
      };
    }
  }
}
