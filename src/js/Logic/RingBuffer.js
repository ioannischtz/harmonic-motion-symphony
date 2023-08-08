export default class RingBuffer {
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
