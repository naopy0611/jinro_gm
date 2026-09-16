const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");

const gameArea = document.getElementById("gameArea");

const phaseText = document.getElementById("phase");
const aliveText = document.getElementById("alive");
const dayText = document.getElementById("day");

let day = 1;
let isNight = true;
let alive = 9;

startBtn.onclick = () => {
  gameArea.classList.remove("hidden");
  startBtn.parentElement.classList.add("hidden");
  updateScreen();
};

nextBtn.onclick = () => {
  if (isNight) {
    isNight = false;
  } else {
    isNight = true;
    day++;
  }
  updateScreen();
};

function updateScreen() {
  phaseText.textContent =
    `${day}日目・${isNight ? "夜🌙" : "昼☀️"}`;

  dayText.textContent = day;
  aliveText.textContent = alive;

  nextBtn.textContent =
    isNight ? "朝にする" : "夜にする";
}

updateScreen();

// PWA用
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js");
  });
}
