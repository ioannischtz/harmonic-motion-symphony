import Pendulum from "./Pendulum";
import GameEventEmitter from "./GameEventEmitter";
import { baseFrequencies, drawLine } from "../utils";
import StateMachine from "./StateMachine";

export default class Game {
  constructor(canvasParams, audioCtx, fpsCap, simCoeffs) {
    console.info("Game constructor called");

    this.canvas = document.getElementById(canvasParams.canvasId);
    this.canvasCtx = this.canvas.getContext("2d");
    this.audioCtx = audioCtx;
    this.canvas.width = canvasParams.width;
    this.canvas.height = canvasParams.height;
    this.simCoeffs = simCoeffs;
    this.fpsCap = fpsCap;
    this.pendulums = [];

    this.eventEmitter = new GameEventEmitter();

    this.GAME_STATES_WITH_HISTORY = {
      MENU: "MENU",
      PLAYING: "PLAYING",
      EDITING: "EDITING",
    };

    this.GAME_STATES = {
      MENU: "MENU",
      PLAYING: "PLAYING",
      EDITING: "EDITING",
      SETTINGS: "SETTINGS",
    };

    this.initialState = this.GAME_STATES.MENU;

    this.actions = {
      newGame: this.newGame.bind(this),
      play: this.play.bind(this),
      edit: this.edit.bind(this),
      openMenu: this.openMenu.bind(this),
      openSettings: this.openSettings.bind(this),
      closeSettings: this.closeSettings.bind(this),
      reset: this.reset.bind(this),
    };

    this.StateMachine = new StateMachine(
      this.initialState,
      this.GAME_STATES_WITH_HISTORY,
      this.actions,
    );

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

  emitStateChangeEvent() {
    this.eventEmitter.emit("gameStateChange", {
      state: this.StateMachine.current,
      stateHistory: this.StateMachine.history.buffer,
    });
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
      StateObj: {
        state: this.StateMachine.current,
        stateHistory: this.StateMachine.history.buffer,
      },
      eventEmitter: this.eventEmitter,
    };
    return gameCtx;
  }

  newGame() {
    this.reset();
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.audioCtx = audioCtx;

    const nPendulums = 1;
    const oscillatorTypes = ["sine", "square", "sawtooth", "triangle"];
    const oscillatorsParams = [
      {
        type: oscillatorTypes[0],
        gain: 0.7,
        baseFreq: baseFrequencies["A2"],
        adsr: [0.05, 0.05, 0.2, 0.1],
        detune: 0,
      },
    ];

    for (let i = 0; i < nPendulums; i++) {
      this.addPendulum(
        {
          x: this.originPoint.x,
          y: this.originPoint.y + 400,
        },
        1000,
        25,
        oscillatorsParams,
      );
    }

    this.edit();
  }

  play() {
    this.StateMachine.transitionTo(this.GAME_STATES.PLAYING);
    this.emitStateChangeEvent();
    console.info("Enter Playing Mode");
  }

  edit() {
    this.StateMachine.transitionTo(this.GAME_STATES.EDITING);
    this.emitStateChangeEvent();
    console.info("Enter Editing Mode");
  }

  reset() {
    this.fpsCap = 60;
    this.pendulums.forEach((pendulum) => pendulum.audioSource.stop());
    this.pendulums = [];
    this.simCoeffs = {
      gAccel: 0.00015,
      dampingCoeff: 0.00005,
    };
    this._nActiveSounds = 0;
    this._nActiveSoundsLock = Promise.resolve();
  }

  openMenu() {
    this.StateMachine.transitionTo(this.GAME_STATES.MENU);
    this.emitStateChangeEvent();
    console.info("Open Menu");
  }

  openSettings() {
    this.StateMachine.transitionTo(this.GAME_STATES.SETTINGS);
    this.emitStateChangeEvent();
    console.info("Open settings");
  }

  closeSettings() {
    this.openMenu();
    console.info("Close settings and return to main menu");
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

  _setupEventListeners() { }

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

  removePendulum() {
    const removedPendulum = this.pendulums.splice(
      this.selectedPendulum,
      this.selectedPendulum,
    );
    removedPendulum[0].audioSource.stop();
  }

  _update(dt) {
    // Update the game state based on the elapsed delta time (dt)
    if (this.StateMachine.current === this.GAME_STATES.PLAYING) {
      this.pendulums.forEach((pendulum) => {
        pendulum.update(dt);
      });
    }
  }

  _render() {
    // Clear the canvas and draw the pendulums
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw the ceiling line
    drawLine(
      this.canvasCtx,
      { x: 0, y: this.originPoint.y },
      { x: this.canvas.width, y: this.originPoint.y },
      "black",
      1,
    );

    this.pendulums.forEach((pendulum) => {
      // Draw the pendulum on the canvas
      // Implement the rendering of the pendulum's weight and rod
      pendulum.render();
    });
  }

  _loop() {
    let then = performance.now();
    let interval = 1000 / this.fpsCap;
    let delta = 0;

    const updateAndRender = (now) => {
      requestAnimationFrame(updateAndRender);

      delta = now - then;
      interval = 1000 / this.fpsCap;

      if (delta >= interval) {
        then = now - (delta % interval);

        // Update and render the game
        this._update(delta);
        this._render();
      }
    };

    requestAnimationFrame(updateAndRender);
  }
}
