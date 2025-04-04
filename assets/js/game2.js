const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let tries = 0;
let start = document.getElementById("start");
let isPlaying = false;
let timerInterval;
let elapsedTime = 0;

const correct = new Audio();
const wrong = new Audio();
const winning = new Audio();
const theme = new Audio();

correct.src = "../assets/audio/card_matching_correct_sound.mp3";
wrong.src = "../assets/audio/card_matching_wrong_sound.mp3";
winning.src = "../assets/audio/card_matching_winning_sound.mp3";
theme.src = "../assets/audio/card_matching_theme.mp3";

let musicStarted = false;
let isSoundOn = true;
document.addEventListener("toggleSound", function (event) {
  isSoundOn = event.detail.isSoundOn;

  theme.muted = !isSoundOn;
  correct.muted = !isSoundOn;
  wrong.muted = !isSoundOn;
  winning.muted = !isSoundOn;

  if (isSoundOn && musicStarted && theme.paused) {
    theme.play().catch((error) => console.log("Audio play failed:", error));
  }
});

if (!musicStarted && isSoundOn) {
  theme
    .play()
    .then(() => {
      musicStarted = true;
    })
    .catch((error) => {
      console.log(
        "Theme music autoplay failed, likely requires user interaction.",
        error
      );
    });
}

document.querySelector(".score").textContent = score;
document.querySelector(".tries").textContent = tries;

start.addEventListener("click", () => {
  isPlaying = true;
  start.style.display = "none";
  startTimer();
});

fetch("../assets/data/game2/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
  });

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (!isPlaying) return;
  if (lockBoard) return;
  if (this === firstCard) {
    firstCard.classList.remove("flipped");
    firstCard = null;
    return;
  }

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  tries++;
  document.querySelector(".tries").textContent = tries;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  if (isMatch) {
    correct.play();
    score++;
    document.querySelector(".score").textContent = score;
    checkWin();
  } else {
    wrong.play();
  }

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function startTimer() {
  elapsedTime = 0;
  document.querySelector(".timer").textContent = formatTime(elapsedTime);
  timerInterval = setInterval(() => {
    elapsedTime++;
    document.querySelector(".timer").textContent = formatTime(elapsedTime);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

function checkWin() {
  if (score === cards.length / 2) {
    winning.play();
    stopTimer();
    showSummary();
  }
}

function showSummary() {
  const summary = document.getElementById("summary");
  summary.innerHTML = `
    🎉 Chúc mừng bạn đã hoàn thành trò chơi 🤩
  `;
  document.getElementById("restart").style.display = "block";
  document.getElementById("restart").addEventListener("click", () => {
    summary.innerHTML = "";
    restart();
  });
}

function restart() {
  resetBoard();
  shuffleCards();
  score = 0;
  tries = 0;
  document.querySelector(".score").textContent = score;
  document.querySelector(".tries").textContent = tries;
  gridContainer.innerHTML = "";
  generateCards();
  stopTimer();
  start.style.display = "block";
  document.getElementById("restart").style.display = "none";
  document.querySelector(".timer").textContent = "00:00";
}
