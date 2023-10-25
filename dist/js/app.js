import Game from "./Logic/Game";
import GUI from "./GUI/GUI";
function main() {
    var canvasId = "canvas";
    var canvasParams = {
        canvasId: canvasId,
        width: window.innerWidth - 32,
        height: window.innerHeight - 32
    };
    var fpsCap = 60;
    var simCoeffs = {
        gAccel: 0.00015,
        dampingCoeff: 0.00005
    };
    // We cannot supply an audioCtx without user interaction. audioCtx will be set later, on user click
    var game = new Game(canvasParams, null, fpsCap, simCoeffs);
    var gui = new GUI(game, canvasParams);
    console.info(gui);
}
if (document.readyState === "loading") {
    // Loading hasn't finished yet
    document.addEventListener("DOMContentLoaded", main);
} else {
    // `DOMContentLoaded` has already fired
    main();
}
