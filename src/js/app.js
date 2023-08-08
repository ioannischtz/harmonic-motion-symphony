import Game from "./Logic/Game";
import GUI from "./GUI/GUI";

function main() {
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

  // We cannot supply an audioCtx without user interaction. audioCtx will be set later, on user click
  const game = new Game(canvasParams, null, fpsCap, simCoeffs);

  const gui = new GUI(game, canvasParams);
  console.info(gui);
}

if (document.readyState === "loading") {
  // Loading hasn't finished yet
  document.addEventListener("DOMContentLoaded", main);
} else {
  // `DOMContentLoaded` has already fired
  main();
}
