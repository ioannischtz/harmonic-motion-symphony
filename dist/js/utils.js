function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
export var baseFrequencies = {
    // Octave 2
    C2: 65.41,
    "C#2": 69.3,
    Db2: 69.3,
    D2: 73.42,
    "D#2": 77.78,
    Eb2: 77.78,
    E2: 82.41,
    F2: 87.31,
    "F#2": 92.5,
    Gb2: 92.5,
    G2: 98.0,
    "G#2": 103.83,
    Ab2: 103.83,
    A2: 110.0,
    "A#2": 116.54,
    Bb2: 116.54,
    B2: 123.47,
    // Octave 3
    C3: 130.81,
    "C#3": 138.59,
    Db3: 138.59,
    D3: 146.83,
    "D#3": 155.56,
    Eb3: 155.56,
    E3: 164.81,
    F3: 174.61,
    "F#3": 185.0,
    Gb3: 185.0,
    G3: 196.0,
    "G#3": 207.65,
    Ab3: 207.65,
    A3: 220.0,
    "A#3": 233.08,
    Bb3: 233.08,
    B3: 246.94,
    // Octave 4
    C4: 261.63,
    "C#4": 277.18,
    Db4: 277.18,
    D4: 293.66,
    "D#4": 311.13,
    Eb4: 311.13,
    E4: 329.63,
    F4: 349.23,
    "F#4": 369.99,
    Gb4: 369.99,
    G4: 392.0,
    "G#4": 415.3,
    Ab4: 415.3,
    A4: 440.0,
    "A#4": 466.16,
    Bb4: 466.16,
    B4: 493.88
};
export var baseNotes = [
    "C",
    "C#",
    "Db",
    "D",
    "D#",
    "Eb",
    "E",
    "F",
    "F#",
    "Gb",
    "G",
    "G#",
    "Ab",
    "A",
    "A#",
    "Bb",
    "B"
];
export var oscillatorTypes = [
    "sine",
    "triangle",
    "square",
    "sawtooth"
];
export function findKeyByValue(obj, targetValue) {
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = Object.entries(obj)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var _step_value = _sliced_to_array(_step.value, 2), key = _step_value[0], value = _step_value[1];
            if (value === targetValue) {
                return key;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    return null; // Return null if the value isn't found in the object
}
export function mapRangeInverse(value, inputMin, inputMax, outputMin, outputMax) {
    return (value - inputMax) * (outputMin - outputMax) / (inputMax - inputMin) + outputMin;
}
export function mapRange(value, inputMin, inputMax, outputMin, outputMax) {
    return (value - inputMin) * (outputMax - outputMin) / (inputMax - inputMin) + outputMin;
}
export function mapRangeToList(value, rangeMin, rangeMax, list) {
    if (value < rangeMin || value > rangeMax) {
        throw new Error("Value is outside the specified range");
    }
    var rangeSize = rangeMax - rangeMin;
    var valuePosition = (value - rangeMin) / rangeSize;
    var index = Math.floor(valuePosition * (list.length - 1));
    return list[index];
}
export function mapRangeInverseToList(value, rangeMin, rangeMax, list) {
    if (value < rangeMin || value > rangeMax) {
        throw new Error("Value is outside the specified range");
    }
    var rangeSize = rangeMax - rangeMin;
    var valuePosition = (value - rangeMin) / rangeSize;
    var index = Math.floor((1 - valuePosition) * (list.length - 1));
    return list[index];
}
export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
export function getRandomElementFromArray(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
        // If the input is not an array or if it's an empty array, return null or handle the error as per your requirement.
        return null;
    }
    var randomIndex = getRandomInt(arr.length);
    return arr[randomIndex];
}
export function drawLine(ctx, startPoint, endPoint, color, thickness) {
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.stroke();
}
export function drawRect(ctx, pointCoords, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(pointCoords.x, pointCoords.y, width, height);
}
export function drawCircle(ctx, pointCoords, radius, color, thickness) {
    ctx.beginPath();
    ctx.arc(pointCoords.x, pointCoords.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.stroke();
}
export function drawAnimatedGlowingCircle(ctx, pointCoords, radius, color, glowColor, animationDuration) {
    var startGlowAnimation = function startGlowAnimation() {
        animationStartTime = performance.now();
        requestAnimationFrame(function(timestamp) {
            return updateGlowAnimation(timestamp, pointCoords);
        });
    };
    var animationStartTime;
    var maxGlowValue = 20; // Maximum shadow blur value for glowing effect
    function updateGlowAnimation(timestamp, pointCoords) {
        var elapsedTime = timestamp - animationStartTime;
        var animationProgress = Math.min(elapsedTime / animationDuration, 1); // Ensure it's between 0 and 1
        var currentGlowValue = animationProgress * maxGlowValue;
        drawCircleWithGlow(ctx, pointCoords, radius, color, glowColor, currentGlowValue);
        if (animationProgress < 1) {
            requestAnimationFrame(updateGlowAnimation);
        }
    }
    startGlowAnimation();
}
export function drawCircleWithGlow(ctx, pointCoords, radius, fillColor, glowColor, glowValue) {
    var x = pointCoords.x;
    var y = pointCoords.y;
    // ctx.save();
    // Set the glowing effect with the specified shadowBlur value
    ctx.shadowBlur = glowValue;
    ctx.shadowColor = glowColor;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = fillColor;
    ctx.fill();
// ctx.restore();
}
export function drawCeiling(ctx, length, startX, startY, color, lineWidth) {
    var endX = startX + length;
    var endY = startY;
    var slantedLineCount = Math.floor(length / 20); // Adjust the divisor for the desired number of slanted lines
    var slantedLineSpacing = length / (slantedLineCount + 1);
    // const slantedLineLength = 10;
    var slantedLineLength = slantedLineSpacing * Math.sqrt(2);
    var slantedLineAngle = 60; // Angle of the slanted lines in degrees
    drawLine(ctx, {
        x: startX,
        y: startY
    }, {
        x: endX,
        y: endY
    }, color, lineWidth);
    // Alternative style
    // for (let i = 1; i <= slantedLineCount; i++) {
    //   const slantedStartX = startX + i * slantedLineSpacing;
    //   const slantedStartY = startY - i * (lineWidth * 2); // Adjust the value for proper slanting
    //   drawLine(
    //     ctx,
    //     { x: slantedStartX, y: slantedStartY },
    //     { x: slantedStartX, y: startY },
    //     color,
    //     lineWidth,
    //   );
    // }
    for(var i = 1; i <= slantedLineCount; i++){
        var slantedStartX = startX + i * slantedLineSpacing;
        var slantedStartY = startY;
        var slantedEndX = slantedStartX + slantedLineLength * Math.cos(degToRad(slantedLineAngle));
        var slantedEndY = startY - slantedLineLength * Math.sin(degToRad(slantedLineAngle));
        drawLine(ctx, {
            x: slantedStartX,
            y: slantedStartY
        }, {
            x: slantedEndX,
            y: slantedEndY
        }, color, lineWidth);
    }
}
// Function to convert degrees to radians
export function degToRad(degrees) {
    return degrees * Math.PI / 180;
}
