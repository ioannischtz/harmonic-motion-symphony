(function () {
  'use strict';

  class Oscillator {
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

        console.info("Playnote baseFreq: ", this.baseFreq);

        this.oscillatorNode.frequency.setValueAtTime(this.baseFreq, currentTime);
        this.oscillatorNode.detune.setValueAtTime(this.detune, currentTime);

        this.oscillatorNode.connect(this.gainNode);
        this.gainNode.connect(this.gameCtx.audioCtx.destination);

        // Increment the active oscillators count in the Game class
        this.gameCtx.incrActiveSoundsCounterCallback();

        // Scale down the gain based on the total number of active oscillators
        const scaledGain = this.gameCtx._nActiveSounds === 0
          ? this.gainValue
          : this.gainValue / this.gameCtx._nActiveSounds;
        console.info("this.gainValue = ", this.gainValue);
        console.info("scaledGain = ", scaledGain);
        console.info("_nActiveSounds = ", this.gameCtx._nActiveSounds);

        // Apply an ADSR envelope to the gain node

        this.gainNode.gain.setValueAtTime(0, currentTime);
        this.gainNode.gain.linearRampToValueAtTime(
          scaledGain,
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

  class AudioSource {
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

  const baseFrequencies = {
    // Octave 2
    C2: 65.41,
    "C#2": 69.3,
    Db2: 69.3,
    D2: 73.42,
    "D#2": 77.78,
    Eb2: 77.78,
    E2: 82.41,
    F2: 87.31,
    "F#2": 92.5,
    Gb2: 92.5,
    G2: 98.0,
    "G#2": 103.83,
    Ab2: 103.83,
    A2: 110.0,
    "A#2": 116.54,
    Bb2: 116.54,
    B2: 123.47,

    // Octave 3
    C3: 130.81,
    "C#3": 138.59,
    Db3: 138.59,
    D3: 146.83,
    "D#3": 155.56,
    Eb3: 155.56,
    E3: 164.81,
    F3: 174.61,
    "F#3": 185.0,
    Gb3: 185.0,
    G3: 196.0,
    "G#3": 207.65,
    Ab3: 207.65,
    A3: 220.0,
    "A#3": 233.08,
    Bb3: 233.08,
    B3: 246.94,

    // Octave 4
    C4: 261.63,
    "C#4": 277.18,
    Db4: 277.18,
    D4: 293.66,
    "D#4": 311.13,
    Eb4: 311.13,
    E4: 329.63,
    F4: 349.23,
    "F#4": 369.99,
    Gb4: 369.99,
    G4: 392.0,
    "G#4": 415.3,
    Ab4: 415.3,
    A4: 440.0,
    "A#4": 466.16,
    Bb4: 466.16,
    B4: 493.88,
  };

  const oscillatorTypes = ["sine", "triangle", "square", "sawtooth"];

  function mapRangeInverseToList(value, rangeMin, rangeMax, list) {
    if (value < rangeMin || value > rangeMax) {
      throw new Error("Value is outside the specified range");
    }

    const rangeSize = rangeMax - rangeMin;
    const valuePosition = (value - rangeMin) / rangeSize;
    const index = Math.floor((1 - valuePosition) * (list.length - 1));

    return list[index];
  }

  function drawLine(ctx, startPoint, endPoint, color, thickness) {
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.stroke();
  }

  function drawCircle(ctx, pointCoords, radius, color, thickness) {
    ctx.beginPath();
    ctx.arc(pointCoords.x, pointCoords.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.stroke();
  }

  function drawCeiling(ctx, length, startX, startY, color, lineWidth) {
    const endX = startX + length;
    const endY = startY;
    const slantedLineCount = Math.floor(length / 20); // Adjust the divisor for the desired number of slanted lines
    const slantedLineSpacing = length / (slantedLineCount + 1);
    // const slantedLineLength = 10;
    const slantedLineLength = slantedLineSpacing * Math.sqrt(2);
    const slantedLineAngle = 60; // Angle of the slanted lines in degrees

    drawLine(
      ctx,
      { x: startX, y: startY },
      { x: endX, y: endY },
      color,
      lineWidth,
    );
    // Alternative style
    // for (let i = 1; i <= slantedLineCount; i++) {
    //   const slantedStartX = startX + i * slantedLineSpacing;
    //   const slantedStartY = startY - i * (lineWidth * 2); // Adjust the value for proper slanting
    //   drawLine(
    //     ctx,
    //     { x: slantedStartX, y: slantedStartY },
    //     { x: slantedStartX, y: startY },
    //     color,
    //     lineWidth,
    //   );
    // }

    for (let i = 1; i <= slantedLineCount; i++) {
      const slantedStartX = startX + i * slantedLineSpacing;
      const slantedStartY = startY;
      const slantedEndX = slantedStartX +
        slantedLineLength * Math.cos(degToRad(slantedLineAngle));
      const slantedEndY = startY -
        slantedLineLength * Math.sin(degToRad(slantedLineAngle));
      drawLine(
        ctx,
        { x: slantedStartX, y: slantedStartY },
        { x: slantedEndX, y: slantedEndY },
        color,
        lineWidth,
      );
    }
  }

  // Function to convert degrees to radians
  function degToRad(degrees) {
    return (degrees * Math.PI) / 180;
  }

  class Pendulum {
    constructor(gameCtx, coords, weight = 5, radius = 5, oscillatorsParams) {
      this.gameCtx = gameCtx;
      this.coords = coords;
      this._prevX = coords.x;
      this._weight = 5;
      this._radius = 5;
      this.rodColor = getComputedStyle(document.documentElement).getPropertyValue(
        "--primary-dark",
      );
      this.weightColor = getComputedStyle(
        document.documentElement,
      ).getPropertyValue("--accent");

      this.glowColor = "red";

      // Use setters to apply validation for weight and radius
      this.weight = weight;
      this.radius = radius;

      this.length = this.calcLength();
      this.angle = this.calcInitAngle();
      this._angularVelocity = 0;

      this.checkCrossedMiddle = false;

      this.oscillatorsParams = oscillatorsParams.map((oscParams) => ({
        ...oscParams,
        baseFreq: mapRangeInverseToList(
          this.weight,
          10,
          10000,
          Object.values(baseFrequencies),
        ),
      }));

      // console.info(oscillatorsParams);

      this.audioSource = new AudioSource(gameCtx, this.oscillatorsParams);

      // Constants for our Simple Harmonic Motion model
      // this.gAccel = 0.00015; // gravitational acceleration (m/s^2) default=9.81
      // this.dampingCoeff = 0.00005;

      this._setupEventListeners();
    }

    // Setter for the 'weight' property
    set weight(value) {
      // Ensure the value is within the valid range [10, 10000]
      if (value < 10) {
        this._weight = 10;
      } else if (value > 10000) {
        this._weight = 10000;
      } else {
        this._weight = Math.round(value); // Round to the nearest integer
      }
    }

    // Getter for the 'weight' property
    get weight() {
      return this._weight;
    }

    // Setter for the 'radius' property
    set radius(value) {
      // Ensure the value is within the valid range [1, 10]
      if (value < 5) {
        this._radius = 5;
      } else if (value > 100) {
        this._radius = 100;
      } else {
        this._radius = Math.round(value); // Round to the nearest integer
      }
    }

    // Getter for the 'radius' property
    get radius() {
      return this._radius;
    }

    // Calculate the distance between the pendulum's origin (originPoint) and its weight (end point) given by the provided (x, y) coordinates
    calcLength() {
      const dx = this.coords.x - this.gameCtx.originPoint.x;
      const dy = this.coords.y - this.gameCtx.originPoint.y;
      return Math.sqrt(dx ** 2 + dy ** 2);
    }

    calcInitAngle() {
      const dx = this.coords.x - this.gameCtx.originPoint.x;
      const dy = -(this.coords.y - this.gameCtx.originPoint.y);

      // Adjust the angle based on the offset position
      // We'll use Math.PI/2 to rotate the pendulum 90 degrees counterclockwise
      // return Math.atan2(dy, dx);
      return Math.atan2(dy, dx) + Math.PI / 2;
    }

    _setupEventListeners() {
      // this.gameCtx.eventEmitter.on("crossedMiddle", () => {
      //   drawAnimatedGlowingCircle(
      //     this.gameCtx.canvasCtx,
      //     { x: this.coords.x, y: this.coords.y },
      //     this.radius,
      //     "blue",
      //     "red",
      //     1000,
      //   );
      // });
    }

    update(dt) {
      // Implement the physics here to update the pendulum's angle and position
      // I decided to implement a modified SHM model, that also accounts for damping and weight
      // Euler's method for numerical integration
      //
      // Don't go over the `y` ceiling
      if (this.coords.y < this.gameCtx.originPoint.y) {
        this.coords.y = this.gameCtx.originPoint.y;
      }

      const alpha =
        -((this.gameCtx.simCoeffs.gAccel / this.length) * Math.sin(this.angle)) -
        (this.gameCtx.simCoeffs.dampingCoeff / this.weight) *
        this._angularVelocity;

      // Update the angular velocity and angle
      this._angularVelocity += alpha * dt;
      this.angle += this._angularVelocity * dt;

      // Calculate the new coordinates of the pendulum's weight
      this.coords.x = this.gameCtx.originPoint.x +
        this.length * Math.sin(this.angle);
      this.coords.y = this.gameCtx.originPoint.y +
        this.length * Math.cos(this.angle); // Invert the y-coordinate

      this.checkCrossedMiddle = (this._prevX > this.gameCtx.originPoint.x &&
        this.coords.x <= this.gameCtx.originPoint.x) ||
        (this._prevX < this.gameCtx.originPoint.x &&
          this.coords.x >= this.gameCtx.originPoint.x);

      // Update the previous x position for the next iteration
      this._prevX = this.coords.x;

      // Check if the pendulum's weight crosses the x position of the originPoint
      if (this.checkCrossedMiddle) {
        console.info("crossed middle");
        console.info("_nActiveSounds", this.gameCtx._nActiveSounds);
        this.audioSource.playNote(0.65); // Trigger the audio
        // this.gameCtx.eventEmitter.emit("crossedMiddle");
        // drawAnimatedGlowingCircle(
        //   this.gameCtx.canvasCtx,
        //   { x: this.coords.x, y: this.coords.y },
        //   this.radius,
        //   "blue",
        //   "red",
        //   3000,
        // );
      }
    }

    render() {
      drawLine(
        this.gameCtx.canvasCtx,
        this.gameCtx.originPoint,
        { x: this.coords.x, y: this.coords.y },
        this.rodColor,
        4,
      );
      drawCircle(
        this.gameCtx.canvasCtx,
        { x: this.coords.x, y: this.coords.y },
        this.radius,
        this.weightColor,
        6,
      );
    }
  }

  class GameEventEmitter {
    constructor() {
      this.listeners = {};
    }

    on(event, listener) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(listener);
    }

    emit(event, ...args) {
      if (this.listeners[event]) {
        this.listeners[event].forEach((listener) => listener(...args));
      }
    }
  }

  class RingBuffer {
    constructor(capacity) {
      this.capacity = capacity;
      this.buffer = new Array(capacity);
      this.head = 0; // Newest entry
      this.tail = 0; // Oldest entry
      this.size = 0; // Number of entries currently in the buffer
    }

    // reverse style to feel more like a stack, since it makes
    // more sense for our use case of keeping a history of states
    push(newEntry) {
      // if the buffer is at capacity, pop the oldest entry before pushing
      if (this.size === this.capacity) {
        // this.head = (this.head + 1) % this.capacity;
        // If the buffer is at capacity, pop the oldest entry
        this.pop();
      } else {
        this.size++;
      }

      // Push the new entry onto the buffer at the index specified by `head`
      this.buffer[this.head] = newEntry;
      this.head = (this.head + 1) % this.capacity;
    }

    pop() {
      if (this.size > 0) {
        // Pop the oldest entry from the index specified by `tail`
        const entry = this.buffer[this.tail];
        this.tail = (this.tail + 1) % this.capacity;
        this.size--;
        return entry;
      }
      return null;
    }

    getLast() {
      if (this.size > 0) {
        // Access the latest entry using the index specified by `head`
        return this.buffer[this.head === 0 ? this.capacity - 1 : this.head - 1];
      }
      return null;
    }

    getLastIndex() {
      if (this.size > 0) {
        // Access the latest entry using the index specified by `head`
        return this.head === 0 ? this.capacity - 1 : this.head - 1;
      }
      return null;
    }

    getSecondToLast() {
      if (this.size > 1) {
        // Access the second-to-latest entry using the index specified by `head`
        return this.buffer[this.head === 1 ? this.capacity - 1 : this.head - 2];
      }
      return null;
    }

    getSecondToLastIndex() {
      if (this.size > 1) {
        // Access the second-to-latest entry using the index specified by `head`
        return this.head === 1 ? this.capacity - 1 : this.head - 2;
      }
      return null;
    }

    clear() {
      this.buffer = new Array(this.capacity);
      this.head = 0;
      this.tail = 0;
      this.size = 0;
    }
  }

  class StateMachine {
    constructor(initialState, STATES_TO_SAVE, actions) {
      this.current = initialState;
      this.STATES = STATES_TO_SAVE;
      this.history = new RingBuffer(5);
      this.actions = actions;

      console.info("this.STATES_TO_SAVE", this.STATES);
    }

    transitionTo(newState) {
      console.info("newState = ", newState);

      if (
        this.STATES.hasOwnProperty(this.current) &&
        this.STATES.hasOwnProperty(newState) &&
        newState !== this.current
      ) {
        // Only keep history of the states in the STATES obj
        // and don't save the same state change twice in a row
        this.history.push(this.current);
      }
      this.current = newState;

      console.info(`Transitioned to state: ${newState}`);
      console.info(`State history: ${this.history.buffer}`);
      console.info(
        `State history head:${this.history.head}, tail:${this.history.tail}`,
      );
    }
  }

  class Game {
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
      drawCeiling(
        this.canvasCtx,
        400,
        this.originPoint.x - 200,
        this.originPoint.y,
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

  class AddPendulumOverlay {
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

      this._updateBaseFreqBasedOnWeight();
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
      let coordYval = parseInt(this.yCoordinateInput.value);

      if (coordYval < this.gameInstance.originPoint.y) {
        coordYval = this.gameInstance.originPoint.y;
      }

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

    _updateBaseFreqBasedOnWeight() {
      const baseFreq = mapRangeInverseToList(
        this.weightVal,
        10,
        10000,
        Object.values(baseFrequencies),
      );

      // const optionToSelect = findKeyByValue(baseFrequencies, baseFreq);
      const optionToSelect = baseFreq.toString();

      for (const option of this.baseFrequencySelect.options) {
        if (option.value === optionToSelect) {
          console.info("option.value === optionToSelect", option.value);
          option.selected = true;
          break; // Exit the loop after finding and selecting the desired option
        }
      }
    }

    _handleWeightInputChange(event) {
      this.weightVal = event.target.valueAsNumber;
      this._updateBaseFreqBasedOnWeight();
    }

    _setupEventListeners() {
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
      this.weightInput.addEventListener(
        "input",
        this._handleWeightInputChange.bind(this),
      );
    }
  }

  class EditPendulumOverlay {
    constructor(gameInstance, overlayElements) {
      this.gameInstance = gameInstance;

      // overlay
      this.menuOverlayElm = overlayElements.menuOverlayElm;
      this.editingOverlayElm = overlayElements.editingOverlayElm;
      this.playingOverlayElm = overlayElements.playingOverlayElm;
      this.keysHintOverlayElm = overlayElements.keysHintOverlayElm;
    }
  }

  class EditingOverlay {
    constructor(gameInstance, overlayElements) {
      this.gameInstance = gameInstance;
      // overlay
      this.menuOverlayElm = overlayElements.menuOverlayElm;
      this.editingOverlayElm = overlayElements.editingOverlayElm;
      this.playingOverlayElm = overlayElements.playingOverlayElm;
      this.keysHintOverlayElm = overlayElements.keysHintOverlayElm;

      // tab menu
      this.tabButtons = document.querySelectorAll(".tab-button");
      this.tabContents = document.querySelectorAll(".tab-content");
      // AddPendulumOverlay object
      this.AddPendulumOverlay = new AddPendulumOverlay(
        this.gameInstance,
        overlayElements,
      );
      // EditPendulumOverlay object
      this.EditPendulumOverlay = new EditPendulumOverlay(
        this.gameInstance,
        overlayElements,
      );

      this._setupEventHandlers();
    }

    _setupEventHandlers() {
      this.tabButtons.forEach((button) => {
        button.addEventListener(
          "click",
          (() => {
            this.handleTabClick(button);
          }).bind(this),
        );
      });
    }

    handleTabClick(button) {
      const tabName = button.dataset.tab;

      this.tabButtons.forEach((btn) => btn.classList.remove("active"));
      this.tabContents.forEach((content) => content.classList.remove("active"));

      button.classList.add("active");
      document.getElementById(tabName).classList.add("active");
    }
  }

  class KeysHintOverlay {
    constructor(gameInstance) {
      this.gameInstance = gameInstance;

      this.keysHintOverlayElm = document.getElementById("keysHintOverlay");
    }

    // Function to update the keys-hint content

    updateKeysHint() {
      const keysHint = document.getElementById("keysHint");

      const currentState = this.gameInstance.StateMachine.current;

      switch (currentState) {
        case this.gameInstance.GAME_STATES.MENU:
          keysHint.innerHTML = `
        <p><kbd>Esc</kbd> close the menu</p>
      `;
          break;
        case this.gameInstance.GAME_STATES.EDITING:
          keysHint.innerHTML = `
        <p><kbd>Esc</kbd> open the menu</p>
        <p><kbd>Space</kbd> switch to playing mode</p>
      `;
          break;
        case this.gameInstance.GAME_STATES.PLAYING:
          keysHint.innerHTML = `
        <p><kbd>Esc</kbd> open the menu</p>
        <p><kbd>Space</kbd> switch to editing mode</p>
      `;
          break;
        case this.gameInstance.GAME_STATES.SETTINGS:
          keysHint.innerHTML = `
        <p><kbd>Backspace</kbd> switch back to main menu</p>
      `;
          break;
        default:
          keysHint.innerHTML = ""; // Clear the content
          break;
      }
    }
  }

  class SettingsOverlay {
    constructor(gameInstance) {
      this.gameInstance = gameInstance;

      this.overlayElm = document.getElementById("settingsOverlay");
      this.fpsCapInput = document.getElementById("fpsCap");
      this.gAccelInput = document.getElementById("gAcceleration");
      this.dampingInput = document.getElementById("damping");

      this.applySettingsButton = document.getElementById("apply-settings-button");
      this.resetSettingsButton = document.getElementById("reset-settings-button");

      this.fpsCap = parseInt(this.fpsCapInput.value);
      this.gAccel = parseFloat(this.gAccelInput.value);
      this.dampingCoeff = parseFloat(this.dampingInput.value);

      this._setupEventListeners();
    }

    handleApplySettingsBtnClick() {
      console.info("Apply Settings CLicked");
      this.updateValues();
    }

    handleResetSettingsBtnClick() {
      console.info("Reset Settings CLicked");
      this.resetValues();
      this.updateValues();
    }

    _setupEventListeners() {
      this.applySettingsButton.addEventListener(
        "click",
        this.handleApplySettingsBtnClick.bind(this),
      );
      this.resetSettingsButton.addEventListener(
        "click",
        this.handleResetSettingsBtnClick.bind(this),
      );
    }

    updateValues() {
      this.fpsCap = parseInt(this.fpsCapInput.value);
      this.gAccel = parseInt(this.gAccelInput.value);
      this.dampingCoeff = parseInt(this.dampingInput.value);

      this.gameInstance.fpsCap = this.fpsCap;
      this.gameInstance.simCoeffs = {
        gAccel: this.gAccel,
        dampingCoeff: this.dampingCoeff,
      };
      // Since the physics simulation rely on a fixed time step, we need to reset
      this.gameInstance.reset();
    }

    resetValues() {
      this.fpsCap = 60;
      this.gAccel = 0.00015;
      this.dampingCoeff = 0.00005;

      this.fpsCapInput.value = this.fpsCap;
      this.gAccelInput.value = this.gAccel;
      this.dampingInput.value = this.dampingCoeff;
    }
  }

  class MenuOverlay {
    constructor(gameInstance, overlayElements) {
      this.gameInstance = gameInstance;

      // overlay
      this.menuOverlayElm = overlayElements.menuOverlayElm;
      this.editingOverlayElm = overlayElements.editingOverlayElm;
      this.playingOverlayElm = overlayElements.playingOverlayElm;
      this.keysHintOverlayElm = overlayElements.keysHintOverlayElm;

      // menu buttons
      this.newGameButton = document.getElementById("new-game-button");
      this.resumeButton = document.getElementById("resume-button");
      this.resetButton = document.getElementById("reset-button");
      this.settingsButton = document.getElementById("settings-button");

      // SettingsOverlay Object
      this.SettingsOverlay = new SettingsOverlay(this.gameInstance);
      this.SettingsOverlay.overlayElm.style.display = "none";

      this.resumeButton.style.display = "none";
      this.resetButton.style.display = "none";
      this._setupEventListeners();
    }

    newGame() {
      this.newGameButton.style.display = "none";
      this.resumeButton.style.display = "block";
      this.resetButton.style.display = "block";

      // hide the game menu
      this.menuOverlayElm.style.display = "none";
      this.editingOverlayElm.style.display = "flex";
      this.playingOverlayElm.style.display = "none";

      this.gameInstance.newGame();
    }

    play() {
      this.menuOverlayElm.style.display = "none";
      this.editingOverlayElm.style.display = "none";
      this.playingOverlayElm.style.display = "flex";

      this.gameInstance.play();
    }

    edit() {
      this.menuOverlayElm.style.display = "none";
      this.editingOverlayElm.style.display = "flex";
      this.playingOverlayElm.style.display = "none";

      this.gameInstance.edit();
    }

    openMenu() {
      this.menuOverlayElm.style.display = "flex";

      this.gameInstance.openMenu();
    }

    resume() {
      let prevGameState = this.gameInstance.StateMachine.history.getLast();

      const secondToLastState = this.gameInstance.StateMachine.history
        .getSecondToLast();

      console.info("resume(): historyLast", prevGameState);
      console.info("resume(): history2ndToLast", secondToLastState);

      if (prevGameState === this.gameInstance.GAME_STATES.SETTINGS) {
        prevGameState = secondToLastState;
      }
      if (prevGameState === this.gameInstance.GAME_STATES.PLAYING) {
        this.play();
      } else if (prevGameState === this.gameInstance.GAME_STATES.EDITING) {
        this.edit();
      }
    }

    reset() {
      this.gameInstance.reset();
      this.resume();
    }

    openSettings() {
      console.group("MenuOverlay");
      console.info("openSettings called");
      console.groupEnd();

      this.menuOverlayElm.style.display = "none";
      this.editingOverlayElm.style.display = "none";
      this.playingOverlayElm.style.display = "none";
      this.keysHintOverlayElm.style.display = "flex";
      this.SettingsOverlay.overlayElm.style.display = "flex";

      this.gameInstance.openSettings();
    }

    closeSettings() {
      this.menuOverlayElm.style.display = "flex";
      this.editingOverlayElm.style.display = "none";
      this.playingOverlayElm.style.display = "none";
      this.keysHintOverlayElm.style.display = "flex";
      this.SettingsOverlay.overlayElm.style.display = "none";

      this.gameInstance.closeSettings();
    }

    _setupEventListeners() {
      this.newGameButton.addEventListener("click", this.newGame.bind(this));

      this.resumeButton.addEventListener("click", this.resume.bind(this));

      this.resetButton.addEventListener("click", this.reset.bind(this));

      this.settingsButton.addEventListener("click", this.openSettings.bind(this));
    }
  }

  class PlayingOverlay {
    constructor(gameInstance, overlayElements) {
      this.gameInstance = gameInstance;

      // overlay
      this.menuOverlayElm = overlayElements.menuOverlayElm;
      this.editingOverlayElm = overlayElements.editingOverlayElm;
      this.playingOverlayElm = overlayElements.playingOverlayElm;
      this.keysHintOverlayElm = overlayElements.keysHintOverlayElm;
    }
  }

  class GUI {
    constructor(
      gameInstance,
      canvasParams = {
        canvasId,
        width: window.innerWidth - 32,
        height: window.innerHeight - 32,
      },
    ) {
      this.gameInstance = gameInstance;
      this.canvasParams = canvasParams;

      // overlays
      //
      this.overlayElms = {
        menuOverlayElm: document.getElementById("menuOverlay"),
        editingOverlayElm: document.getElementById("editingOverlay"),
        playingOverlayElm: document.getElementById("playingOverlay"),
        keysHintOverlayElm: document.getElementById("keysHintOverlay"),
      };

      this.overlayElms.menuOverlayElm.style.display = "flex";
      this.overlayElms.editingOverlayElm.style.display = "none";
      this.overlayElms.playingOverlayElm.style.display = "none";
      this.overlayElms.keysHintOverlayElm.style.display = "flex";

      this.MenuOverlay = new MenuOverlay(this.gameInstance, this.overlayElms);
      this.KeysHintOverlay = new KeysHintOverlay(this.gameInstance);
      this.PlayingOVerlay = new PlayingOverlay(
        this.gameInstance,
        this.overlayElms,
      );
      this.EditingOverlay = new EditingOverlay(
        this.gameInstance,
        this.overlayElms,
      );

      const fpsCap = this.MenuOverlay.SettingsOverlay.fspCap;
      const simCoeffs = {
        gAccel: this.MenuOverlay.SettingsOverlay.gAccel,
        dampingCoeff: this.MenuOverlay.SettingsOverlay.dampingCoeff,
      };

      // set fpsCap and simCoeffs
      this.gameInstance.fpsCap = fpsCap;
      this.gameInstance.simCoeffs = simCoeffs;

      // Initial update to set the keys-hint
      this.KeysHintOverlay.updateKeysHint();

      this._setupEventListeners();
    }

    handleKeyPress(event) {
      const curr = this.gameInstance.StateMachine.current;
      // const lastIndex = this.gameInstance.StateMachine.history.size - 1;
      // const prev = this.gameInstance.StateMachine.history.buffer[lastIndex];
      switch (event.key) {
        case "Escape":
        case "Esc":
          // If the game just loaded, pressing `ESC` shouldn't have any effect
          if (this.gameInstance.StateMachine.history.size === 0) return;
          // If state = settings only `Backspace` should have an effect
          if (curr === this.gameInstance.GAME_STATES.SETTINGS) return;

          // Pressing `ESC` key will toggle the menu overlay
          if (curr === this.gameInstance.GAME_STATES.MENU) {
            this.MenuOverlay.resume();
          } else {
            this.MenuOverlay.openMenu();
          }
          break;
        case " ":
          // If state = settings only `Backspace` should have an effect
          if (curr === this.gameInstance.GAME_STATES.SETTINGS) return;
          // Pressing `SPACE` key will toggle between editing and playing mode
          if (curr === this.gameInstance.GAME_STATES.EDITING) {
            this.overlayElms.playingOverlayElm.style.display = "flex";
            this.overlayElms.editingOverlayElm.style.display = "none";
            this.gameInstance.play();
          } else if (curr === this.gameInstance.GAME_STATES.PLAYING) {
            this.overlayElms.playingOverlayElm.style.display = "none";
            this.overlayElms.editingOverlayElm.style.display = "flex";
            this.gameInstance.edit();
          }
          break;
        case "Backspace":
          if (curr === this.gameInstance.GAME_STATES.SETTINGS) {
            this.MenuOverlay.closeSettings();
          }
          break;
      }
    }

    _setupEventListeners() {
      document.addEventListener("keydown", this.handleKeyPress.bind(this));

      this.gameInstance.eventEmitter.on("gameStateChange", (stateObj) => {
        console.info("gameStateChange: StateObj:", stateObj);
        this.KeysHintOverlay.updateKeysHint();
      });
    }
  }

  function main() {
    const canvasId = "canvas";
    const canvasParams = {
      canvasId,
      width: window.innerWidth - 32,
      height: window.innerHeight - 32,
    };

    const fpsCap = 60;
    const simCoeffs = {
      gAccel: 0.00015,
      dampingCoeff: 0.00005,
    };

    // We cannot supply an audioCtx without user interaction. audioCtx will be set later, on user click
    const game = new Game(canvasParams, null, fpsCap, simCoeffs);

    const gui = new GUI(game, canvasParams);
    console.info(gui);
  }

  if (document.readyState === "loading") {
    // Loading hasn't finished yet
    document.addEventListener("DOMContentLoaded", main);
  } else {
    // `DOMContentLoaded` has already fired
    main();
  }

})();
