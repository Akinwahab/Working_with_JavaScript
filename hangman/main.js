// main.js

const wordContainer = document.getElementById("word");
const wrongGuessesContainer = document.getElementById("wrong-guesses");
const remainingContainer = document.getElementById("remaining");
const keyboardContainer = document.getElementById("keyboard");
const resetBtn = document.getElementById("reset-btn");

// Popup elements
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");
const popupBtn = document.getElementById("popup-btn");

let selectedWord = "";
let guessedLetters = [];
let wrongGuesses = [];
let maxGuesses = 6;

// Fetch random word from API
async function getRandomWord() {
  try {
    const res = await fetch("https://random-word-api.herokuapp.com/word?number=1");
    const data = await res.json();
    return data[0].toLowerCase();
  } catch (error) {
    console.error("Error fetching word:", error);
    return "hangman"; // fallback word
  }
}

// Initialize game
async function startGame() {
  selectedWord = await getRandomWord();
  guessedLetters = [];
  wrongGuesses = [];
  renderWord();
  updateStatus();
  renderKeyboard();
}

// Render the word with underscores
function renderWord() {
  wordContainer.innerHTML = selectedWord
    .split("")
    .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
    .join(" ");
}

// Update wrong guesses & remaining chances
function updateStatus() {
  wrongGuessesContainer.textContent = wrongGuesses.join(", ");
  remainingContainer.textContent = maxGuesses - wrongGuesses.length;

  if (wrongGuesses.length >= maxGuesses) {
    showPopup(`😢 You lost! The word was: ${selectedWord}`);
    disableKeyboard();
  } else if (selectedWord.split("").every((l) => guessedLetters.includes(l))) {
    showPopup("🎉 You won!");
    disableKeyboard();
  }
}

// Render virtual keyboard
function renderKeyboard() {
  keyboardContainer.innerHTML = "";
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  letters.forEach((letter) => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.classList.add("key");
    btn.addEventListener("click", () => handleGuess(letter, btn));
    keyboardContainer.appendChild(btn);
  });
}

// Handle guess
function handleGuess(letter, btn) {
  if (guessedLetters.includes(letter) || wrongGuesses.includes(letter)) return;

  if (selectedWord.includes(letter)) {
    guessedLetters.push(letter);
    renderWord();
  } else {
    wrongGuesses.push(letter);
  }

  btn.classList.add("disabled");
  btn.disabled = true;
  updateStatus();
}

// Disable all keys
function disableKeyboard() {
  document.querySelectorAll(".key").forEach((btn) => {
    btn.disabled = true;
    btn.classList.add("disabled");
  });
}

// --- Popup Functions ---
function showPopup(message) {
  popupMessage.textContent = message;
  popup.classList.remove("hidden");
}

function hidePopup() {
  popup.classList.add("hidden");
}

// Close popup + restart game
popupBtn.addEventListener("click", () => {
  hidePopup();
  startGame();
});

// Restart button
resetBtn.addEventListener("click", startGame);

// Start the game on load
startGame();
