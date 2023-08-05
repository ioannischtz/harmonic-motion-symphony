function mapRange(value, inputMin, inputMax, outputMin, outputMax) {
  return (
    ((value - inputMax) * (outputMin - outputMax)) / (inputMax - inputMin) +
    outputMin
  );
}

class Oscillator {
  constructor(params) {
    this.gameInstance = params.gameInstance; // Reference to the game instance
    this.audioCtx = params.audioCtx;
    this.type = params.type;
    this.freq = params.freq;
    this.gainValue = params.gain;

    this.oscillator = null;

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

  playNote(durationInSeconds = 0.5) {
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

      // Increment the active oscillators count in the Game class
      this.gameInstance.incrementActiveOscillators();

      // Scale down the gain based on the total number of active oscillators
      const scaledGain = this.gameInstance.activeOscillators === 0
        ? this.gainValue
        : this.gainValue / this.gameInstance.activeOscillators;
      this.gainNode.gain.setValueAtTime(scaledGain, this.audioCtx.currentTime);

      // Start the oscillator
      this.oscillator.start();

      // Apply exponential ramp to smoothly decrease volume and create a fade-out effect
      const fadeOutDuration = 0.015; // Adjust this value for the desired fade-out duration
      // this.gainNode.gain.setTargetAtTime(
      //   0,
      //   this.audioCtx.currentTime,
      //   durationInSeconds + fadeOutDuration,
      // );

      // Stop the oscillator after the specified duration
      this.oscillator.stop(
        this.audioCtx.currentTime + durationInSeconds + fadeOutDuration,
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

// oscillatorParams = {
//  audioCtx,
//  type: "sine" | "triangle" | "square",
//  freq: 440,
//  gain: 0.5
// }
class Pendulum {
  constructor(
    gameInstance,
    canvasCtx,
    x,
    y,
    originPoint,
    weight = 5,
    radius = 5,
    oscillatorParams,
  ) {
    this.gameInstance = gameInstance;
    this.canvasCtx = canvasCtx;
    this.x = x;
    this.y = y;
    this._prevX = x;
    this.originPoint = originPoint;
    this._weight = 5;
    this._radius = 5;

    // Use setters to apply validation for weight and radius
    this.weight = weight;
    this.radius = radius;

    this.length = this.calculateLength();
    this.angle = this.calculateInitialAngle();
    this.angularVelocity = 0;

    console.group("Pendulum constructor:");
    console.info("oscillatorParams", oscillatorParams);

    oscillatorParams.gameInstance = this.gameInstance;
    oscillatorParams.freq = mapRange(this.weight, 1, 10000, 80, 800);

    this.audioSource = new Oscillator(oscillatorParams);
    console.info("this.audioSource.oscillator", this.audioSource.oscillator);

    // this.audioSource.oscillator.frequency.setValueAtTime(
    //   mapRange(this.weight, 1, 10, 200, 500),
    //   this.audioSource.audioCtx.currentTime,
    // );

    // Constants for our Simple Harmonic Motion model
    this.gAccel = 0.00015; // gravitational acceleration (m/s^2) default=9.81
    this.dampingCoeff = 0.00005;

    console.groupEnd();
  }

  // Setter for the 'weight' property
  set weight(value) {
    // Ensure the value is within the valid range [1, 10]
    if (value < 1) {
      this._weight = 1;
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
  calculateLength() {
    const dx = this.x - this.originPoint.x;
    const dy = this.y - this.originPoint.y;
    return Math.sqrt(dx ** 2 + dy ** 2);
  }

  calculateInitialAngle() {
    const dx = this.x - this.originPoint.x;
    const dy = -(this.y - this.originPoint.y);

    // Adjust the angle based on the offset position
    // We'll use Math.PI/2 to rotate the pendulum 90 degrees counterclockwise
    // return Math.atan2(dy, dx);
    return Math.atan2(dy, dx) + Math.PI / 2;
  }

  update(dt) {
    // Implement the physics here to update the pendulum's angle and position
    // I decided to implement a modified SHM model, that also accounts for damping and weight
    // Euler's method for numerical integration
    const alpha = -((this.gAccel / this.length) * Math.sin(this.angle)) -
      (this.dampingCoeff / this.weight) * this.angularVelocity;

    // Update the angular velocity and angle
    this.angularVelocity += alpha * dt;
    this.angle += this.angularVelocity * dt;

    // Calculate the new coordinates of the pendulum's weight
    this.x = this.originPoint.x + this.length * Math.sin(this.angle);
    this.y = this.originPoint.y + this.length * Math.cos(this.angle); // Invert the y-coordinate

    const checkCrossedMiddle =
      (this._prevX > this.originPoint.x && this.x <= this.originPoint.x) ||
      (this._prevX < this.originPoint.x && this.x >= this.originPoint.x);

    // Update the previous x position for the next iteration
    this._prevX = this.x;

    // Check if the pendulum's weight crosses the x position of the originPoint
    if (checkCrossedMiddle) {
      this.audioSource.playNote(); // Trigger the audio
    }
  }

  render() {
    drawLine(
      this.canvasCtx,
      this.originPoint,
      { x: this.x, y: this.y },
      "black",
      4,
    );
    drawCircle(this.canvasCtx, { x: this.x, y: this.y }, this.radius, "red", 2);
  }
}

class Game {
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

function drawLine(ctx, startPoint, endPoint, color, thickness) {
  ctx.beginPath();
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(endPoint.x, endPoint.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.stroke();
}

function drawRect(ctx, pointCoords, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(pointCoords.x, pointCoords.y, width, height);
}

function drawCircle(ctx, pointCoords, radius, color, thickness) {
  ctx.beginPath();
  ctx.arc(pointCoords.x, pointCoords.y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.stroke();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomElementFromArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    // If the input is not an array or if it's an empty array, return null or handle the error as per your requirement.
    return null;
  }

  const randomIndex = getRandomInt(arr.length);
  return arr[randomIndex];
}

function main() {
  console.info("DOM loaded");

  // Create the game when the user clicks the "START" button
  const startBtn = document.getElementById("start-button");
  startBtn.addEventListener("click", () => {
    // Create the AudioContext after the button click
    //
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const canvasId = "canvas";
    const game = new Game(canvasId, audioCtx);

    // const oscillatorTypes = ["sine"];
    const oscillatorTypes = ["sine", "square", "sawtooth", "triangle"];

    for (let i = 0; i < getRandomInt(15); i++) {
      game.addPendulum(
        game,
        game.originPoint.x + getRandomInt(600),
        game.originPoint.y + getRandomInt(600),
        getRandomInt(10000),
        getRandomInt(100),
        {
          audioCtx: game.audioCtx,
          type: getRandomElementFromArray(oscillatorTypes),
          gain: 1.0,
        },
      );
    }
  });
}

if (document.readyState === "loading") {
  // Loading hasn't finished yet
  document.addEventListener("DOMContentLoaded", main);
} else {
  // `DOMContentLoaded` has already fired
  main();
}
