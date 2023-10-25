function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
import AudioSource from "./AudioSource";
import { baseFrequencies, drawAnimatedGlowingCircle, drawCircle, drawLine, mapRangeInverse, mapRangeInverseToList } from "../utils";
var Pendulum = /*#__PURE__*/ function() {
    "use strict";
    function Pendulum(gameCtx, coords) {
        var weight = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 5, radius = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 5, oscillatorsParams = arguments.length > 4 ? arguments[4] : void 0;
        var _this = this;
        _class_call_check(this, Pendulum);
        this.gameCtx = gameCtx;
        this.coords = coords;
        this._prevX = coords.x;
        this._weight = 5;
        this._radius = 5;
        this.rodColor = getComputedStyle(document.documentElement).getPropertyValue("--primary-dark");
        this.weightColor = getComputedStyle(document.documentElement).getPropertyValue("--accent");
        this.glowColor = "red";
        // Use setters to apply validation for weight and radius
        this.weight = weight;
        this.radius = radius;
        this.length = this.calcLength();
        this.angle = this.calcInitAngle();
        this._angularVelocity = 0;
        this.checkCrossedMiddle = false;
        this.oscillatorsParams = oscillatorsParams.map(function(oscParams) {
            return _object_spread_props(_object_spread({}, oscParams), {
                baseFreq: mapRangeInverseToList(_this.weight, 10, 10000, Object.values(baseFrequencies))
            });
        });
        // console.info(oscillatorsParams);
        this.audioSource = new AudioSource(gameCtx, this.oscillatorsParams);
        // Constants for our Simple Harmonic Motion model
        // this.gAccel = 0.00015; // gravitational acceleration (m/s^2) default=9.81
        // this.dampingCoeff = 0.00005;
        this._setupEventListeners();
    }
    _create_class(Pendulum, [
        {
            key: "weight",
            get: // Getter for the 'weight' property
            function get() {
                return this._weight;
            },
            set: // Setter for the 'weight' property
            function set(value) {
                // Ensure the value is within the valid range [10, 10000]
                if (value < 10) {
                    this._weight = 10;
                } else if (value > 10000) {
                    this._weight = 10000;
                } else {
                    this._weight = Math.round(value); // Round to the nearest integer
                }
            }
        },
        {
            key: "radius",
            get: // Getter for the 'radius' property
            function get() {
                return this._radius;
            },
            set: // Setter for the 'radius' property
            function set(value) {
                // Ensure the value is within the valid range [1, 10]
                if (value < 5) {
                    this._radius = 5;
                } else if (value > 100) {
                    this._radius = 100;
                } else {
                    this._radius = Math.round(value); // Round to the nearest integer
                }
            }
        },
        {
            // Calculate the distance between the pendulum's origin (originPoint) and its weight (end point) given by the provided (x, y) coordinates
            key: "calcLength",
            value: function calcLength() {
                var dx = this.coords.x - this.gameCtx.originPoint.x;
                var dy = this.coords.y - this.gameCtx.originPoint.y;
                return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            }
        },
        {
            key: "calcInitAngle",
            value: function calcInitAngle() {
                var dx = this.coords.x - this.gameCtx.originPoint.x;
                var dy = -(this.coords.y - this.gameCtx.originPoint.y);
                // Adjust the angle based on the offset position
                // We'll use Math.PI/2 to rotate the pendulum 90 degrees counterclockwise
                // return Math.atan2(dy, dx);
                return Math.atan2(dy, dx) + Math.PI / 2;
            }
        },
        {
            key: "_setupEventListeners",
            value: function _setupEventListeners() {
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
        },
        {
            key: "update",
            value: function update(dt) {
                // Implement the physics here to update the pendulum's angle and position
                // I decided to implement a modified SHM model, that also accounts for damping and weight
                // Euler's method for numerical integration
                //
                // Don't go over the `y` ceiling
                if (this.coords.y < this.gameCtx.originPoint.y) {
                    this.coords.y = this.gameCtx.originPoint.y;
                }
                var alpha = -(this.gameCtx.simCoeffs.gAccel / this.length * Math.sin(this.angle)) - this.gameCtx.simCoeffs.dampingCoeff / this.weight * this._angularVelocity;
                // Update the angular velocity and angle
                this._angularVelocity += alpha * dt;
                this.angle += this._angularVelocity * dt;
                // Calculate the new coordinates of the pendulum's weight
                this.coords.x = this.gameCtx.originPoint.x + this.length * Math.sin(this.angle);
                this.coords.y = this.gameCtx.originPoint.y + this.length * Math.cos(this.angle); // Invert the y-coordinate
                this.checkCrossedMiddle = this._prevX > this.gameCtx.originPoint.x && this.coords.x <= this.gameCtx.originPoint.x || this._prevX < this.gameCtx.originPoint.x && this.coords.x >= this.gameCtx.originPoint.x;
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
        },
        {
            key: "render",
            value: function render() {
                drawLine(this.gameCtx.canvasCtx, this.gameCtx.originPoint, {
                    x: this.coords.x,
                    y: this.coords.y
                }, this.rodColor, 4);
                drawCircle(this.gameCtx.canvasCtx, {
                    x: this.coords.x,
                    y: this.coords.y
                }, this.radius, this.weightColor, 6);
            }
        }
    ]);
    return Pendulum;
}();
export { Pendulum as default };
