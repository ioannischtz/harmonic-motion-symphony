import Game from "./Game";
import {
  baseFrequencies,
  getRandomElementFromArray,
  getRandomInt,
} from "./utils";

function main() {
  console.info("DOM loaded");

  // Create the game when the user clicks the "START" button
  const startBtn = document.getElementById("start-button");
  startBtn.addEventListener("click", () => {
    // Create the AudioContext after the button click
    //
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const canvasId = "canvas";
    const canvasParams = {
      canvasId,
      width: window.innerWidth - 32,
      height: window.innerHeight - 32,
    };
    const fpsCap = 60;
    const simCoeffs = {
      gAccel: 0.00015,
      dampingCoeff: 0.00005,
    };
    const game = new Game(canvasParams, audioCtx, fpsCap, simCoeffs);

    // const oscillatorTypes = ["sine"];
    const oscillatorTypes = ["sine", "square", "sawtooth", "triangle"];
    const oscillatorsParams = [
      {
        type: getRandomElementFromArray(oscillatorTypes),
        gain: 0.7,
        baseFreq: baseFrequencies["A2"],
        adsr: [0.05, 0.05, 0.2, 0.1],
        detune: 0,
      },
      {
        type: getRandomElementFromArray(oscillatorTypes),
        gain: 0.3,
        baseFreq: baseFrequencies["A2"],
        adsr: [0.05, 0.05, 0.2, 0.1],
        detune: 100, // 100 cents = 1 semitone
      },
    ];

    for (let i = 0; i < 1; i++) {
      game.addPendulum(
        {
          x: game.originPoint.x + getRandomInt(600),
          y: game.originPoint.y + getRandomInt(600),
        },
        getRandomInt(10000),
        getRandomInt(100),
        oscillatorsParams,
      );
    }
  });
}

if (document.readyState === "loading") {
  // Loading hasn't finished yet
  document.addEventListener("DOMContentLoaded", main);
} else {
  // `DOMContentLoaded` has already fired
  main();
}
