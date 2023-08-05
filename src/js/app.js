import Game from "./Game";
import { getRandomElementFromArray, getRandomInt } from "./utils";

function main() {
  console.info("DOM loaded");

  // Create the game when the user clicks the "START" button
  const startBtn = document.getElementById("start-button");
  startBtn.addEventListener("click", () => {
    // Create the AudioContext after the button click
    //
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const canvasId = "canvas";
    const game = new Game(canvasId, audioCtx);

    // const oscillatorTypes = ["sine"];
    const oscillatorTypes = ["sine", "square", "sawtooth", "triangle"];

    for (let i = 0; i < getRandomInt(0); i++) {
      game.addPendulum(
        game,
        game.originPoint.x + getRandomInt(600),
        game.originPoint.y + getRandomInt(600),
        getRandomInt(10000),
        getRandomInt(100),
        {
          audioCtx: game.audioCtx,
          type: getRandomElementFromArray(oscillatorTypes),
          gain: 1.0,
        },
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
