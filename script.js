let currentAudio = null;
let soundsData = [];
let played = "";

function katakanaToHiragana(text) {
  return text.replace(/[\u30a1-\u30f6]/g, (char) => {
    return String.fromCharCode(char.charCodeAt(0) - 0x60);
  });
}

function normalizeForSort(text) {
  return katakanaToHiragana(text)
    .normalize("NFKC")
    .toLowerCase()
    .trim();
}

function playSound(file) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  const audio = new Audio("./sounds/" + file);
  audio.currentTime = 0;
  played = file;
  document.getElementById("played").textContent =
    "再生中: " + played.replace(/\.mp3$/i, "");

  audio.play().catch((error) => {
    console.error("audio play error:", error);
  });

  audio.onended = () => {
    document.getElementById("played").textContent =
      "再生済: " + played.replace(/\.mp3$/i, "");
  };

  currentAudio = audio;
}

function renderButtons(list) {
  const container = document.getElementById("buttons");
  container.innerHTML = "";

  list.forEach((file) => {
    const button = document.createElement("button");
    button.textContent = file.replace(/\.mp3$/i, "");

    button.addEventListener("click", () => {
      playSound(file);
    });

    container.appendChild(button);
  });
}

function showJsonOrder() {
  renderButtons(soundsData);
}

function showReverseJsonOrder() {
  renderButtons([...soundsData].reverse());
}

function showKanaOrder() {
  const sorted = [...soundsData].sort((a, b) => {
    const aName = normalizeForSort(a.replace(/\.mp3$/i, ""));
    const bName = normalizeForSort(b.replace(/\.mp3$/i, ""));
    return aName.localeCompare(bName, "ja");
  });

  renderButtons(sorted);
}

async function loadSounds() {
  try {
    const res = await fetch("./sounds.json");

    if (!res.ok) {
      throw new Error(`sounds.jsonの読み込み失敗: ${res.status}`);
    }

    soundsData = await res.json();

    if (!Array.isArray(soundsData)) {
      throw new Error("sounds.json が配列ではない");
    }

    renderButtons([...soundsData].reverse());
  } catch (error) {
    console.error("loadSounds error:", error);
  }
}

function setupControls() {
  const jsonOrderButton = document.getElementById("jsonOrder");
  const reverseJsonOrderButton = document.getElementById("reverseJsonOrder");
  const kanaOrderButton = document.getElementById("kanaOrder");

  if (jsonOrderButton) {
    jsonOrderButton.addEventListener("click", showJsonOrder);
  }

  if (reverseJsonOrderButton) {
    reverseJsonOrderButton.addEventListener("click", showReverseJsonOrder);
  }

  if (kanaOrderButton) {
    kanaOrderButton.addEventListener("click", showKanaOrder);
  }
}

loadSounds();
setupControls();