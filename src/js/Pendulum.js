import AudioSource from "./AudioSource";
import { drawCircle, drawLine, mapRangeInverse } from "./utils";

export default class Pendulum {
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

    // Use setters to apply validation for weight and radius
    this.weight = weight;
    this.radius = radius;

    this.length = this.calcLength();
    this.angle = this.calcInitAngle();
    this._angularVelocity = 0;

    oscillatorsParams = oscillatorsParams.map((oscParams) => ({
      ...oscParams,
      baseFreq: mapRangeInverse(this.weight, 10, 10000, 80, 800),
    }));

    // console.info(oscillatorsParams);

    this.audioSource = new AudioSource(gameCtx, oscillatorsParams);

    // Constants for our Simple Harmonic Motion model
    // this.gAccel = 0.00015; // gravitational acceleration (m/s^2) default=9.81
    // this.dampingCoeff = 0.00005;
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

  update(dt) {
    // Implement the physics here to update the pendulum's angle and position
    // I decided to implement a modified SHM model, that also accounts for damping and weight
    // Euler's method for numerical integration
    //
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

    const checkCrossedMiddle = (this._prevX > this.gameCtx.originPoint.x &&
      this.coords.x <= this.gameCtx.originPoint.x) ||
      (this._prevX < this.gameCtx.originPoint.x &&
        this.coords.x >= this.gameCtx.originPoint.x);

    // Update the previous x position for the next iteration
    this._prevX = this.coords.x;

    // Check if the pendulum's weight crosses the x position of the originPoint
    if (checkCrossedMiddle) {
      console.info("crossed middle");
      console.info("_nActiveSounds", this.gameCtx._nActiveSounds);
      this.audioSource.playNote(0.65); // Trigger the audio
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
