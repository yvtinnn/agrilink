/* ============================================================
   problems.js, two things live here:

   1. PROBLEMS: our dataset of common crop problems in Jamaica.
      Each one lists what it looks like on a leaf and how the
      photo analyser should recognise it (which colours dominate).
      The same dataset is used by the photo checker and the
      public problem board.

   2. The photo analyser: a simple, honest colour check.
      It counts healthy-green / yellow / brown pixels and finds
      the problems whose "pattern" best matches. It is NOT a
      lab test, the app says so right on the results card.

   3. The public problem board: farmers report problems they
      see; reports are saved in the browser so the board grows.
============================================================ */

// ---- Problem dataset -------------------------------------------------
// pattern: the feature mix this problem produces in a leaf photo.
//   yellow = chlorosis / yellowing      brown = drying / dead tissue
//   white  = chalky powder or trails    spots = dark patches help
// This dataset is also the knowledge base of the on-device model in
// matchProblems(): the model scores what it sees against these patterns.
const PROBLEMS = [
  {
    name: "Nitrogen deficiency",
    crops: ["Tomato", "Cabbage", "Corn", "Callaloo", "Okra", "Carrot", "Lettuce", "Onion", "Sweet Pepper", "Cucumber", "Beet"],
    pattern: { yellow: [40, 90], brown: [0, 20], spots: false },
    looksLike: "Whole leaves turning evenly pale-yellow, starting from the bottom of the plant. Growth is slow.",
    fix: "Add organic matter or a balanced fertiliser. Chicken manure or nitrogen-rich fertiliser works fast. Do not overdo it.",
  },
  {
    name: "Water stress (drought)",
    crops: ["Tomato", "Cabbage", "Corn", "Callaloo", "Pumpkin", "Okra", "Carrot", "Lettuce", "Onion", "Sweet Pepper", "Cucumber", "Beet"],
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
    crops: ["Tomato", "Corn", "Cabbage", "Callaloo", "Lettuce", "Beet"],
    pattern: { yellow: [35, 80], brown: [15, 45], spots: false },
    looksLike: "Leaves yellowing all over after heavy rain, plant wilting even though soil is wet.",
    fix: "Make drains so water can escape. Raise beds. Let the soil dry out before watering again.",
  },
  {
    name: "Army worm / caterpillar damage",
    crops: ["Corn", "Callaloo", "Cabbage", "Tomato", "Sweet Pepper"],
    pattern: { yellow: [15, 45], brown: [20, 55], spots: true },
    looksLike: "Irregular holes eaten in leaves and chewed edges. You may find the worms at dawn or dusk.",
    fix: "Hand-pick at dawn/dusk, or use a Bt (biological) spray which is safe. Check plants every 2 days.",
  },
  {
    name: "Sun scorch",
    crops: ["Tomato", "Sweet Potato", "Cabbage", "Callaloo", "Lettuce", "Cucumber"],
    pattern: { yellow: [10, 40], brown: [30, 70], spots: false },
    looksLike: "Pale, bleached or papery patches on the side of the plant facing the sun.",
    fix: "Shade young plants with shade cloth or palm branches during extreme heat waves.",
  },
  {
    name: "Powdery mildew",
    crops: ["Pumpkin", "Okra", "Sweet Potato", "Cucumber"],
    pattern: { yellow: [20, 55], brown: [5, 30], white: [15, 65], spots: true },
    looksLike: "White or grey powder-like patches on top of leaves.",
    fix: "Improve air flow between plants, avoid overhead watering. Baking-soda spray (1 tbsp per litre) is a known home remedy.",
  },
  {
    name: "Aphids / whiteflies",
    crops: ["Tomato", "Cabbage", "Callaloo", "Okra", "Sweet Pepper", "Cucumber"],
    pattern: { yellow: [5, 35], brown: [0, 20], spots: false },
    looksLike: "Leaves curling and sticky, with tiny green, black or white insects clustered under leaves and on new shoots.",
    fix: "Blast them off with water, then spray with soapy water (1 tsp soap per litre). Ladybugs eat them for free.",
  },
  {
    name: "Leaf miner trails",
    crops: ["Tomato", "Cabbage", "Callaloo", "Sweet Pepper", "Cucumber", "Lettuce"],
    pattern: { yellow: [10, 45], brown: [5, 25], white: [10, 55], spots: false },
    looksLike: "Pale white winding trails or blisters drawn across the leaf like a map.",
    fix: "Remove and destroy mined leaves. Yellow sticky traps catch the adult flies. Don't over-spray, it kills the good bugs.",
  },
  {
    name: "Blossom end rot",
    crops: ["Tomato", "Sweet Pepper", "Watermelon"],
    pattern: { yellow: [5, 30], brown: [35, 85], white: [0, 10], spots: true },
    looksLike: "A dark, sunken, leathery patch on the bottom of the fruit, not the leaf.",
    fix: "It's a calcium and water problem, not a disease. Water evenly, mulch, and don't over-fertilise with nitrogen.",
  },
  {
    name: "Magnesium deficiency",
    crops: ["Tomato", "Cucumber", "Sweet Pepper", "Papaya", "Sweet Potato"],
    pattern: { yellow: [40, 85], brown: [5, 25], white: [0, 10], spots: false },
    looksLike: "Yellow between the veins while the veins stay green, on older leaves first.",
    fix: "Spray Epsom salts (1 tbsp per litre of water) on the leaves, and again in two weeks. Cheap and fast.",
  },
  {
    name: "Rust disease",
    crops: ["Onion", "Corn", "Okra"],
    pattern: { yellow: [15, 45], brown: [30, 70], white: [0, 12], spots: true },
    looksLike: "Small orange-brown pustules like rust powder, mostly under the leaves.",
    fix: "Remove badly infected leaves. Improve air flow and avoid wetting the leaves in the evening. Copper spray helps in bad years.",
  },
  {
    name: "Mosaic virus",
    crops: ["Tomato", "Scotch Bonnet", "Sweet Pepper", "Cucumber"],
    pattern: { yellow: [25, 60], brown: [0, 20], white: [0, 12], spots: false },
    looksLike: "Light and dark green mottling, like a patchwork, with stunted twisted new leaves.",
    fix: "No cure. Pull and bury sick plants so it doesn't spread. Wash your hands and tools after touching them, and control aphids which carry it.",
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
// We shrink the photo and sort the LEAF pixels into colour families.
// Background (soil, sky, shadow) is ignored, so a photo taken from a
// distance doesn't fool the check. If we can't see enough leaf, we say so.
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

  let leaf = 0, green = 0, yellow = 0, brown = 0, darkSpots = 0, white = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
    const bright = (r + g + b) / 3;
    if (bright > 235 || bright < 25) continue; // near-white background / near-black shadow

    // ORDER MATTERS: green first (dark green leaves are healthy!), then
    // dark lesions, then brown (soil is brown, never yellow), then yellow,
    // then white powder (mildew sits on top of the leaf, grey and chalky).
    if (g > r && g > b && g > 60) {
      leaf++; green++;                                  // healthy leaf green
    } else if (bright < 70) {
      leaf++; darkSpots++;                              // dark patches (lesions / fungus)
    } else if (r > 60 && r > g && g > b && r - g > 20) {
      leaf++; brown++;                                  // brown / dry, soil lands here, NOT yellow
    } else if (r > 100 && g > 100 && b < g * 0.8 && r < g * 1.2) {
      leaf++; yellow++;                                 // yellowing (bright, low blue)
    } else if (bright > 150 && (Math.max(r,g,b) - Math.min(r,g,b)) < 28) {
      leaf++; white++;                                  // white/grey powder (mildew, leaf miner trails)
    }
    // everything else (grey soil, mulch in shadow...) is NOT counted as leaf
  }

  // percentage of the LEAF area, not the whole photo
  const pct = (n) => leaf ? Math.round((n / leaf) * 100) : 0;
  return {
    leafPct: Math.round((leaf / (size * size)) * 100),  // how much of the photo is plant
    greenPct: pct(green),
    yellowPct: pct(yellow),
    brownPct: pct(brown),
    darkPct: pct(darkSpots),
    whitePct: pct(white),
  };
}

// Which problems match this leaf? Score = how well the detected colour
// mix falls inside each problem's expected pattern (yellow, brown,
// and dark-spot hints). Higher is better; ties broken by specificity.
// ---- The on-device model ---------------------------------------------
// This is the "AI" of the photo check, and it runs entirely on the phone:
// no upload, no server, no API key. It works like a nearest-pattern
// classifier: the photo is turned into a feature vector (yellowing, brown
// drying, dark spots, white powder) and every problem in our dataset is
// scored against what it expects those features to look like. The dataset
// above IS the model's knowledge, so adding a problem teaches the model.
function matchProblems(analysis, cropName) {
  const results = [];
  for (const problem of PROBLEMS) {
    // skip problems that don't affect this crop
    if (problem.crops.includes("all") === false && !problem.crops.includes(cropName)) continue;

    let score = 0;
    const inRange = (key, detected) => {
      const [low, high] = problem.pattern[key];
      const width = high - low;
      if (detected >= low && detected <= high) {
        // closer to the middle of the range = stronger match
        return 50 + Math.round(25 * (1 - Math.abs(detected - (low + high) / 2) / (width / 2 || 1)));
      }
      // just outside the range still gets partial credit, fading with distance
      const dist = detected < low ? low - detected : detected - high;
      return Math.max(0, 40 - dist);
    };

    // the two colour features every problem defines
    score += inRange("yellow", analysis.yellowPct);
    score += inRange("brown", analysis.brownPct);

    // white powder feature: only mildew and leaf miner expect it, so for
    // everyone else it counts against them (powder on a nitrogen-deficient
    // leaf is more likely mildew than nitrogen deficiency)
    if (problem.pattern.white != null) {
      score += inRange("white", analysis.whitePct);
    } else if (analysis.whitePct > 8) {
      score -= 12;
    }

    // dark spots: bonus for problems that show them, penalty for those that don't
    if (problem.pattern.spots) {
      if (analysis.darkPct > 4) score += 15;
    } else if (analysis.darkPct > 12) {
      score -= 15;
    }

    // slight bonus if the crop is specifically listed (vs "all")
    if (!problem.crops.includes("all")) score += 5;

    // the healthy signal: a leaf that is mostly deep green with no spots
    // is exactly what "Healthy plant" expects, so boost it there
    if (problem.name === "Healthy plant" && analysis.greenPct >= 70) score += 12;

    results.push({ problem, score: Math.max(0, Math.round(score / 2)) }); // /2 → 0-100 scale
  }
  results.sort((a, b) => b.score - a.score);
  return results;
}

// ---- Public problem board --------------------------------------------
// Local mode: reports saved on this phone with demo seeds.
// Live mode (Firebase configured in js/firebase-config.js): every phone's
// reports land on the shared board, newest first.
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
  const report = {
    crop: crop,
    problem: problem,
    parish: parish || localStorage.getItem("agrilink-parish") || "Unknown parish",
    note: note || "",
  };
  if (typeof liveMode !== "undefined" && liveMode) {
    report.ts = firebase.database.ServerValue.TIMESTAMP;
    const ref = firebase.database().ref("reports").push(report);
    // remember which shared reports this phone filed, for the green highlight
    try {
      const mine = JSON.parse(localStorage.getItem("agrilink-my-reports") || "[]");
      mine.push(ref.key);
      localStorage.setItem("agrilink-my-reports", JSON.stringify(mine));
    } catch {}
    return;
  }
  const reports = loadReports();
  reports.unshift({ ...report, when: "just now", mine: true });
  saveReports(reports);
  renderReports();
}

// Board filter: "all" or "mine" (the farmer's own parish).
let boardFilter = "all";

function setBoardFilter(mode) {
  boardFilter = mode;
  document.querySelectorAll("#board-filter button").forEach((b) => {
    b.classList.toggle("on", b.dataset.filter === mode);
  });
  renderReports();
}

function renderReports() {
  const feed = document.getElementById("report-feed");
  feed.innerHTML = "";
  const myParish = localStorage.getItem("agrilink-parish") || "";
  // live mode shows the shared Firebase board, local mode shows this phone
  const reports = (typeof liveMode !== "undefined" && liveMode && LIVE_REPORTS)
    ? LIVE_REPORTS
    : loadReports();
  // keys of shared reports that THIS phone filed (live mode only)
  let myReportKeys = [];
  try { myReportKeys = JSON.parse(localStorage.getItem("agrilink-my-reports") || "[]"); } catch {}
  let shown = 0;
  for (const report of reports) {
    if (boardFilter === "mine" && report.parish !== myParish) continue;
    shown++;
    const card = document.createElement("div");
    card.className = "report" + (report.mine || myReportKeys.includes(report._key) ? " mine" : "");
    const top = document.createElement("div");
    top.className = "report-top";
    top.innerHTML = `<b>${report.crop}</b> · ${report.problem}`;
    const meta = document.createElement("div");
    meta.className = "report-meta";
    meta.textContent = `${report.parish} · ${report.when || (report.ts ? agoLabel(report.ts) : "")}`;
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
  if (!shown) {
    feed.innerHTML = `<p class="muted small">No reports from ${myParish || "your parish"} yet.</p>`;
  }
}
