import RingBuffer from "./RingBuffer";

export default class StateMachine {
  constructor(initialState, STATES_TO_SAVE, actions) {
    this.current = initialState;
    this.STATES = STATES_TO_SAVE;
    this.history = new RingBuffer(5);
    this.actions = actions;

    console.info("this.STATES_TO_SAVE", this.STATES);
  }

  transitionTo(newState) {
    console.group("StateMachine transitionTo: ");
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
    console.groupEnd();
  }
}
