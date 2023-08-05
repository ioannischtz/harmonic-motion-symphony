import Pendulum from "./Pendulum";

export default class Game {
  constructor(canvasParams, audioCtx, fpsCap, simCoeffs) {
    this.canvas = document.getElementById(canvasParams.canvasId);
    this.canvasCtx = this.canvas.getContext("2d");
    this.audioCtx = audioCtx;
    this.canvas.width = canvasParams.width;
    this.canvas.height = canvasParams.height;
    this.simCoeffs = simCoeffs;
    this.fpsCap = fpsCap;
    this.pendulums = [];
    this.GAME_STATES = {
      MENU: "MENU",
      PLAYING: "PLAYING",
      PAUSED: "PAUSED",
      SETTINGS: "SETTINGS",
    };
    this.gameState = this.GAME_STATES.MENU;
    // Set the origin-point to the top center of the canvas for simplicity
    this.originPoint = { x: this.canvas.width / 2, y: 100 };

    this.selectedPendulum = null;

    this._nActiveSounds = 0;
    this._nActiveSoundsLock = Promise.resolve(); // Initialize with a resolved Promise (no lock)

    // Setup event listeners for user interactions
    this._setupEventListeners();

    // Start the game-loop
    this._loop();
  }

  getGameCtx() {
    // Game Context:
    const gameCtx = {
      canvasCtx: this.canvasCtx,
      audioCtx: this.audioCtx,
      originPoint: this.originPoint,
      simCoeffs: this.simCoeffs,
      _nActiveSounds: this._nActiveSounds,
      incrActiveSoundsCounterCallback: this._incrementActiveSounds,
      decrActiveSoundsCounterCallback: this._decrementActiveSounds,
    };
    return gameCtx;
  }

  play() {
    this.gameState = this.GAME_STATES.PLAYING;
  }

  pause() {
    this.gameState = this.GAME_STATES.PAUSED;
  }

  reset() {
    this.fpsCap = 60;
    this.pendulums.forEach((pendulum) => pendulum.audioSource.stop());
    this.pendulums = null;
    this.simCoeffs = {
      gAccel: 0.00015,
      dampingCoeff: 0.00005,
    };
    this._nActiveSounds = 0;
    this._nActiveSoundsLock = Promise.resolve();
  }

  openMenu() {
    this.gameState = this.GAME_STATES.MENU;
  }

  openSettings() {
    this.gameState = this.GAME_STATES.SETTINGS;
  }

  async _incrementActiveSounds() {
    // Use async/await to ensure synchronization
    await this._nActiveSoundsLock;
    console.info("_increment");
    this._nActiveSounds++;
    this._nActiveSoundsLock = Promise.resolve(); // Release the lock
  }

  async _decrementActiveSounds() {
    // Use async/await to ensure synchronization
    await this._nActiveSoundsLock;
    console.info("_decrement");
    this._nActiveSounds--;
    // Ensure the count doesn't go negative
    this._nActiveSounds = Math.max(0, this._nActiveSounds);
    this._nActiveSoundsLock = Promise.resolve(); // Release the lock
  }

  _setupEventListeners() {
    // Add event listeners for user interactions
    //
    // Implement logic to handle pendulum selection:
    //   it should open up a side menu with settings for the pendulum's parameters
    //
    // Implement logic to handle pendulum dragging with mouse (limit movement to the pendulums circular motion path)
    //
    // Implement logic to handle menu: pressing the `ESC` key should open the game menu:
    //   `RESUME` or `PLAY`
    //   `SETTINGS` (for the game's parameters, maybe for the physics as well? like the dampingCoeff?, also frame-rate cap)
    //   `RESET`
  }

  addPendulum(coords, weight, radius, oscillatorsParams) {
    // Game Context:
    const gameCtx = this.getGameCtx();
    // Create a new pendulum and add it to the game's pendulums array
    const pendulum = new Pendulum(
      gameCtx,
      coords,
      weight,
      radius,
      oscillatorsParams,
    );
    this.pendulums.push(pendulum);
  }

  _update(dt) {
    // Update the game state based on the elapsed delta time (dt)
    if (this.gameState === this.GAME_STATES.PLAYING) {
      this.pendulums.forEach((pendulum) => {
        pendulum.update(dt);
      });
    }
  }

  _render() {
    // Clear the canvas and draw the pendulums
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.pendulums.forEach((pendulum) => {
      // Draw the pendulum on the canvas
      // Implement the rendering of the pendulum's weight and rod
      pendulum.render();
    });
  }

  _loop() {
    let then = performance.now();
    const interval = 1000 / this.fpsCap;
    let delta = 0;

    this.play();

    const updateAndRender = (now) => {
      requestAnimationFrame(updateAndRender);

      delta = now - then;

      if (delta >= interval) {
        then = now - (delta % interval);

        // Update and render the game
        this._update(delta);
        this._render();
      }
    };

    requestAnimationFrame(updateAndRender);
  }

  // Implement other methods for handling user interactions, pendulum selection, etc.
}
