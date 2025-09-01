const startBtn = document.getElementById("startBtn");
const keys = document.querySelectorAll(".key");
const result = document.getElementById("result");

let highlighted = null;
let shuffling = false;
let positions = [0, 1, 2];

function startGame() {
  result.textContent = "";
  highlighted = Math.floor(Math.random() * 3);

  // highlight the correct key briefly
  keys[highlighted].querySelector("img").classList.add("highlight");

  setTimeout(() => {
    keys[highlighted].querySelector("img").classList.remove("highlight");
    shuffleKeys();
  }, 1000);
}

function shuffleKeys() {
  shuffling = true;
  let shuffleCount = 6;
  const interval = setInterval(() => {
    const i = Math.floor(Math.random() * 3);
    const j = Math.floor(Math.random() * 3);
    [positions[i], positions[j]] = [positions[j], positions[i]];
    renderPositions();
    shuffleCount--;
    if (shuffleCount === 0) {
      clearInterval(interval);
      shuffling = false;
    }
  }, 600);
}

function renderPositions() {
  const container = document.querySelector(".game-container");
  const reordered = Array.from(keys).sort(
    (a, b) => positions[a.dataset.index] - positions[b.dataset.index]
  );
  container.innerHTML = "";
  reordered.forEach(el => container.appendChild(el));
}

keys.forEach((key, index) => {
  key.addEventListener("click", () => {
    if (shuffling || highlighted === null) return;
    if (positions[index] === highlighted) {
      result.textContent = "✅ Correct!";
      result.style.color = "lightgreen";
    } else {
      result.textContent = "❌ Wrong!";
      result.style.color = "red";
    }
  });
});

startBtn.addEventListener("click", startGame);
