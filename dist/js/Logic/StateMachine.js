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
import RingBuffer from "./RingBuffer";
var StateMachine = /*#__PURE__*/ function() {
    "use strict";
    function StateMachine(initialState, STATES_TO_SAVE, actions) {
        _class_call_check(this, StateMachine);
        this.current = initialState;
        this.STATES = STATES_TO_SAVE;
        this.history = new RingBuffer(5);
        this.actions = actions;
        console.info("this.STATES_TO_SAVE", this.STATES);
    }
    _create_class(StateMachine, [
        {
            key: "transitionTo",
            value: function transitionTo(newState) {
                console.info("newState = ", newState);
                if (this.STATES.hasOwnProperty(this.current) && this.STATES.hasOwnProperty(newState) && newState !== this.current) {
                    // Only keep history of the states in the STATES obj
                    // and don't save the same state change twice in a row
                    this.history.push(this.current);
                }
                this.current = newState;
                console.info("Transitioned to state: ".concat(newState));
                console.info("State history: ".concat(this.history.buffer));
                console.info("State history head:".concat(this.history.head, ", tail:").concat(this.history.tail));
            }
        }
    ]);
    return StateMachine;
}();
export { StateMachine as default };
