export default class Oscillator {
  constructor(params) {
    this.gameInstance = params.gameInstance; // Reference to the game instance
    this.audioCtx = params.audioCtx;
    this.type = params.type;
    this.freq = params.freq;
    this.gainValue = params.gain;

    this.harmonicGain = 0.3; // as a percentage
    this.harmonicDetune = 0.5; // Detune in semitones

    this.oscillator = null;
    this.triangleOscillator = null;

    this.isStopped = true;
  }

  stop() {
    if (!this.isStopped) {
      this.isStopped = true;

      // Set the gain to 0 immediately to stop the sound
      this.gainNode.gain.cancelScheduledValues(this.audioCtx.currentTime);
      this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);

      // Stop the oscillator immediately
      this.oscillator.stop(this.audioCtx.currentTime);

      // Schedule the cleanup after the release has finished
      this.oscillator.onended = () => {
        this.oscillator.disconnect();
        this.gainNode.disconnect();
        this.oscillator = null;
        this.gainNode = null;
        this.gameInstance.decrementActiveOscillators();
      };
    }
  }

  playNote(durationInSeconds = 0.65) {
    if (this.isStopped) {
      this.isStopped = false;

      this.oscillator = this.audioCtx.createOscillator();
      this.gainNode = this.audioCtx.createGain();

      this.oscillator.type = this.type;
      this.oscillator.frequency.setValueAtTime(
        this.freq,
        this.audioCtx.currentTime,
      );

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      // Create the triangle  oscillator
      this.triangleOscillator = this.audioCtx.createOscillator();
      this.triangleGainNode = this.audioCtx.createGain();
      this.triangleOscillator.type = "triangle";
      this.triangleOscillator.frequency.setValueAtTime(
        this.freq * Math.pow(2, this.harmonicDetune / 12), // Detune in semitones
        this.audioCtx.currentTime,
      );
      this.triangleOscillator.connect(this.triangleGainNode);
      this.triangleGainNode.connect(this.gainNode);

      // Increment the active oscillators count in the Game class
      this.gameInstance.incrementActiveOscillators();

      const currentTime = this.audioCtx.currentTime;

      // Scale down the gain based on the total number of active oscillators
      const scaledGain = this.gameInstance.activeOscillators === 0
        ? this.gainValue
        : this.gainValue / this.gameInstance.activeOscillators;
      // this.gainNode.gain.setValueAtTime(scaledGain, this.audioCtx.currentTime);
      //
      //

      // Apply an ADSR envelope to the gain node
      const attackTime = 0.02; // in seconds
      const decayTime = 0.25; // in seconds
      const sustainLevel = 0.5; // between 0 and 1
      const releaseTime = 0.2; // in seconds

      this.gainNode.gain.setValueAtTime(0, currentTime);
      this.gainNode.gain.linearRampToValueAtTime(
        this.gainValue,
        currentTime + attackTime,
      );
      this.gainNode.gain.linearRampToValueAtTime(
        sustainLevel * this.gainValue,
        currentTime + attackTime + decayTime,
      );

      this.triangleGainNode.gain.setValueAtTime(
        this.gainValue * this.harmonicGain,
        this.audioCtx.currentTime,
      );

      // Start the oscillator
      this.oscillator.start();

      // Apply exponential ramp to smoothly decrease volume and create a fade-out effect
      const fadeOutDuration = 0.015; // Adjust this value for the desired fade-out duration

      // Stop the oscillator after the specified duration
      this.oscillator.stop(
        this.audioCtx.currentTime + durationInSeconds + fadeOutDuration,
      );
      this.gainNode.gain.linearRampToValueAtTime(
        0,
        currentTime + durationInSeconds + fadeOutDuration + releaseTime,
      );

      // Schedule the cleanup after the release has finished
      this.oscillator.onended = () => {
        this.oscillator.disconnect();
        this.gainNode.disconnect();
        this.oscillator = null;
        this.gainNode = null;
        this.isStopped = true;

        // Decrement the active oscillators count in the Game class
        this.gameInstance.decrementActiveOscillators();
      };
    }
  }
}
