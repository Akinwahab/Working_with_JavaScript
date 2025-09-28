// DOM elements
const holes = document.querySelectorAll(".hole");
const scoreDisplay = document.getElementById("score");
const timeLeftDisplay = document.getElementById("time-left");
const startButton = document.getElementById("start-btn");

let score = 0;
let currentTime = 30;
let timerId = null;
let moleTimer = null;
let gameRunning = false;

// --- High Score ---
let highScore = localStorage.getItem("highScore") 
    ? parseInt(localStorage.getItem("highScore")) 
    : 0;
document.getElementById("high-score").textContent = highScore;



const animals = ["🐹", "🐸", "🐰", "🦊", "🐻"];

// --- Utility Functions ---
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clearHoles() {
  holes.forEach((hole) => {
    hole.innerHTML = "";
    hole.onclick = null;
  });
}

function updateScore() {
  scoreDisplay.textContent = score;
}

function updateTimeDisplay() {
  timeLeftDisplay.textContent = currentTime;
}

function enableStartButton() {
  startButton.disabled = false;
  startButton.classList.remove("disabled");
}

function disableStartButton() {
  startButton.disabled = true;
  startButton.classList.add("disabled");
}

// --- Game Logic ---

function handleAnimalClick(hole, animal) {
  if (hole.innerHTML.includes(animal)) {
    score++;
    updateScore();
    hole.innerHTML = "";
  }
}

function showAnimalInRandomHole() {
  clearHoles();

  const hole = getRandomItem([...holes]);
  const animal = getRandomItem(animals);

  hole.innerHTML = `<span>${animal}</span>`;
  hole.onclick = () => handleAnimalClick(hole, animal);
}

function startMoleMovement() {
  moleTimer = setInterval(showAnimalInRandomHole, 250);
}

function stopMoleMovement() {
  clearInterval(moleTimer);
}

function startCountdown() {
  timerId = setInterval(() => {
    currentTime--;
    updateTimeDisplay();
    if (currentTime === 0) endGame();
  }, 1000);
}

function stopCountdown() {
  clearInterval(timerId);
}

function resetGame() {
  score = 0;
  currentTime = 30;
  updateScore();
  updateTimeDisplay();
  clearHoles();
}

function startGame() {
  if (gameRunning) return;
  gameRunning = true;

  disableStartButton();
  resetGame();

  startMoleMovement();
  startCountdown();
}

// --- End Game Function ---
function endGame() {
  gameRunning = false;
  stopCountdown();
  stopMoleMovement();
  clearHoles();
  enableStartButton();
  scoreDisplay.textContent = 0;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    document.getElementById("high-score").textContent = highScore;
    alert(`🎉 New High Score: ${score}!`);
  } else {
    alert(`Game Over! Final Score: ${score}`);
  }
}

// --- Initialize ---
startButton.addEventListener("click", startGame);
