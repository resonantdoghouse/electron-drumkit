/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

const Tone = require("tone");

import "./css/index.css";
import snareSound from "./assets/audio/505/snare.mp3";
import kickSound from "./assets/audio/505/kick.mp3";
import highHatSound from "./assets/audio/505/hh.mp3";
import highHatOpenSound from "./assets/audio/505/hho.mp3";

const $drumKit = document.getElementById("drumkit");
const $reverbLevel = document.getElementById("reverb-level");
let reverbLevel = 0;
// global volume, lowered due to added compression
let vol = new Tone.Volume(-15);

/*
 * Effects
 */
const reverb1 = new Tone.Freeverb(reverbLevel, 10000)
  .receive("reverb")
  .toMaster();
const reverb2 = new Tone.Freeverb(0.4, 10000).receive("reverb").toMaster();
const reverb3 = new Tone.Freeverb(0.8, 15000).receive("reverb").toMaster();

$reverbLevel.addEventListener("input", () => {
  reverbLevel = $reverbLevel.value;
  // console.log(reverbLevel);
  console.log(reverb1);
  reverb1.roomSize.value = reverbLevel;
});

/*
 * Delay
 */
let feedbackDelay = new Tone.PingPongDelay({
  delayTime: "16n",
  feedback: 0.3,
  wet: 0.5
}).toMaster();

/*
 * Master FX
 */
//some overall compression to keep the levels in check
const masterCompressor = new Tone.Compressor({
  threshold: -16,
  ratio: 12,
  attack: 0,
  release: 0.3
});

//give a little boost to the lows
const lowBump = new Tone.Filter({
  type: "lowshelf",
  frequency: 90,
  Q: 1,
  gain: 16
});

/*
 * Drums
 */
const drums505 = new Tone.Sampler(
  {
    D4: snareSound,
    C3: kickSound,
    G3: highHatSound,
    A3: highHatOpenSound
  },
  {
    volume: 1,
    release: 1
  }
).chain(vol, reverb1, Tone.Master);

// Route everything through the filter & compressor before playing
Tone.Master.chain(lowBump, masterCompressor);

document.addEventListener("keydown", e => {
  // console.log(e.keyCode);
  switch (e.keyCode) {
    case 65:
      drums505.triggerAttackRelease("C3", "4n");
      break;
    case 32:
      drums505.triggerAttackRelease("C3", "4n");
      break;
    case 83:
      drums505.triggerAttackRelease("D4", "4n");
      break;
    case 71:
      drums505.triggerAttackRelease("G3", "4n");
      break;
    case 72:
      drums505.triggerAttackRelease("A3", "4n");
      break;
    default:
      break;
  }
});
