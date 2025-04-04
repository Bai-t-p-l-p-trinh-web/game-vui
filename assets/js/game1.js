const boxes = document.querySelectorAll(".box");

let turn = "X";
let isGameOver = false;
const mark = new Audio();
const win = new Audio();
const draw = new Audio();
const theme = new Audio();

mark.src = "../assets/audio/tic_tac_marking_sound.mp3";
win.src = "../assets/audio/tic_tac_winning_sound.mp3";
draw.src = "../assets/audio/tic_tac_draw_sound.mp3";
theme.src = "../assets/audio/tic_tac_theme.mp3";

theme.loop = true;

let musicStarted = false;
let isSoundOn = true;
document.addEventListener("toggleSound", function (event) {
  isSoundOn = event.detail.isSoundOn;

  theme.muted = !isSoundOn;
  mark.muted = !isSoundOn;
  win.muted = !isSoundOn;
  draw.muted = !isSoundOn;

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

boxes.forEach((e) => {
  e.innerHTML = "";
  e.addEventListener("click", () => {
    if (!isGameOver && e.innerHTML === "") {
      mark.play();
      e.innerHTML = turn;
      e.style.backgroundColor = turn == "X" ? "#865dff" : "#5d73ff";
      checkWin();
      changeTurn();
      checkDraw();
    }
  });
});

function changeTurn() {
  if (turn === "X") {
    turn = "O";
    document.querySelector(".bg").style.left = "150px";
    document.querySelector(".bg").style.backgroundColor = "#5d73ff";
    boxes.forEach((box) => {
      box.classList.remove("hover-x");
      box.classList.add("hover-o");
    });
  } else {
    turn = "X";
    document.querySelector(".bg").style.left = "0";
    document.querySelector(".bg").style.backgroundColor = "#865dff";
    boxes.forEach((box) => {
      box.classList.remove("hover-o");
      box.classList.add("hover-x");
    });
  }
}

function checkWin() {
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];
  for (let i = 0; i < winConditions.length; i++) {
    let b1 = boxes[winConditions[i][0]].innerHTML;
    let b2 = boxes[winConditions[i][1]].innerHTML;
    let b3 = boxes[winConditions[i][2]].innerHTML;

    if (b1 != "" && b1 === b2 && b2 === b3) {
      isGameOver = true;
      win.play();
      document.querySelector("#result").innerHTML = `Người chiến thắng là ${
        turn == "X" ? "❌" : "⭕"
      }`;
      document.querySelector("#result").style.color = "#AEEA94";
      document.querySelector("#play-again").style.display = "inline";
      document.querySelector("#play-again").style.backgroundColor = "#FFF2AF";

      for (j = 0; j < 3; j++) {
        boxes[winConditions[i][j]].style.backgroundColor = "#FFF2AF";
        boxes[winConditions[i][j]].style.color =
          turn == "X" ? "#865dff" : "#5d73ff";
      }
    }
  }
}

function checkDraw() {
  if (!isGameOver) {
    let isDraw = true;

    boxes.forEach((e) => {
      if (e.innerHTML === "") isDraw = false;
    });

    if (isDraw) {
      isGameOver = true;
      draw.play();
      document.querySelector("#result").innerHTML = "Huề 🙌";
      document.querySelector("#result").style.color = "#FFA500";
      document.querySelector("#play-again").style.display = "inline";
    }
  }
}

document.querySelector("#play-again").addEventListener("click", () => {
  isGameOver = false;
  turn = "X";

  document.querySelector(".bg").style.left = "0";
  document.querySelector(".bg").style.backgroundColor = "#865dff";
  document.querySelector("#result").innerHTML = "";
  document.querySelector("#play-again").style.display = "none";

  boxes.forEach((e) => {
    e.innerHTML = "";
    e.style.removeProperty("background-color");
    e.style.color = "#fff";
    e.classList.remove("hover-o", "hover-x");
    e.classList.add("hover-x");
  });
});
