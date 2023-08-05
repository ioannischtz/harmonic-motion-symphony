import Pendulum from "./Pendulum";

export default class Game {
  constructor(canvasId, audioCtx) {
    this.canvas = document.getElementById(canvasId);
    this.canvasCtx = this.canvas.getContext("2d");
    this.audioCtx = audioCtx;
    this.canvas.width = window.innerWidth - 32;
    this.canvas.height = window.innerHeight - 32;
    this.frameRateCap = 240;
    this.pendulums = [];
    this.isPaused = false;
    this.selectedPendulum = null;

    this.activeOscillators = 0;
    this.activeOscillatorsLock = Promise.resolve(); // Initialize with a resolved Promise (no lock)

    // Set the origin-point to the top center of the canvas for simplicity
    this.originPoint = { x: this.canvas.width / 2, y: 100 };

    this.addPendulum(
      this,
      this.originPoint.x + 400,
      this.originPoint.y + 10,
      1000,
      50,
      {
        audioCtx: this.audioCtx,
        type: "sine",
        freq: 440,
        gain: 1.0,
      },
    );

    // Setup event listeners for user interactions
    this.setupEventListeners();

    // Start the game-loop
    this.gameLoop();
  }

  async incrementActiveOscillators() {
    // Use async/await to ensure synchronization
    await this.activeOscillatorsLock;
    this.activeOscillators++;
    this.activeOscillatorsLock = Promise.resolve(); // Release the lock
  }

  async decrementActiveOscillators() {
    // Use async/await to ensure synchronization
    await this.activeOscillatorsLock;
    this.activeOscillators--;
    // Ensure the count doesn't go negative
    this.activeOscillators = Math.max(0, this.activeOscillators);
    this.activeOscillatorsLock = Promise.resolve(); // Release the lock
  }

  setupEventListeners() {
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

  addPendulum(gameInstance, x, y, weight, radius, oscillatorParams) {
    console.group("addPendulum");
    console.info("Params: ", x, y, weight, radius, oscillatorParams);
    console.groupEnd();
    // Create a new pendulum and add it to the game's pendulums array
    const pendulum = new Pendulum(
      gameInstance,
      this.canvasCtx,
      x,
      y,
      this.originPoint,
      weight,
      radius,
      oscillatorParams,
    );
    this.pendulums.push(pendulum);
  }

  update(dt) {
    // Update the game state based on the elapsed delta time (dt)
    if (!this.isPaused) {
      this.pendulums.forEach((pendulum) => {
        pendulum.update(dt);
      });
    }
  }

  render() {
    // Clear the canvas and draw the pendulums
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.pendulums.forEach((pendulum) => {
      // Draw the pendulum on the canvas
      // Implement the rendering of the pendulum's weight and rod
      pendulum.render();
    });
  }

  gameLoop() {
    let then = performance.now();
    const interval = 1000 / this.frameRateCap;
    let delta = 0;

    console.group("GAME LOOP");
    console.info("...playing");
    console.groupEnd();

    const updateAndRender = (now) => {
      requestAnimationFrame(updateAndRender);

      delta = now - then;

      if (delta >= interval) {
        then = now - (delta % interval);

        // Update and render the game
        this.update(delta);
        this.render();
      }
    };

    requestAnimationFrame(updateAndRender);
  }

  // Implement other methods for handling user interactions, pendulum selection, etc.
}
