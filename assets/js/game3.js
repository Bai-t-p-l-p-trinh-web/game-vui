// Snake
const cvs_snake = document.getElementById("snake");
const ctx_snake = cvs_snake.getContext("2d");
 
const unit_snake = 32;

const foodImg = new Image();
const head_up = new Image();
const head_down = new Image();
const head_left = new Image();
const head_right = new Image();
const body_bottom_left = new Image();
const body_bottom_right = new Image();
const body_horizontal = new Image();
const body_top_left = new Image();
const body_top_right = new Image();
const body_vertical = new Image();
const tail_down = new Image();
const tail_left = new Image();
const tail_right = new Image();
const tail_up = new Image();

foodImg.src = "../assets/images/apple.png";
head_up.src = "../assets/images/head_up.png";
head_down.src = "../assets/images/head_down.png";
head_left.src = "../assets/images/head_left.png";
head_right.src = "../assets/images/head_right.png";
body_bottom_left.src = "../assets/images/body_bottomleft.png";
body_bottom_right.src = "../assets/images/body_bottomright.png";
body_horizontal.src = "../assets/images/body_horizontal.png";
body_top_left.src = "../assets/images/body_topleft.png";
body_top_right.src = "../assets/images/body_topright.png";
body_vertical.src = "../assets/images/body_vertical.png";
tail_down.src = "../assets/images/tail_down.png";
tail_left.src = "../assets/images/tail_left.png";
tail_right.src = "../assets/images/tail_right.png";
tail_up.src = "../assets/images/tail_up.png";
let food = {
  x: Math.floor(Math.random() * 18 + 1) * unit_snake,
  y: Math.floor(Math.random() * 15 + 4) * unit_snake,
};

const dead = new Audio();
const eat = new Audio();
const level_up = new Audio();
const theme = new Audio();

dead.src = "../assets/audio/dead.mp3";
eat.src = "../assets/audio/eat.mp3";
level_up.src = "../assets/audio/level_up.mp3";
theme.src = "../assets/audio/snake_theme.mp3";

theme.loop = true;

let musicStarted = false;
let isSoundOn = true;
document.addEventListener("toggleSound", function (event) {
  isSoundOn = event.detail.isSoundOn;

  theme.muted = !isSoundOn;
  dead.muted = !isSoundOn;
  eat.muted = !isSoundOn;
  level_up.muted = !isSoundOn;

  if (isSoundOn && musicStarted && theme.paused) {
    theme.play().catch((error) => console.log("Audio play failed:", error));
  }
});

let score = 0;
let snake = [];
snake[0] = {
  x: 9 * unit_snake,
  y: 10 * unit_snake,
  direction: "UP"
};

var isDead = false;

// Các nút
const backgroundReset = new Image();
backgroundReset.src = "../assets/images/snake_reset.jpg";

const buttonReset = {
  x: 5 * unit_snake,
  y: 11 * unit_snake,
  width: 10 * unit_snake,
  height: 2 * unit_snake,
  text: "play again!",
};

function drawButton() {
  ctx_snake.fillStyle = "#3498db";
  ctx_snake.fillRect(
    buttonReset.x,
    buttonReset.y,
    buttonReset.width,
    buttonReset.height
  );

  ctx_snake.fillStyle = "#ffffff";
  ctx_snake.font = "16px Arial";
  ctx_snake.textAlign = "center";
  ctx_snake.textBaseline = "middle";
  ctx_snake.fillText(
    buttonReset.text,
    buttonReset.x + buttonReset.width / 2,
    buttonReset.y + buttonReset.height / 2
  );
}

// control

let d;
let queuedDirection = null;
document.addEventListener("keydown", direction);

function direction(e) {
  if (![37, 38, 39, 40].includes(e.keyCode)) return;

  e.preventDefault();

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

  let newDir;
  switch (e.keyCode) {
    case 37:
      newDir = "LEFT";
      break;
    case 38:
      newDir = "UP";
      break;
    case 39:
      newDir = "RIGHT";
      break;
    case 40:
      newDir = "DOWN";
      break;
  }

  queuedDirection = newDir;
}
// self crash
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) {
      return true;
    }
  }
  return false;
}
// end self crash

// end control
// case tail 
function getCaseTail(tail, beforeTail){
    if(tail.x < beforeTail.x) return "LEFT";
    if(tail.x > beforeTail.x) return "RIGHT";
    if(tail.y < beforeTail.y) return "UP";
    if(tail.y > beforeTail.y) return "DOWN";
}
// end case tail
// case body 
function getCaseBody(body, bodyleft, bodyright){
    if(body.x == bodyleft.x && body.x == bodyright.x) return "VERTICAL";
    if(body.y == bodyleft.y && body.y == bodyright.y) return "HORIZONTAL";
    if((body.y == bodyleft.y && body.x > bodyleft.x && body.x == bodyright.x && body.y < bodyright.y) || (body.x == bodyleft.x && body.y < bodyleft.y && body.y == bodyright.y && body.x > bodyright.x)) return "BOTTOM-LEFT";
    if((body.y == bodyleft.y && body.x < bodyleft.x && body.x == bodyright.x && body.y < bodyright.y) || (body.x == bodyleft.x && body.y < bodyleft.y && body.y == bodyright.y && body.x < bodyright.x)) return "BOTTOM-RIGHT";
    if((body.y == bodyleft.y && body.x > bodyleft.x && body.x == bodyright.x && body.y > bodyright.y) || (body.x == bodyleft.x && body.y > bodyleft.y && body.y == bodyright.y && body.x > bodyright.x)) return "TOP-LEFT";
    return "TOP-RIGHT";
}
// end case body 
// draw
function draw() {
  if (queuedDirection) {
    if (
      (d === "RIGHT" && queuedDirection !== "LEFT") ||
      (d === "LEFT" && queuedDirection !== "RIGHT") ||
      (d === "UP" && queuedDirection !== "DOWN") ||
      (d === "DOWN" && queuedDirection !== "UP") ||
      !d
    ) {
      d = queuedDirection;
    }
  }
  // header
  ctx_snake.fillStyle = "#567A39";
  ctx_snake.fillRect(0, 0, 640, unit_snake * 3);
  ctx_snake.drawImage(foodImg, unit_snake, unit_snake, unit_snake, unit_snake);
  // end header

  // background
  ctx_snake.fillStyle = "#649043";
  for (let i = 0; i < 20; i++) {
    ctx_snake.fillRect(i * unit_snake, 3 * unit_snake, unit_snake, unit_snake);
    ctx_snake.fillRect(i * unit_snake, 19 * unit_snake, unit_snake, unit_snake);
  }
  for (let i = 3; i < 20; i++) {
    ctx_snake.fillRect(0, i * unit_snake, unit_snake, unit_snake);
    ctx_snake.fillRect(19 * unit_snake, i * unit_snake, unit_snake, unit_snake);
  }
  for (let i = 4; i < 19; i++) {
    for (let j = 1; j < 19; j++) {
      if ((i + j) % 2 == 1) {
        ctx_snake.fillStyle = "#B5DF6A";
      } else {
        ctx_snake.fillStyle = "#AEDA60";
      }
      ctx_snake.fillRect(
        j * unit_snake,
        i * unit_snake,
        unit_snake,
        unit_snake
      );
    }
  }
  // end background

  // snake
  for (let i = 0; i < snake.length; i++) {
    if(i == 0){
        
        switch(snake[i].direction){
            case "UP":
                ctx_snake.drawImage(head_up, snake[i].x, snake[i].y, unit_snake, unit_snake);
                break;
            case "DOWN":
                ctx_snake.drawImage(head_down, snake[i].x, snake[i].y, unit_snake, unit_snake);
                break;
            case "LEFT":
                ctx_snake.drawImage(head_left, snake[i].x, snake[i].y, unit_snake, unit_snake);
                break;
            case "RIGHT":
                ctx_snake.drawImage(head_right, snake[i].x, snake[i].y, unit_snake, unit_snake);
                break;
        }
    } else if(i == snake.length - 1){
        switch(getCaseTail(snake[i], snake[i-1])){
            case "UP":
                ctx_snake.drawImage(tail_up, snake[i].x, snake[i].y, unit_snake, unit_snake);
                break;
            case "DOWN":
                ctx_snake.drawImage(tail_down, snake[i].x, snake[i].y, unit_snake, unit_snake);
                break;
            case "LEFT":
                ctx_snake.drawImage(tail_left, snake[i].x, snake[i].y, unit_snake, unit_snake);
                break;
            case "RIGHT":
                ctx_snake.drawImage(tail_right, snake[i].x, snake[i].y, unit_snake, unit_snake);
                break;
        }
    } else {
        switch(getCaseBody(snake[i], snake[i-1], snake[i+1])){
            case "HORIZONTAL":
                ctx_snake.drawImage(body_horizontal, snake[i].x, snake[i].y, unit_snake, unit_snake);
                break;
            case "VERTICAL":
                ctx_snake.drawImage(body_vertical, snake[i].x, snake[i].y, unit_snake, unit_snake);
                break;
            case "BOTTOM-LEFT":
                ctx_snake.drawImage(body_bottom_left, snake[i].x, snake[i].y, unit_snake, unit_snake);
                break;
            case "BOTTOM-RIGHT":
                ctx_snake.drawImage(body_bottom_right, snake[i].x, snake[i].y, unit_snake, unit_snake);
                break;
            case "TOP-LEFT":
                ctx_snake.drawImage(body_top_left, snake[i].x, snake[i].y, unit_snake, unit_snake);
                break;
            case "TOP-RIGHT":
                ctx_snake.drawImage(body_top_right, snake[i].x, snake[i].y, unit_snake, unit_snake);
                break;

        }
    }
    

  }
  // end snake
  ctx_snake.drawImage(foodImg, food.x, food.y, unit_snake, unit_snake);

  // move logic
  let snakeHeadX = snake[0].x;
  let snakeHeadY = snake[0].y;

  // eat food
  if (snakeHeadX == food.x && snakeHeadY == food.y) {
    score++;

    eat.play();
    if (score % 10 == 0) {
      level_up.play();
    }
    do {
      food = {
        x: Math.floor(Math.random() * 18 + 1) * unit_snake,
        y: Math.floor(Math.random() * 15 + 4) * unit_snake,
      };
    } while (collision(food, snake));
  } else {
    snake.pop();
  }
  // end eat food

  if (d == "LEFT") snakeHeadX -= unit_snake;
  if (d == "RIGHT") snakeHeadX += unit_snake;
  if (d == "UP") snakeHeadY -= unit_snake;
  if (d == "DOWN") snakeHeadY += unit_snake;

  let newHead = {
    x: snakeHeadX,
    y: snakeHeadY,
    direction: d || "UP"
  };
  // game over
  // console.log(d);

  if (
    snakeHeadX < unit_snake ||
    snakeHeadX > 18 * unit_snake ||
    snakeHeadY < 4 * unit_snake ||
    snakeHeadY > 18 * unit_snake ||
    collision(newHead, snake)
  ) {
    clearInterval(game_snake);
    dead.play();
    isDead = true;
    setTimeout(() => {
      ctx_snake.drawImage(
        backgroundReset,
        5 * unit_snake,
        3 * unit_snake,
        10 * unit_snake,
        7 * unit_snake
      );
      drawButton();
      
    }, 3000);
    // console.log(newHead);
    // console.log(snake);
  }
  // end game over

    snake.unshift(newHead);
    // end move logic 

    
    ctx_snake.fillStyle = "white";
    ctx_snake.font = "37px sans-serif";
    ctx_snake.textBaseline = "top";
    ctx_snake.textAlign = "start";
    ctx_snake.fillText(score, 2.2*unit_snake, 1*unit_snake);

  queuedDirection = null;
}
// end draw

// click event
cvs_snake.addEventListener("click", function (event) {
  const rect = cvs_snake.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  if (isDead) {
    if (
      mouseX >= buttonReset.x &&
      mouseX <= buttonReset.x + buttonReset.width &&
      mouseY >= buttonReset.y &&
      mouseY <= buttonReset.y + buttonReset.height
    ) {
      score = 0;
      snake = [];
      snake[0] = {
        x: 9 * unit_snake,
        y: 10 * unit_snake,
      };
      food = {
        x: Math.floor(Math.random() * 18 + 1) * unit_snake,
        y: Math.floor(Math.random() * 15 + 4) * unit_snake,
      };
      d = "";
      queuedDirection = null;
      isDead = false;
      game_snake = setInterval(draw, 100);
    }
  }
});

// end click event

// render
let game_snake = setInterval(draw, 100);
// end render

// End Snake
