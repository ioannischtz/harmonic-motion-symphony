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
var RingBuffer = /*#__PURE__*/ function() {
    "use strict";
    function RingBuffer(capacity) {
        _class_call_check(this, RingBuffer);
        this.capacity = capacity;
        this.buffer = new Array(capacity);
        this.head = 0; // Newest entry
        this.tail = 0; // Oldest entry
        this.size = 0; // Number of entries currently in the buffer
    }
    _create_class(RingBuffer, [
        {
            // reverse style to feel more like a stack, since it makes
            // more sense for our use case of keeping a history of states
            key: "push",
            value: function push(newEntry) {
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
        },
        {
            key: "pop",
            value: function pop() {
                if (this.size > 0) {
                    // Pop the oldest entry from the index specified by `tail`
                    var entry = this.buffer[this.tail];
                    this.tail = (this.tail + 1) % this.capacity;
                    this.size--;
                    return entry;
                }
                return null;
            }
        },
        {
            key: "getLast",
            value: function getLast() {
                if (this.size > 0) {
                    // Access the latest entry using the index specified by `head`
                    return this.buffer[this.head === 0 ? this.capacity - 1 : this.head - 1];
                }
                return null;
            }
        },
        {
            key: "getLastIndex",
            value: function getLastIndex() {
                if (this.size > 0) {
                    // Access the latest entry using the index specified by `head`
                    return this.head === 0 ? this.capacity - 1 : this.head - 1;
                }
                return null;
            }
        },
        {
            key: "getSecondToLast",
            value: function getSecondToLast() {
                if (this.size > 1) {
                    // Access the second-to-latest entry using the index specified by `head`
                    return this.buffer[this.head === 1 ? this.capacity - 1 : this.head - 2];
                }
                return null;
            }
        },
        {
            key: "getSecondToLastIndex",
            value: function getSecondToLastIndex() {
                if (this.size > 1) {
                    // Access the second-to-latest entry using the index specified by `head`
                    return this.head === 1 ? this.capacity - 1 : this.head - 2;
                }
                return null;
            }
        },
        {
            key: "clear",
            value: function clear() {
                this.buffer = new Array(this.capacity);
                this.head = 0;
                this.tail = 0;
                this.size = 0;
            }
        }
    ]);
    return RingBuffer;
}();
export { RingBuffer as default };
