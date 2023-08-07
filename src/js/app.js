import Game from "./Game";
import { baseFrequencies, oscillatorTypes } from "./utils";

function main() {
  console.info("DOM loaded");

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
  // Get the elements
  //
  const canvas = document.getElementById("canvas");

  // menu buttons
  const newGameBtn = document.getElementById("new-game-button");
  const resumeBtn = document.getElementById("resume-button");
  const resetButton = document.getElementById("reset-button");
  const settingsButton = document.getElementById("settings-button");

  // overlays
  const menuOverlay = document.getElementById("menuOverlay");
  const editingOverlay = document.getElementById("editingOverlay");
  const playingOverlay = document.getElementById("playingOverlay");
  const keysHintOverlay = document.getElementById("keysHintOverlay");

  // add pendulum gui
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");
  const weightInput = document.getElementById("weightInput");
  const radiusInput = document.getElementById("radiusInput");
  const coordX = document.getElementById("xCoordinateInput");
  const coordY = document.getElementById("yCoordinateInput");
  const audioSourceGui = document.getElementById("audioSourceGui");
  const typeSelect = document.getElementById("typeSelect");
  const baseFrequencySelect = document.getElementById("baseFrequencySelect");
  const gainInput = document.getElementById("gainInput");
  const aInput = document.getElementById("aInput");
  const dInput = document.getElementById("dInput");
  const sInput = document.getElementById("sInput");
  const rInput = document.getElementById("rInput");
  const detuneInput = document.getElementById("detuneInput");
  const addOscillatorButton = document.getElementById("addOscillatorButton");
  const oscillatorCountLabel = document.getElementById("oscillatorCountLabel");
  const addPendulumBtn = document.getElementById("add-pendulum-button");

  menuOverlay.style.display = "flex";
  editingOverlay.style.display = "none";
  playingOverlay.style.display = "none";
  keysHintOverlay.style.display = "flex";
  resumeBtn.style.display = "none";

  // JavaScript for tab-menu functionality

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabName = button.dataset.tab;

      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      button.classList.add("active");
      document.getElementById(tabName).classList.add("active");
    });
  });

  const oscillatorsParams = [];

  // Dynamically populate the baseFrequencySelect options from the baseFrequencies object
  for (const note in baseFrequencies) {
    const option = document.createElement("option");
    option.value = baseFrequencies[note];
    option.text = note;
    baseFrequencySelect.appendChild(option);
  }

  // Dynamically populate the type options from the oscillatorTypes
  for (const oscType of oscillatorTypes) {
    const option = document.createElement("option");
    option.value = oscillatorTypes[oscType];
    option.text = oscType;
    typeSelect.appendChild(option);
  }

  // We cannot supply an audioCtx without user interaction. audioCtx will be set later, on user click
  const game = new Game(canvasParams, null, fpsCap, simCoeffs);

  function resume(game) {
    menuOverlay.style.display = "none";
    if (game.gameState.prev === game.GAME_STATES.PLAYING) {
      game.play();
    } else if (game.gameState.prev === game.GAME_STATES.EDITING) {
      game.edit();
    }
  }

  // Function to update the keys-hint content
  function updateKeysHint(gameState, GAME_STATES) {
    const keysHint = document.getElementById("keysHint");
    keysHint.innerHTML = `
    <p><kbd>Esc</kbd> ${
      gameState.curr === GAME_STATES.MENU ? "close" : "open"
    } the menu</p>
    <p><kbd>Space</kbd> switch to ${
      gameState.curr === GAME_STATES.EDITING ? "playing" : "editing"
    } mode</p>
  `;
  }

  function handleKeyPress(event) {
    if (event.key === "Escape" || event.key == "Esc") {
      // If the game just loaded, pressing `ESC` shouldn't have any effec
      if (game.gameState.curr === game.gameState.prev) return;
      // Pressing `ESC` key will toggle the menu overlay
      if (game.gameState.curr === game.GAME_STATES.MENU) {
        menuOverlay.style.display = "none";
        if (game.gameState.prev === game.GAME_STATES.PLAYING) {
          game.play();
        } else if (game.gameState.prev === game.GAME_STATES.EDITING) {
          game.edit();
        }
      } else {
        game.openMenu();
        menuOverlay.style.display = "flex";
      }
    } else if (event.key === " ") {
      // Pressing `SPACE` key will toggle between editing and playing mode
      if (game.gameState.curr === game.GAME_STATES.EDITING) {
        game.play();
        playingOverlay.style.display = "flex";
        editingOverlay.style.display = "none";
        console.info("Resume playing from editing");
      } else if (game.gameState.curr === game.GAME_STATES.PLAYING) {
        game.edit();
        playingOverlay.style.display = "none";
        editingOverlay.style.display = "flex";

        console.info("Enter Editing Mode");
      }
      // If the game is in MENU or SETTINGS state, pressing SPACE shouldn't
      // have any effect.
    }

    // After handling the gameState changes, update the keys-hint
    updateKeysHint(game.gameState, game.GAME_STATES);
  }

  function handleCanvasClick(event) {
    console.info("Canvas Clicked");
    const canvasRect = canvas.getBoundingClientRect();
    const offsetX = event.clientX - canvasRect.left;
    const offsetY = event.clientY - canvasRect.top;

    // Now you have the coordinates offsetX and offsetY
    // You can use these values to update the input fields for x and y coordinates
    const xCoordinateInput = document.getElementById("xCoordinateInput");
    const yCoordinateInput = document.getElementById("yCoordinateInput");

    // Set the input values based on the click coordinates
    xCoordinateInput.value = offsetX;
    yCoordinateInput.value = offsetY;
  }

  function handleAddOscillatorBtnClick() {
    const A = parseFloat(aInput.value);
    const D = parseFloat(dInput.value);
    const S = parseFloat(sInput.value);
    const R = parseFloat(rInput.value);
    const adsr = [A, D, S, R];
    const oscillatorParams = {
      type: typeSelect.value,
      baseFrequency: parseFloat(baseFrequencySelect.value),
      gain: parseFloat(gainInput.value),
      adsr,
      detune: parseInt(detuneInput.value),
    };

    // Store the oscillatorParams object in the oscillatorsParams array
    oscillatorsParams.push(oscillatorParams);

    // Update the oscillatorCountLabel to show the number of oscillators added
    oscillatorCountLabel.textContent =
      `Number of Oscillators: ${oscillatorsParams.length}`;
  }

  function handleAddPendulumBtnClick() {
    const weightValue = parseInt(weightInput.value);
    const radiusValue = parseInt(radiusInput.value);
    const coordXval = parseInt(coordX.value);
    const coordYval = parseInt(coordY.value);
    game.addPendulum(
      { x: coordXval, y: coordYval },
      weightValue,
      radiusValue,
      oscillatorsParams,
    );
    oscillatorsParams.length = 0;
    // Update the oscillatorCountLabel to show the number of oscillators added
    oscillatorCountLabel.textContent =
      `Number of Oscillators: ${oscillatorsParams.length}`;
  }

  // Initial update to set the keys-hint
  updateKeysHint(game.gameState, game.GAME_STATES);

  document.addEventListener("keydown", handleKeyPress);

  canvas.addEventListener("click", handleCanvasClick);

  newGameBtn.addEventListener("click", () => {
    newGameBtn.style.display = "none";
    resumeBtn.style.display = "block";

    // hide the game menu
    menuOverlay.style.display = "none";
    editingOverlay.style.display = "flex";
    playingOverlay.style.display = "none";

    game.newGame();
  });

  resumeBtn.addEventListener("click", () => {
    resume(game);
  });

  resetButton.addEventListener("click", () => {
    game.reset();
    resume(game);
  });

  settingsButton.addEventListener("click", () => game.openSettings());

  addOscillatorButton.addEventListener("click", handleAddOscillatorBtnClick);
  addPendulumBtn.addEventListener("click", handleAddPendulumBtnClick);
}

if (document.readyState === "loading") {
  // Loading hasn't finished yet
  document.addEventListener("DOMContentLoaded", main);
} else {
  // `DOMContentLoaded` has already fired
  main();
}
