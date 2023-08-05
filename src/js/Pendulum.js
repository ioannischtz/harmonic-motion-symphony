import Oscillator from "./Oscillator";
import { drawCircle, drawLine, mapRangeInverse } from "./utils";

export default class Pendulum {
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

    oscillatorParams.gameInstance = this.gameInstance;
    oscillatorParams.freq = mapRangeInverse(this.weight, 1, 10000, 80, 800);

    this.audioSource = new Oscillator(oscillatorParams);
    console.info("this.audioSource.oscillator", this.audioSource.oscillator);

    // Constants for our Simple Harmonic Motion model
    this.gAccel = 0.00015; // gravitational acceleration (m/s^2) default=9.81
    this.dampingCoeff = 0.00005;
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
