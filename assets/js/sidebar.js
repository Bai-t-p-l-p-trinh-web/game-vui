document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.createElement("div");
  sidebar.classList.add("sidebar");
  sidebar.innerHTML = `
        <button onclick="navigateTo('index.html')">🏠 Home</button>
        <button onclick="navigateTo('games/game1.html')">🎮 Game 1</button>
        <button onclick="navigateTo('games/game2.html')">🎮 Game 2</button>
        <button onclick="navigateTo('games/game3.html')">🎮 Game 3</button>
        <button onclick="navigateTo('games/game4.html')">🎮 Game 4</button>
    `;
  document.body.insertAdjacentElement("afterbegin", sidebar);
});
