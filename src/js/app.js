function mapRange(value, inputMin, inputMax, outputMin, outputMax) {
  return (
    ((value - inputMin) * (outputMax - outputMin)) / (inputMax - inputMin) +
    outputMin
  );
}

class Oscillator {
  constructor(
    audioCtx,
    type = "sine",
    freq = 440,
    A = 0.1,
    D = 0.1,
    S = 0.5,
    R = 0.1,
    gain = 0.5,
  ) {
    this.audioCtx = audioCtx;
    this.type = type;
    this.freq = freq;
    this.attack = A;
    thid.decay = D;
    this.sustain = S;
    this.release = R;
    this.gainValue = gain;

    this.oscillator = this.audioCtx.createOscillator();
    this.gainNode = this.audioCtx.createGain();

    this.oscillator.type = this.type;
    this.oscillator.frequency.setValueAtTime(
      this.freq,
      this.audioCtx.currentTime,
    );

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);

    this.isStopped = true;
  }

  stop() {
    if (!this.isStopped) {
      this.isStopped = true;
      const releaseTime = this.getReleaseTime();

      this.gainNode.gain.cancelScheduledValues(this.audioCtx.currentTime);
      this.gainNode.gain.setValueAtTime(
        this.gainNode.gain.value,
        this.audioCtx.currentTime,
      );

      this.gainNode.gain.setTargetAtTime(
        0,
        this.audioCtx.currentTime,
        this.release,
      );

      this.oscillator.stop(releaseTime);
      this.oscillator.onended = () => {
        this.oscillator.disconnect();
        this.gainNode.disconnect();
      };
    }
  }

  playNote(durationInSeconds = 0.5) {
    if (this.isStopped) {
      this.isStopped = false;

      // ADSR Envelope
      this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);

      const attackEnd = this.audioCtx.currentTime + this.attack;
      const decayEnd = attackEnd + this.decay;
      const sustainGain = this.gainValue * this.sustain;

      this.gainNode.gain.linearRampToValueAtTime(this.gainValue, attackEnd);
      this.gainNode.gain.linearRampToValueAtTime(sustainGain, decayEnd);

      // Hold the sustain level for the specified duration (D) using setTargetAtTime
      this.gainNode.gain.setTargetAtTime(
        sustainGain,
        decayEnd,
        this.getReleaseTime(),
      );

      // Stop the oscillator and disconnect after the specified duration
      const stopTime = this.audioCtx.currentTime + durationInSeconds;
      this.oscillator.stop(stopTime);
      this.gainNode.gain.cancelScheduledValues(stopTime);
      this.gainNode.gain.setTargetAtTime(0, stopTime, this.release);

      // Schedule the cleanup after the specified duration

      setTimeout(() => {
        this.oscillator.disconnect();
        this.gainNode.disconnect();
        this.isStopped = true;
      }, durationInSeconds * 1000);

      this.oscillator.start();
    }
  }
  // Calculate the release time based on the current time and the specified
  // release duration (R)
  getReleaseTime() {
    return this.audioCtx.currentTime + this.release;
  }
}

// oscillatorParams = {
//  audioCtx,
//  type: "sine" | "triangle" | "square",
//  freq: 440,
//  A: 0.1
//  D: 0.1,
//  S: 0.5,
//  R: 0.1,
//  gain: 0.5
// }
class Pendulum {
  constructor(x, y, originPoint, weight = 5, size = 5, oscillatorParams) {
    this.x = x;
    this.y = y;
    this.originPoint = originPoint;
    this._weight = 5;
    this._size = 5;

    // Use setters to apply validation for weight and size
    this.weight = weight;
    this.size = size;

    this.angle = this.calculateInitialAngle();
    this.angularVelocity = 0;
    this.audioSource = new Oscillator(oscillatorParams);
    this.audioSource.setFrequency(mapRange(this.weight, 1, 10, 200, 500));

    // Constants for our Simple Harmonic Motion model
    this.gAccel = 9.81; // gravitational acceleration (m/s^2)
    this.dampingCoeff = 0.1;
  }

  // Setter for the 'weight' property
  set weight(value) {
    // Ensure the value is within the valid range [1, 10]
    if (value < 1) {
      this._weight = 1;
    } else if (value > 10) {
      this._weight = 10;
    } else {
      this._weight = Math.round(value); // Round to the nearest integer
    }
  }

  // Getter for the 'weight' property
  get weight() {
    return this._weight;
  }

  // Setter for the 'size' property
  set size(value) {
    // Ensure the value is within the valid range [1, 10]
    if (value < 1) {
      this._size = 1;
    } else if (value > 10) {
      this._size = 10;
    } else {
      this._size = Math.round(value); // Round to the nearest integer
    }
  }

  // Getter for the 'size' property
  get size() {
    return this._size;
  }

  get length() {
    // Calculate the distance between the pendulum's origin (originPoint) and its weight (end point) given by the provided (x, y) coordinates
    const dx = this.x - this.originPoint.x;
    const dy = this.originPoint.y - this.y; // Invert the y-coordinate to adjust for Canvas's y-axis direction
    return Math.sqrt(dx ** 2 + dy ** 2);
  }

  calculateInitialAngle() {
    // Calculate the angle in radians between the positive x-axis
    // and the point (x,y) relative to the originPoint
    const dx = this.x - this.originPoint.x;
    const dy = this.originPoint.y - this.y; // Invert the y-coordinate to adjust for Canvas's y-axis direction
    return Math.atan2(dy, dx);
  }

  update(dt) {
    // Implement the physics here to update the pendulum's angle and position
    // I decided to implement a modified SHM model, that also accounts for damping and weight
    // Euler's method for numerical integration
    const alpha = -((this.g / this.length) * Math.sin(this.angle)) -
      (this.dampingCoeff / this.weight) * this.angularVelocity;

    // Update the angular velocity and angle
    this.angularVelocity += alpha * dt;
    this.angle += this.angularVelocity * dt;

    // Store the previous coordinates
    const prevX = this.x;
    const prevY = this.y;

    // Calculate the new coordinates of the pendulum's weight
    this.x = this.originPoint.x + this.length * Math.sin(this.angle);
    this.y = this.originPoint.y + this.length * Math.cos(this.angle);

    // Check if the pendulum's weight crosses the x position of the originPoint
    if (
      (prevX > this.originPoint.x && this.x <= this.originPoint.x) ||
      (prevX < this.originPoint.x && this.x >= this.originPoint.x)
    ) {
      this.audioSource.playNote(); // Trigger the audio
    }
  }
}

class Game { }

function gameLoop() { }
