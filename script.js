const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const keys = document.querySelectorAll(".key");
const result = document.getElementById("result");

// slot positions (pixels from left)
const slots = [50, 250, 450]; 
let positions = [0, 1, 2]; // which key is at which slot
let highlighted = null;
let shuffling = false;

// place keys in initial positions
function render() {
  keys.forEach((key, i) => {
    const slotIndex = positions.indexOf(parseInt(key.dataset.id));
    key.style.transform = `translateX(${slots[slotIndex]}px)`;
  });
}

function startGame() {
  if (shuffling) return;
  result.textContent = "";
  highlighted = Math.floor(Math.random() * 3);

  // highlight briefly
  const keyEl = Array.from(keys).find(k => parseInt(k.dataset.id) === highlighted);
  keyEl.querySelector("img").classList.add("highlight");

  setTimeout(() => {
    keyEl.querySelector("img").classList.remove("highlight");
    shuffleKeys();
  }, 1000);
}

function shuffleKeys() {
  shuffling = true;
  let swaps = 8; // number of visible swaps
  const interval = setInterval(() => {
    const i = Math.floor(Math.random() * 3);
    let j = Math.floor(Math.random() * 3);
    while (j === i) j = Math.floor(Math.random() * 3);

    [positions[i], positions[j]] = [positions[j], positions[i]];
    render();

    swaps--;
    if (swaps === 0) {
      clearInterval(interval);
      shuffling = false;
    }
  }, 800);
}

keys.forEach(key => {
  key.addEventListener("click", () => {
    if (shuffling || highlighted === null) return;
    const slotIndex = positions.indexOf(parseInt(key.dataset.id));
    if (parseInt(key.dataset.id) === highlighted) {
      result.textContent = "✅ Correct!";
      result.style.color = "lightgreen";
    } else {
      result.textContent = "❌ Wrong!";
      result.style.color = "red";
    }
    highlighted = null;
  });
});

resetBtn.addEventListener("click", () => {
  if (shuffling) return;
  positions = [0, 1, 2];
  highlighted = null;
  result.textContent = "";
  render();
});

startBtn.addEventListener("click", startGame);

// initial render
render();
