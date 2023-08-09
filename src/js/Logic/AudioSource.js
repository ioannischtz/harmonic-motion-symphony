import Oscillator from "./Oscillator";

export default class AudioSource {
  constructor(gameCtx, oscParamsArray) {
    this.gameCtx = gameCtx;
    this.oscParamsArray = oscParamsArray;
    this.oscillators = [];
    // this._isStopped = true;

    this.oscParamsArray.forEach((oscParams) => {
      this.addOscillator(oscParams);
    });
  }

  addOscillator(oscParams) {
    // Create a new oscillatorNode and add it
    // to the audioSource's oscillators array
    if (this.oscillators.length > 0) {
      oscParams.gain = oscParams.gain / (this.oscillators.length + 1);
      this.oscillators.gain = this.oscillators.gain /
        (this.oscillators.length + 1);
    }
    const oscillator = new Oscillator(this.gameCtx, oscParams);
    this.oscillators.push(oscillator);
  }

  stop() {
    if (!this._isStopped) {
      this._isStopped = true;
      this.oscillators.forEach((osc) => {
        osc.stop(this.gameCtx.audioCtx.currentTime);
      });
    }
  }

  playNote(durationInSecs) {
    console.info("AudioSource.playNote");
    console.info("AudioSource._isStopped", this._isStopped);
    this._isStopped = false;
    this.oscillators.forEach((osc) => {
      // !! Maybe we will need to pass a specific time,
      // for synchronization
      const currentTime = this.gameCtx.audioCtx.currentTime;
      console.info("currentTime = ", currentTime);
      osc.playNote(currentTime, durationInSecs);
    });
  }
}
