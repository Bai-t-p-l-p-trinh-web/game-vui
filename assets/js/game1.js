const boxes = document.querySelectorAll(".box");

let turn = "X";
let isGameOver = false;

boxes.forEach((e) => {
  e.innerHTML = "";
  e.addEventListener("click", () => {
    if (!isGameOver && e.innerHTML === "") {
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
