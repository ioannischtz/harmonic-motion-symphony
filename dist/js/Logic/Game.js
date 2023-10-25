function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
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
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
import Pendulum from "./Pendulum";
import GameEventEmitter from "./GameEventEmitter";
import { baseFrequencies, drawCeiling } from "../utils";
import StateMachine from "./StateMachine";
var Game = /*#__PURE__*/ function() {
    "use strict";
    function Game(canvasParams, audioCtx, fpsCap, simCoeffs) {
        _class_call_check(this, Game);
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
            EDITING: "EDITING"
        };
        this.GAME_STATES = {
            MENU: "MENU",
            PLAYING: "PLAYING",
            EDITING: "EDITING",
            SETTINGS: "SETTINGS"
        };
        this.initialState = this.GAME_STATES.MENU;
        this.actions = {
            newGame: this.newGame.bind(this),
            play: this.play.bind(this),
            edit: this.edit.bind(this),
            openMenu: this.openMenu.bind(this),
            openSettings: this.openSettings.bind(this),
            closeSettings: this.closeSettings.bind(this),
            reset: this.reset.bind(this)
        };
        this.StateMachine = new StateMachine(this.initialState, this.GAME_STATES_WITH_HISTORY, this.actions);
        // Set the origin-point to the top center of the canvas for simplicity
        this.originPoint = {
            x: this.canvas.width / 2,
            y: 100
        };
        this.selectedPendulum = null;
        this._nActiveSounds = 0;
        this._nActiveSoundsLock = Promise.resolve(); // Initialize with a resolved Promise (no lock)
        // Setup event listeners for user interactions
        this._setupEventListeners();
        // Start the game-loop
        this._loop();
    }
    _create_class(Game, [
        {
            key: "emitStateChangeEvent",
            value: function emitStateChangeEvent() {
                this.eventEmitter.emit("gameStateChange", {
                    state: this.StateMachine.current,
                    stateHistory: this.StateMachine.history.buffer
                });
            }
        },
        {
            key: "getGameCtx",
            value: function getGameCtx() {
                // Game Context:
                var gameCtx = {
                    canvasCtx: this.canvasCtx,
                    audioCtx: this.audioCtx,
                    originPoint: this.originPoint,
                    simCoeffs: this.simCoeffs,
                    _nActiveSounds: this._nActiveSounds,
                    incrActiveSoundsCounterCallback: this._incrementActiveSounds,
                    decrActiveSoundsCounterCallback: this._decrementActiveSounds,
                    StateObj: {
                        state: this.StateMachine.current,
                        stateHistory: this.StateMachine.history.buffer
                    },
                    eventEmitter: this.eventEmitter
                };
                return gameCtx;
            }
        },
        {
            key: "newGame",
            value: function newGame() {
                this.reset();
                var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                this.audioCtx = audioCtx;
                var nPendulums = 1;
                var oscillatorTypes = [
                    "sine",
                    "square",
                    "sawtooth",
                    "triangle"
                ];
                var oscillatorsParams = [
                    {
                        type: oscillatorTypes[0],
                        gain: 0.7,
                        baseFreq: baseFrequencies["A2"],
                        adsr: [
                            0.05,
                            0.05,
                            0.2,
                            0.1
                        ],
                        detune: 0
                    }
                ];
                for(var i = 0; i < nPendulums; i++){
                    this.addPendulum({
                        x: this.originPoint.x,
                        y: this.originPoint.y + 400
                    }, 1000, 25, oscillatorsParams);
                }
                this.edit();
            }
        },
        {
            key: "play",
            value: function play() {
                this.StateMachine.transitionTo(this.GAME_STATES.PLAYING);
                this.emitStateChangeEvent();
                console.info("Enter Playing Mode");
            }
        },
        {
            key: "edit",
            value: function edit() {
                this.StateMachine.transitionTo(this.GAME_STATES.EDITING);
                this.emitStateChangeEvent();
                console.info("Enter Editing Mode");
            }
        },
        {
            key: "reset",
            value: function reset() {
                this.fpsCap = 60;
                this.pendulums.forEach(function(pendulum) {
                    return pendulum.audioSource.stop();
                });
                this.pendulums = [];
                this.simCoeffs = {
                    gAccel: 0.00015,
                    dampingCoeff: 0.00005
                };
                this._nActiveSounds = 0;
                this._nActiveSoundsLock = Promise.resolve();
            }
        },
        {
            key: "openMenu",
            value: function openMenu() {
                this.StateMachine.transitionTo(this.GAME_STATES.MENU);
                this.emitStateChangeEvent();
                console.info("Open Menu");
            }
        },
        {
            key: "openSettings",
            value: function openSettings() {
                this.StateMachine.transitionTo(this.GAME_STATES.SETTINGS);
                this.emitStateChangeEvent();
                console.info("Open settings");
            }
        },
        {
            key: "closeSettings",
            value: function closeSettings() {
                this.openMenu();
                console.info("Close settings and return to main menu");
            }
        },
        {
            key: "_incrementActiveSounds",
            value: function _incrementActiveSounds() {
                var _this = this;
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                // Use async/await to ensure synchronization
                                return [
                                    4,
                                    _this._nActiveSoundsLock
                                ];
                            case 1:
                                _state.sent();
                                console.info("_increment");
                                _this._nActiveSounds++;
                                _this._nActiveSoundsLock = Promise.resolve(); // Release the lock
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "_decrementActiveSounds",
            value: function _decrementActiveSounds() {
                var _this = this;
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                // Use async/await to ensure synchronization
                                return [
                                    4,
                                    _this._nActiveSoundsLock
                                ];
                            case 1:
                                _state.sent();
                                console.info("_decrement");
                                _this._nActiveSounds--;
                                // Ensure the count doesn't go negative
                                _this._nActiveSounds = Math.max(0, _this._nActiveSounds);
                                _this._nActiveSoundsLock = Promise.resolve(); // Release the lock
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "_setupEventListeners",
            value: function _setupEventListeners() {}
        },
        {
            key: "addPendulum",
            value: function addPendulum(coords, weight, radius, oscillatorsParams) {
                // Game Context:
                var gameCtx = this.getGameCtx();
                // Create a new pendulum and add it to the game's pendulums array
                var pendulum = new Pendulum(gameCtx, coords, weight, radius, oscillatorsParams);
                this.pendulums.push(pendulum);
            }
        },
        {
            key: "removePendulum",
            value: function removePendulum() {
                var removedPendulum = this.pendulums.splice(this.selectedPendulum, this.selectedPendulum);
                removedPendulum[0].audioSource.stop();
            }
        },
        {
            key: "_update",
            value: function _update(dt) {
                // Update the game state based on the elapsed delta time (dt)
                if (this.StateMachine.current === this.GAME_STATES.PLAYING) {
                    this.pendulums.forEach(function(pendulum) {
                        pendulum.update(dt);
                    });
                }
            }
        },
        {
            key: "_render",
            value: function _render() {
                // Clear the canvas and draw the pendulums
                this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                // Draw the ceiling line
                drawCeiling(this.canvasCtx, 400, this.originPoint.x - 200, this.originPoint.y, "black", 1);
                this.pendulums.forEach(function(pendulum) {
                    // Draw the pendulum on the canvas
                    // Implement the rendering of the pendulum's weight and rod
                    pendulum.render();
                });
            }
        },
        {
            key: "_loop",
            value: function _loop() {
                var _this = this;
                var then = performance.now();
                var interval = 1000 / this.fpsCap;
                var delta = 0;
                var updateAndRender = function(now) {
                    requestAnimationFrame(updateAndRender);
                    delta = now - then;
                    interval = 1000 / _this.fpsCap;
                    if (delta >= interval) {
                        then = now - delta % interval;
                        // Update and render the game
                        _this._update(delta);
                        _this._render();
                    }
                };
                requestAnimationFrame(updateAndRender);
            }
        }
    ]);
    return Game;
}();
export { Game as default };
