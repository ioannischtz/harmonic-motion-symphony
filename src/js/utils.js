export const baseFrequencies = {
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
  B4: 493.88,
};

export const baseNotes = [
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
  "B",
];

export const oscillatorTypes = ["sine", "triangle", "square", "sawtooth"];

export function findKeyByValue(obj, targetValue) {
  for (const [key, value] of Object.entries(obj)) {
    if (value === targetValue) {
      return key;
    }
  }
  return null; // Return null if the value isn't found in the object
}

export function mapRangeInverse(
  value,
  inputMin,
  inputMax,
  outputMin,
  outputMax,
) {
  return (
    ((value - inputMax) * (outputMin - outputMax)) / (inputMax - inputMin) +
    outputMin
  );
}

export function mapRange(value, inputMin, inputMax, outputMin, outputMax) {
  return (
    ((value - inputMin) * (outputMax - outputMin)) / (inputMax - inputMin) +
    outputMin
  );
}

export function mapRangeToList(value, rangeMin, rangeMax, list) {
  if (value < rangeMin || value > rangeMax) {
    throw new Error("Value is outside the specified range");
  }

  const rangeSize = rangeMax - rangeMin;
  const valuePosition = (value - rangeMin) / rangeSize;
  const index = Math.floor(valuePosition * (list.length - 1));

  return list[index];
}

export function mapRangeInverseToList(value, rangeMin, rangeMax, list) {
  if (value < rangeMin || value > rangeMax) {
    throw new Error("Value is outside the specified range");
  }

  const rangeSize = rangeMax - rangeMin;
  const valuePosition = (value - rangeMin) / rangeSize;
  const index = Math.floor((1 - valuePosition) * (list.length - 1));

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

  const randomIndex = getRandomInt(arr.length);
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

export function drawAnimatedGlowingCircle(
  ctx,
  pointCoords,
  radius,
  color,
  glowColor,
  animationDuration,
) {
  let animationStartTime;
  const maxGlowValue = 20; // Maximum shadow blur value for glowing effect

  function startGlowAnimation() {
    animationStartTime = performance.now();
    requestAnimationFrame((timestamp) =>
      updateGlowAnimation(timestamp, pointCoords)
    );
  }

  function updateGlowAnimation(timestamp, pointCoords) {
    const elapsedTime = timestamp - animationStartTime;
    const animationProgress = Math.min(elapsedTime / animationDuration, 1); // Ensure it's between 0 and 1
    const currentGlowValue = animationProgress * maxGlowValue;

    drawCircleWithGlow(
      ctx,
      pointCoords,
      radius,
      color,
      glowColor,
      currentGlowValue,
    );

    if (animationProgress < 1) {
      requestAnimationFrame(updateGlowAnimation);
    }
  }

  startGlowAnimation();
}

export function drawCircleWithGlow(
  ctx,
  pointCoords,
  radius,
  fillColor,
  glowColor,
  glowValue,
) {
  const x = pointCoords.x;
  const y = pointCoords.y;

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
  const endX = startX + length;
  const endY = startY;
  const slantedLineCount = Math.floor(length / 20); // Adjust the divisor for the desired number of slanted lines
  const slantedLineSpacing = length / (slantedLineCount + 1);
  // const slantedLineLength = 10;
  const slantedLineLength = slantedLineSpacing * Math.sqrt(2);
  const slantedLineAngle = 60; // Angle of the slanted lines in degrees

  drawLine(
    ctx,
    { x: startX, y: startY },
    { x: endX, y: endY },
    color,
    lineWidth,
  );
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

  for (let i = 1; i <= slantedLineCount; i++) {
    const slantedStartX = startX + i * slantedLineSpacing;
    const slantedStartY = startY;
    const slantedEndX = slantedStartX +
      slantedLineLength * Math.cos(degToRad(slantedLineAngle));
    const slantedEndY = startY -
      slantedLineLength * Math.sin(degToRad(slantedLineAngle));
    drawLine(
      ctx,
      { x: slantedStartX, y: slantedStartY },
      { x: slantedEndX, y: slantedEndY },
      color,
      lineWidth,
    );
  }
}

// Function to convert degrees to radians
export function degToRad(degrees) {
  return (degrees * Math.PI) / 180;
}
