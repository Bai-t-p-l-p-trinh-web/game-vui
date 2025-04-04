function navigateTo(path) {
  window.location.href = `${path}`;
}

let items = document.querySelectorAll(".game-selection .game-card");
let active = Math.floor(items.length / 2);

function loadShow() {
  items[active].style.transform = `none`;
  items[active].style.zIndex = 1;
  items[active].style.filter = "none";
  items[active].style.opacity = 1;

  let stt = 0;
  for (var i = active + 1; i < items.length; i++) {
    stt++;
    items[i].style.transform = `translateX(${120 * stt}px) scale(${
      1 - 0.2 * stt
    }) perspective(16px) rotateY(-1deg)`;
    items[i].style.zIndex = -stt;
    items[i].style.filter = "blur(5px)";
    items[i].style.opacity = stt > 2 ? 0 : 0.6;
  }
  stt = 0;
  for (var i = active - 1; i >= 0; i--) {
    stt++;
    items[i].style.transform = `translateX(${-120 * stt}px) scale(${
      1 - 0.2 * stt
    }) perspective(16px) rotateY(1deg)`;
    items[i].style.zIndex = -stt;
    items[i].style.filter = "blur(5px)";
    items[i].style.opacity = stt > 2 ? 0 : 0.6;
  }
}
loadShow();
let next = document.getElementById("next");
let prev = document.getElementById("prev");
next.onclick = function () {
  active = active + 1 < items.length ? active + 1 : active;
  loadShow();
};
prev.onclick = function () {
  active = active - 1 >= 0 ? active - 1 : active;
  loadShow();
};

document.addEventListener("keydown", (e) => {
  if (e.keyCode == 37 || e.keyCode == 40) {
    active = active - 1 >= 0 ? active - 1 : active;
    loadShow();
  } else if (e.keyCode == 38 || e.keyCode == 39) {
    active = active + 1 < items.length ? active + 1 : active;
    loadShow();
  }
});
