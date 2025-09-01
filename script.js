// Simple "slots" shuffle implementation.
// slots are fixed DOM elements; `positions[slotIndex] = keyId` tells which key sits in each slot.

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const slots = Array.from(document.querySelectorAll(".key"));
const result = document.getElementById("result");

// image set (you can replace with different images if you want)
const keyImages = [
  "https://cdn-icons-png.flaticon.com/512/61/61457.png",
  "https://cdn-icons-png.flaticon.com/512/61/61457.png",
  "https://cdn-icons-png.flaticon.com/512/61/61457.png"
];

// positions[slotIndex] = keyId
let positions = [0, 1, 2];
let highlighted = null;
let shuffling = false;

function render() {
  // Put the correct image in each slot based on positions[].
  slots.forEach((slot, slotIndex) => {
    const keyId = positions[slotIndex];
    const img = slot.querySelector("img");
    img.src = keyImages[keyId];
    img.dataset.keyId = keyId;
    img.classList.remove("highlight");
  });
}

function startGame() {
  if (shuffling) return;
  result.textContent = "";
  highlighted = Math.floor(Math.random() * 3); // which key-id is correct (0..2)

  // Find which slot currently holds that key
  const highlightedSlotIndex = positions.indexOf(highlighted);
  const highlightedImg = slots[highlightedSlotIndex].querySelector("img");

  // Lighten it briefly so user knows which to follow
  highlightedImg.classList.add("highlight");

  // After a short reveal, remove highlight and start shuffling
  setTimeout(() => {
    highlightedImg.classList.remove("highlight");
    shuffleKeys();
  }, 800);
}

function shuffleKeys() {
  shuffling = true;
  startBtn.disabled = true;

  // number of random swaps to perform
  let swaps = 12;
  const intervalMs = 240;

  const interval = setInterval(() => {
    // choose two different slot indices and swap which key-id they contain
    const i = Math.floor(Math.random() * 3);
    let j = Math.floor(Math.random() * 3);
    while (j === i) j = Math.floor(Math.random() * 3);

    // add quick visual FX before swap
    const imgA = slots[i].querySelector("img");
    const imgB = slots[j].querySelector("img");
    imgA.classList.add("swap-fx");
    imgB.classList.add("swap-fx");

    // wait a tiny moment so user sees the micro-FX, then swap
    setTimeout(() => {
      [positions[i], positions[j]] = [positions[j], positions[i]];
      render();
    }, 80);

    // remove FX shortly after
    setTimeout(() => {
      imgA.classList.remove("swap-fx");
      imgB.classList.remove("swap-fx");
    }, 160);

    swaps--;
    if (swaps <= 0) {
      clearInterval(interval);
      shuffling = false;
      startBtn.disabled = false;
    }
  }, intervalMs);
}

// Click handling: slotIndex is stable because DOM order doesn't change
slots.forEach((slot, slotIndex) => {
  slot.addEventListener("click", () => {
    if (shuffling || highlighted === null) return; // ignore clicks mid-shuffle or before start
    if (positions[slotIndex] === highlighted) {
      result.textContent = "✅ Correct!";
      result.style.color = "lightgreen";
    } else {
      result.textContent = "❌ Wrong!";
      result.style.color = "salmon";
    }
    // lock out further clicks until next start
    highlighted = null;
  });
});

resetBtn.addEventListener("click", () => {
  if (shuffling) return;
  positions = [0,1,2];
  highlighted = null;
  result.textContent = "";
  render();
});

startBtn.addEventListener("click", startGame);

// initial render
render();
