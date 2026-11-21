/* ============================================================
   problems.js — two things live here:

   1. PROBLEMS: our dataset of common crop problems in Jamaica.
      Each one lists what it looks like on a leaf and how the
      photo analyser should recognise it (which colours dominate).
      The same dataset is used by the photo checker and the
      public problem board.

   2. The photo analyser: a simple, honest colour check.
      It counts healthy-green / yellow / brown pixels and finds
      the problems whose "pattern" best matches. It is NOT a
      lab test — the app says so right on the results card.

   3. The public problem board: farmers report problems they
      see; reports are saved in the browser so the board grows.
============================================================ */

// ---- Problem dataset -------------------------------------------------
// pattern: the colour mix typical of this problem.
//   yellow = chlorosis / yellowing      brown = drying / dead tissue
//   spots  = works best with visible dark patches
const PROBLEMS = [
  {
    name: "Nitrogen deficiency",
    crops: ["Tomato", "Cabbage", "Corn", "Callaloo", "Okra"],
    pattern: { yellow: [40, 90], brown: [0, 20], spots: false },
    looksLike: "Whole leaves turning evenly pale-yellow, starting from the bottom of the plant. Growth is slow.",
    fix: "Add organic matter or a balanced fertiliser. Chicken manure or nitrogen-rich fertiliser works fast. Do not overdo it.",
  },
  {
    name: "Water stress (drought)",
    crops: ["Tomato", "Cabbage", "Corn", "Callaloo", "Pumpkin", "Okra"],
    pattern: { yellow: [10, 45], brown: [25, 80], spots: false },
    looksLike: "Leaves drying from the edges inward, brown and crispy. Worst in the afternoon sun.",
    fix: "Water early morning or late evening. Mulch heavily around plants to hold moisture in the soil.",
  },
  {
    name: "Early blight (fungus)",
    crops: ["Tomato", "Sweet Potato"],
    pattern: { yellow: [25, 60], brown: [20, 60], spots: true },
    looksLike: "Brown patches with a yellow ring around them, usually on older leaves first.",
    fix: "Remove and burn affected leaves (do not compost). Keep water off the leaves. A copper-based fungicide helps.",
  },
  {
    name: "Waterlogging / root rot",
    crops: ["Tomato", "Corn", "Cabbage", "Callaloo"],
    pattern: { yellow: [35, 80], brown: [15, 45], spots: false },
    looksLike: "Leaves yellowing all over after heavy rain, plant wilting even though soil is wet.",
    fix: "Make drains so water can escape. Raise beds. Let the soil dry out before watering again.",
  },
  {
    name: "Army worm / caterpillar damage",
    crops: ["Corn", "Callaloo", "Cabbage", "Tomato"],
    pattern: { yellow: [15, 45], brown: [20, 55], spots: true },
    looksLike: "Irregular holes eaten in leaves and chewed edges. You may find the worms at dawn or dusk.",
    fix: "Hand-pick at dawn/dusk, or use a Bt (biological) spray which is safe. Check plants every 2 days.",
  },
  {
    name: "Sun scorch",
    crops: ["Tomato", "Sweet Potato", "Cabbage", "Callaloo"],
    pattern: { yellow: [10, 40], brown: [30, 70], spots: false },
    looksLike: "Pale, bleached or papery patches on the side of the plant facing the sun.",
    fix: "Shade young plants with shade cloth or palm branches during extreme heat waves.",
  },
  {
    name: "Powdery mildew",
    crops: ["Pumpkin", "Okra", "Sweet Potato"],
    pattern: { yellow: [20, 55], brown: [5, 30], spots: true },
    looksLike: "White or grey powder-like patches on top of leaves.",
    fix: "Improve air flow between plants, avoid overhead watering. Baking-soda spray (1 tbsp per litre) is a known home remedy.",
  },
  {
    name: "Healthy plant",
    crops: ["all"],
    pattern: { yellow: [0, 15], brown: [0, 10], spots: false },
    looksLike: "Mostly deep green leaves with even colour.",
    fix: "Keep doing what you're doing. Check weekly so you catch problems early.",
  },
];

// ---- Photo analyser --------------------------------------------------
// We shrink the photo, count the pixels in three colour families,
// and compare the mix with each problem's pattern.
function analysePhoto(img) {
  const size = 160; // small = fast on phones
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  // draw the photo "cover" style so it fills the square
  const scale = Math.max(size / img.width, size / img.height);
  const w = img.width * scale, h = img.height * scale;
  ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
  const pixels = ctx.getImageData(0, 0, size, size).data;

  let total = 0, green = 0, yellow = 0, brown = 0, other = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
    // skip near-white (background) and near-black (shadow) pixels
    const bright = (r + g + b) / 3;
    if (bright > 235 || bright < 25) continue;
    total++;

    if (g > r && g > b && g > 60) green++;                     // healthy leaf green
    else if (r > 90 && g > 80 && b < g * 0.75 && r >= g) yellow++; // yellowing
    else if (r > 60 && r > g && g > b) brown++;                // brown / dry
    else other++;                                              // soil, sky, etc.
  }

  // turn counts into percentages of the counted pixels
  const pct = (n) => total ? Math.round((n / total) * 100) : 0;
  return { greenPct: pct(green), yellowPct: pct(yellow), brownPct: pct(brown), otherPct: pct(other) };
}

// Which problems match this colour mix best?
// For each problem we check if the detected % falls inside its
// expected range — the more checks pass, the higher the match score.
function matchProblems(analysis, cropName) {
  const results = [];
  for (const problem of PROBLEMS) {
    // skip problems that don't affect this crop
    if (problem.crops.includes("all") === false && !problem.crops.includes(cropName)) continue;

    let checks = 0, passes = 0;
    for (const key of ["yellow", "brown"]) {
      const [low, high] = problem.pattern[key];
      const detected = key === "yellow" ? analysis.yellowPct : analysis.brownPct;
      checks++;
      if (detected >= low && detected <= high) passes++;
    }
    const score = Math.round((passes / checks) * 100);
    results.push({ problem, score });
  }
  results.sort((a, b) => b.score - a.score);
  return results;
}

// ---- Public problem board --------------------------------------------
const SEED_REPORTS = [
  { crop: "Callaloo", problem: "Army worm / caterpillar damage", parish: "St. Elizabeth", note: "Small green worms eating holes in most of the field.", when: "2 days ago" },
  { crop: "Tomato", problem: "Water stress (drought)", parish: "Clarendon", note: "Bottom leaves drying out even though we water twice a week.", when: "2 days ago" },
  { crop: "Corn", problem: "Nitrogen deficiency", parish: "St. Mary", note: "Yellow starting from bottom leaves on the hillside plot.", when: "1 day ago" },
  { crop: "Pumpkin", problem: "Powdery mildew", parish: "Manchester", note: "White dust appearing on the big leaves.", when: "8 hours ago" },
];

function loadReports() {
  const saved = localStorage.getItem("agrilink-reports");
  if (saved) return JSON.parse(saved);
  localStorage.setItem("agrilink-reports", JSON.stringify(SEED_REPORTS));
  return SEED_REPORTS;
}

function saveReports(reports) {
  localStorage.setItem("agrilink-reports", JSON.stringify(reports));
}

function addReport(crop, problem, note, parish) {
  const reports = loadReports();
  reports.unshift({
    crop: crop,
    problem: problem,
    parish: parish || localStorage.getItem("agrilink-parish") || "Unknown parish",
    note: note || "",
    when: "just now",
    mine: true,
  });
  saveReports(reports);
  renderReports();
}

function renderReports() {
  const feed = document.getElementById("report-feed");
  feed.innerHTML = "";
  for (const report of loadReports()) {
    const card = document.createElement("div");
    card.className = "report" + (report.mine ? " mine" : "");
    const top = document.createElement("div");
    top.className = "report-top";
    top.innerHTML = `<b>${report.crop}</b> · ${report.problem}`;
    const meta = document.createElement("div");
    meta.className = "report-meta";
    meta.textContent = `${report.parish} · ${report.when}`;
    card.append(top);
    if (report.note) {
      const note = document.createElement("div");
      note.className = "report-note";
      note.textContent = report.note;
      card.appendChild(note);
    }
    card.appendChild(meta);
    feed.appendChild(card);
  }
}
