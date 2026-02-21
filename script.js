const OPTIONS = {
  bodyType: ["technician", "brawler", "high-flyer"],
  mask: ["none", "half", "full"],
  gear: ["trunks", "tights"],
  build: ["lean", "normal", "heavy"],
  hair: ["#1f130f", "#38271c", "#5c3b2d", "#0f0f10", "#8c6a42", "#d9c7a0"],
  skin: ["#f4d6be", "#ddb59b", "#b8846a", "#8c5e43", "#6f4a34", "#4f3528"],
  gearColor: ["#d63031", "#0984e3", "#6c5ce7", "#00b894", "#fdcb6e", "#ffffff"],
  accentColor: ["#1b1c1f", "#e17055", "#55efc4", "#ffeaa7", "#2d3436", "#ff7675"]
};

const LABELS = {
  bodyType: "Body Type",
  mask: "Mask",
  gear: "Gear Style",
  build: "Build",
  hair: "Hair Color",
  skin: "Skin Tone",
  gearColor: "Primary Gear Color",
  accentColor: "Accent Color",
  complexity: "Complexity"
};

const spriteCanvas = document.getElementById("spriteCanvas");
const sctx = spriteCanvas.getContext("2d");
const photoPreview = document.getElementById("photoPreview");
const pctx = photoPreview.getContext("2d");
const imageInput = document.getElementById("imageInput");
const fromImageBtn = document.getElementById("fromImageBtn");
const randomBtn = document.getElementById("randomBtn");
const traitList = document.getElementById("traitList");
const complexityInput = document.getElementById("complexityInput");
const complexityValue = document.getElementById("complexityValue");
const complexityMeter = document.getElementById("complexityMeter");
const complexityLabel = document.getElementById("complexityLabel");

let uploadedImage = null;

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function withAny(selectEl, values) {
  selectEl.innerHTML = "";
  ["Any", ...values].forEach((val) => {
    const option = document.createElement("option");
    option.value = val;
    option.textContent = val;
    selectEl.append(option);
  });
}

function fillPreferenceSelectors() {
  withAny(document.getElementById("bodyTypePref"), OPTIONS.bodyType);
  withAny(document.getElementById("maskPref"), OPTIONS.mask);
  withAny(document.getElementById("gearPref"), OPTIONS.gear);
  withAny(document.getElementById("buildPref"), OPTIONS.build);
  withAny(document.getElementById("hairPref"), OPTIONS.hair);
  withAny(document.getElementById("skinPref"), OPTIONS.skin);
  withAny(document.getElementById("gearColorPref"), OPTIONS.gearColor);
  withAny(document.getElementById("accentColorPref"), OPTIONS.accentColor);
}

function complexityTier(value) {
  if (value <= 3) return "Basic";
  if (value <= 7) return "Detailed";
  return "Extreme";
}

function updateComplexityReadout() {
  const value = Number(complexityInput.value);
  complexityValue.textContent = `${value} / 10`;
}

function randomTraitsFromPreferences() {
  const getVal = (id, opts) => {
    const value = document.getElementById(id).value;
    return value === "Any" ? pick(opts) : value;
  };

  return {
    bodyType: getVal("bodyTypePref", OPTIONS.bodyType),
    mask: getVal("maskPref", OPTIONS.mask),
    gear: getVal("gearPref", OPTIONS.gear),
    build: getVal("buildPref", OPTIONS.build),
    hair: getVal("hairPref", OPTIONS.hair),
    skin: getVal("skinPref", OPTIONS.skin),
    gearColor: getVal("gearColorPref", OPTIONS.gearColor),
    accentColor: getVal("accentColorPref", OPTIONS.accentColor),
    complexity: Number(complexityInput.value)
  };
}

function drawSprite(traits) {
  sctx.clearRect(0, 0, spriteCanvas.width, spriteCanvas.height);
  const scale = 8;
  const ox = 8;
  const oy = 8;

  const px = (x, y, w, h, color) => {
    sctx.fillStyle = color;
    sctx.fillRect((ox + x) * scale, (oy + y) * scale, w * scale, h * scale);
  };

  const shoulderWidth = traits.build === "heavy" ? 12 : traits.build === "lean" ? 8 : 10;
  const torsoWidth = traits.build === "heavy" ? 10 : traits.build === "lean" ? 7 : 8;

  px(8, 2, 8, 6, traits.hair);
  px(9, 6, 6, 6, traits.skin);

  if (traits.mask !== "none") {
    px(9, 8, 6, 4, traits.gearColor);
    if (traits.mask === "full") {
      px(10, 10, 4, 2, traits.accentColor);
    }
  }

  px(12 - Math.floor(shoulderWidth / 2), 12, shoulderWidth, 4, traits.skin);
  px(12 - Math.floor(torsoWidth / 2), 16, torsoWidth, 9, traits.gearColor);

  if (traits.bodyType === "high-flyer") {
    px(7, 18, 3, 2, traits.accentColor);
    px(14, 18, 3, 2, traits.accentColor);
  } else if (traits.bodyType === "brawler") {
    px(6, 17, 2, 4, traits.accentColor);
    px(16, 17, 2, 4, traits.accentColor);
  }

  const armY = traits.bodyType === "brawler" ? 13 : 14;
  px(5, armY, 3, 9, traits.skin);
  px(16, armY, 3, 9, traits.skin);
  px(5, armY + 4, 3, 2, traits.accentColor);
  px(16, armY + 4, 3, 2, traits.accentColor);

  if (traits.gear === "trunks") {
    px(9, 23, 6, 4, traits.accentColor);
  }

  const legHeight = traits.gear === "tights" ? 12 : 10;
  const legColor = traits.gear === "tights" ? traits.gearColor : traits.skin;
  px(9, 27, 3, legHeight, legColor);
  px(12, 27, 3, legHeight, legColor);
  px(9, 36, 3, 3, "#ffffff");
  px(12, 36, 3, 3, "#ffffff");

  if (traits.bodyType === "technician") {
    px(10, 19, 4, 2, traits.accentColor);
  }

  if (traits.complexity >= 4) {
    px(9, 15, 6, 1, traits.accentColor);
    px(8, 31, 8, 1, traits.accentColor);
  }

  if (traits.complexity >= 7) {
    px(9, 37, 3, 1, traits.accentColor);
    px(12, 37, 3, 1, traits.accentColor);
    px(10, 8, 1, 1, "#ffffff");
    px(13, 8, 1, 1, "#ffffff");
  }

  if (traits.complexity >= 9) {
    px(6, 21, 2, 1, traits.gearColor);
    px(16, 21, 2, 1, traits.gearColor);
    px(11, 21, 2, 1, "#ffffff");
  }

  renderTraitSummary(traits);
  updateComplexityMeter(traits);
}

function updateComplexityMeter(traits) {
  const level = Math.max(1, Math.min(10, Number(traits.complexity ?? 1)));
  const score = Math.round((level / 10) * 100);
  complexityMeter.value = score;
  complexityLabel.textContent = `${complexityTier(level)} (${score}%)`;
}

function renderTraitSummary(traits) {
  traitList.innerHTML = "";
  Object.entries(traits).forEach(([key, value]) => {
    const dt = document.createElement("dt");
    dt.textContent = LABELS[key] || key;
    const dd = document.createElement("dd");
    dd.textContent = key === "complexity" ? `${value}/10` : value;
    traitList.append(dt, dd);
  });
}

function averageColor(imgData, sx, sy, sw, sh) {
  let r = 0, g = 0, b = 0, count = 0;
  for (let y = sy; y < sy + sh; y++) {
    for (let x = sx; x < sx + sw; x++) {
      const idx = (y * imgData.width + x) * 4;
      const alpha = imgData.data[idx + 3];
      if (alpha < 20) continue;
      r += imgData.data[idx];
      g += imgData.data[idx + 1];
      b += imgData.data[idx + 2];
      count++;
    }
  }
  if (!count) return "#888888";
  return `#${[r / count, g / count, b / count].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

function nearestColor(hex, palette) {
  const h2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r, g, b] = h2rgb(hex);
  return palette
    .map((p) => {
      const [pr, pg, pb] = h2rgb(p);
      const d = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2;
      return { p, d };
    })
    .sort((a, b2) => a.d - b2.d)[0].p;
}

function traitsFromImage() {
  const off = document.createElement("canvas");
  off.width = 64;
  off.height = 64;
  const octx = off.getContext("2d", { willReadFrequently: true });
  octx.drawImage(uploadedImage, 0, 0, off.width, off.height);
  const data = octx.getImageData(0, 0, off.width, off.height);

  const hairGuess = averageColor(data, 10, 4, 44, 18);
  const skinGuess = averageColor(data, 18, 18, 28, 22);
  const gearGuess = averageColor(data, 10, 36, 44, 24);

  return {
    bodyType: pick(OPTIONS.bodyType),
    mask: "none",
    gear: pick(OPTIONS.gear),
    build: pick(OPTIONS.build),
    hair: nearestColor(hairGuess, OPTIONS.hair),
    skin: nearestColor(skinGuess, OPTIONS.skin),
    gearColor: nearestColor(gearGuess, OPTIONS.gearColor),
    accentColor: pick(OPTIONS.accentColor),
    complexity: Number(complexityInput.value)
  };
}

imageInput.addEventListener("change", () => {
  const file = imageInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      uploadedImage = img;
      pctx.clearRect(0, 0, photoPreview.width, photoPreview.height);
      const ratio = Math.min(photoPreview.width / img.width, photoPreview.height / img.height);
      const w = img.width * ratio;
      const h = img.height * ratio;
      const x = (photoPreview.width - w) / 2;
      const y = (photoPreview.height - h) / 2;
      pctx.drawImage(img, x, y, w, h);
      fromImageBtn.disabled = false;
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

fromImageBtn.addEventListener("click", () => {
  if (!uploadedImage) return;
  drawSprite(traitsFromImage());
});

randomBtn.addEventListener("click", () => {
  drawSprite(randomTraitsFromPreferences());
});

complexityInput.addEventListener("input", updateComplexityReadout);

fillPreferenceSelectors();
updateComplexityReadout();
drawSprite(randomTraitsFromPreferences());
