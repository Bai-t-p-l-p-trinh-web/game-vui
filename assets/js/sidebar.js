document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.createElement("div");
  sidebar.classList.add("sidebar");
  sidebar.innerHTML = `
        <h1>Game Zui</h1>
        <button onclick="navigateTo('index.html')">🏠 Home</button>
        <button onclick="navigateTo('game1.html')">🎮 Game 1</button>
        <button onclick="navigateTo('game2.html')">🎮 Game 2</button>
        <button onclick="navigateTo('game3.html')">🎮 Game 3</button>
        <button onclick="navigateTo('game4.html')">🎮 Game 4</button>
        <button onclick="navigateTo('game5.html')">🎮 Game 5</button>
        <button id="toggle-sound">🔊 Tắt âm thanh</button>
    `;
  document.body.insertAdjacentElement("afterbegin", sidebar);

  let isSoundOn = true;

  const toggleSoundButton = document.getElementById("toggle-sound");
  toggleSoundButton.addEventListener("click", function () {
    isSoundOn = !isSoundOn;

    toggleSoundButton.textContent = isSoundOn
      ? "🔊 Tắt âm thanh"
      : "🔇 Mở âm thanh";

    const audios = document.querySelectorAll("audio");
    audios.forEach((audio) => {
      if (isSoundOn) {
        audio.muted = false;
      } else {
        audio.muted = true;
      }
    });

    const toggleSoundEvent = new CustomEvent("toggleSound", {
      detail: { isSoundOn },
    });
    document.dispatchEvent(toggleSoundEvent);
  });
});

function navigateTo(path) {
  window.location.href = `${path}`;
}
