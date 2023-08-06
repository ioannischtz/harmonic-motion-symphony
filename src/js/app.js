import Game from "./Game";
import {
  baseFrequencies,
  getRandomElementFromArray,
  getRandomInt,
} from "./utils";

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
  const playBtn = document.getElementById("play-button");
  const resumeBtn = document.getElementById("resume-button");
  const resetButton = document.getElementById("reset-button");
  const settingsButton = document.getElementById("settings-button");
  const canvas = document.getElementById("canvas");
  const menuOverlay = document.getElementById("menuOverlay");
  const editingOverlay = document.getElementById("editingOverlay");
  const playingOverlay = document.getElementById("playingOverlay");
  const keysHintOverlay = document.getElementById("keysHintOverlay");

  menuOverlay.style.display = "flex";
  editingOverlay.style.display = "none";
  playingOverlay.style.display = "none";
  keysHintOverlay.style.display = "flex";
  resumeBtn.style.display = "none";

  // We cannot supply an audioCtx without user interaction. audioCtx will be set later, on user click
  const game = new Game(canvasParams, null, fpsCap, simCoeffs);

  // Function to update the keys-hint content
  function updateKeysHint(gameState, GAME_STATES) {
    const keysHint = document.getElementById("keysHint");
    keysHint.innerHTML = `
    <p><strong>ESC</strong> ${
      gameState.curr === GAME_STATES.MENU ? "close" : "open"
    } the menu</p>
    <p><strong>SPACE</strong> switch to ${
      gameState.curr === GAME_STATES.EDITING ? "playing" : "editing"
    } mode</p>
  `;
  }

  function handleKeyPress(event) {
    if (event.key === "Escape" || event.key == "Esc") {
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

  // Initial update to set the keys-hint
  updateKeysHint(game.gameState, game.GAME_STATES);

  document.addEventListener("keydown", handleKeyPress);

  playBtn.addEventListener("click", () => {
    playBtn.style.display = "none";
    resumeBtn.style.display = "block";
    // Create the AudioContext after a user interaction, in order to comform
    // to the Autoplay policy
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    game.audioCtx = audioCtx;

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
    // hide the game menu
    menuOverlay.style.display = "none";
    editingOverlay.style.display = "none";
    playingOverlay.style.display = "flex";
    game.play();
  });

  resumeBtn.addEventListener("click", () => {
    menuOverlay.style.display = "none";
    if (game.gameState.prev === game.GAME_STATES.PLAYING) {
      game.play();
    } else if (game.gameState.prev === game.GAME_STATES.EDITING) {
      game.edit();
    }
  });

  resetButton.addEventListener("click", () => game.reset());

  settingsButton.addEventListener("click", () => game.openSettings());
}

if (document.readyState === "loading") {
  // Loading hasn't finished yet
  document.addEventListener("DOMContentLoaded", main);
} else {
  // `DOMContentLoaded` has already fired
  main();
}
