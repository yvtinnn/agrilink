/* ============================================================
   app.js — the glue that connects everything.

   1. Onboarding: first visit → 2 quick steps → done forever
   2. Tab navigation
   3. Live weather + 10-year climate history (Open-Meteo, free)
   4. Planner: crop cards + recommendation
   5. Tracker: growth roadmap with real dates
   6. Photo check: colour analysis + problem matching
   7. Public problem board
============================================================ */

// ---- The 14 parishes of Jamaica with rough map coordinates ----
const PARISHES = [
  { name: "Kingston",           lat: 17.97, lon: -76.78 },
  { name: "St. Andrew",         lat: 18.02, lon: -76.75 },
  { name: "St. Catherine",      lat: 17.99, lon: -77.06 },
  { name: "Clarendon",          lat: 17.78, lon: -77.37 },
  { name: "Manchester",         lat: 18.04, lon: -77.44 },
  { name: "St. Elizabeth",      lat: 18.07, lon: -77.68 },
  { name: "Westmoreland",       lat: 18.18, lon: -78.14 },
  { name: "Hanover",            lat: 18.36, lon: -78.12 },
  { name: "St. James",          lat: 18.35, lon: -77.90 },
  { name: "Trelawny",           lat: 18.35, lon: -77.55 },
  { name: "St. Ann",            lat: 18.29, lon: -77.20 },
  { name: "St. Mary",           lat: 18.19, lon: -76.93 },
  { name: "Portland",           lat: 18.10, lon: -76.60 },
  { name: "St. Thomas",         lat: 17.88, lon: -76.42 },
];

let currentWeather = null; // live 7-day forecast
let currentClimate = null; // 10-year average for the coming month

// ============ 1. ONBOARDING (first launch only) ============
const onboardParish = document.getElementById("onboard-parish");
PARISHES.forEach((p) => {
  const option = document.createElement("option");
  option.value = p.name;
  option.textContent = p.name;
  onboardParish.appendChild(option);
});

// show onboarding if the farmer hasn't set a location yet
if (!localStorage.getItem("agrilink-parish")) {
  document.getElementById("onboarding").classList.remove("hidden");
}

document.getElementById("onboard-next").addEventListener("click", () => {
  document.getElementById("onboard-step-1").classList.remove("active");
  document.getElementById("onboard-step-2").classList.add("active");
  onboardParish.focus();
});

// temporary spot for the location while the tutorial is showing
let pendingParish = "", pendingTown = "";

document.getElementById("onboard-finish").addEventListener("click", () => {
  pendingParish = onboardParish.value;
  pendingTown = document.getElementById("onboard-town").value.trim();
  const errorBox = document.getElementById("onboard-error");

  // keep it simple: we really just need a parish + town
  if (!pendingParish || !pendingTown) {
    errorBox.textContent = "Just pick your parish and type your town — that's all we need.";
    errorBox.classList.remove("hidden");
    return;
  }
  showTutorialStep(0);
});

document.getElementById("onboard-skip").addEventListener("click", () => {
  document.getElementById("onboarding").classList.add("hidden");
});

// ---- 3-slide tutorial (shown after location, or replayed from Home) ----
const TUTORIAL_SLIDES = [
  {
    title: "Know when to plant",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V9"/><path d="M12 9C12 5 9 3 4 3c0 5 3 8 8 6z" fill="currentColor" fill-opacity=".15"/><path d="M12 13c0-4 3-6 8-6 0 5-3 8-8 6z" fill="currentColor" fill-opacity=".3"/></svg>`,
    text: "The Planner ranks the best crops for your parish right now — using live weather and 10 years of rainfall history. It even warns you before heavy rain hits.",
  },
  {
    title: "Never miss a stage",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18"/><path d="M4 16l4-6 4 3 5-8"/></svg>`,
    text: "Pick your planting date and the Tracker builds a dated roadmap: germination, flowering, harvest — with a progress bar so you always know how far along you are.",
  },
  {
    title: "Check sick plants in seconds",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16l4-5 3 3 4-6 5 8"/><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="1.6"/></svg>`,
    text: "The camera button (bottom-left) analyses a photo of a sick plant against our dataset of common crop problems — right on your phone. You can also report problems so your whole parish can watch out.",
  },
];
let tutorialIndex = 0;

function showTutorialStep(index) {
  // move to step 3 and show slide `index`
  document.getElementById("onboard-step-1").classList.remove("active");
  document.getElementById("onboard-step-2").classList.remove("active");
  document.getElementById("onboard-step-3").classList.add("active");
  tutorialIndex = index;
  const slide = TUTORIAL_SLIDES[index];
  document.getElementById("tutorial-title").textContent = slide.title;
  document.getElementById("tutorial-icon").innerHTML = slide.icon;
  document.getElementById("tutorial-text").textContent = slide.text;
  document.getElementById("tutorial-next").textContent = index === TUTORIAL_SLIDES.length - 1 ? "Start Growing" : "Next";
  // dots
  document.getElementById("tutorial-dots").innerHTML = TUTORIAL_SLIDES
    .map((_, i) => `<span class="dot${i === index ? " on" : ""}"></span>`).join("");
}

document.getElementById("tutorial-next").addEventListener("click", () => {
  if (tutorialIndex < TUTORIAL_SLIDES.length - 1) {
    showTutorialStep(tutorialIndex + 1);
  } else {
    finishOnboarding(pendingParish, pendingTown);
  }
});

document.getElementById("tutorial-skip").addEventListener("click", () => {
  // from the tutorial we always have a location (pending or saved)
  finishOnboarding(
    pendingParish || localStorage.getItem("agrilink-parish") || "",
    pendingTown || localStorage.getItem("agrilink-town") || ""
  );
});

// Replay button on the Home card
document.getElementById("replay-tutorial").addEventListener("click", () => {
  pendingParish = localStorage.getItem("agrilink-parish") || "";
  pendingTown = localStorage.getItem("agrilink-town") || "";
  showTutorialStep(0);
  document.getElementById("onboarding").classList.remove("hidden");
});

// shared by the tutorial's Start button and the "Change" button on Home
function finishOnboarding(parish, town) {
  if (parish && town) {
    localStorage.setItem("agrilink-parish", parish);
    localStorage.setItem("agrilink-town", town);
    document.getElementById("farm-place").textContent = `${town}, ${parish}`;
    loadFarmData(parish);
    renderCrops();
  }
  document.getElementById("onboarding").classList.add("hidden");
  document.getElementById("how-it-works").classList.add("hidden"); // setup done — no longer needed
  window.scrollTo({ top: 0 });
}

// "Change" button on the Home card re-opens onboarding
document.getElementById("change-farm").addEventListener("click", () => {
  onboardParish.value = localStorage.getItem("agrilink-parish") || "";
  document.getElementById("onboard-town").value = localStorage.getItem("agrilink-town") || "";
  document.getElementById("onboard-step-1").classList.remove("active");
  document.getElementById("onboard-step-2").classList.remove("active");
  document.getElementById("onboard-step-3").classList.remove("active");
  document.getElementById("onboard-step-2").classList.add("active");
  document.getElementById("onboarding").classList.remove("hidden");
});

// ============ 2. TAB NAVIGATION ============
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => showScreen(tab.dataset.screen));
});

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.querySelectorAll(".tab").forEach((t) => {
    t.classList.toggle("active", t.dataset.screen === id);
  });
  window.scrollTo({ top: 0 });
}

// ============ 3. WEATHER & CLIMATE HISTORY ============
async function loadFarmData(parishName) {
  const chip = document.getElementById("weather-chip");
  chip.textContent = "Loading local data…";

  // --- Preferred path: our own FastAPI backend (same origin) ---
  try {
    const backend = await fetch(`/api/farm-data/${encodeURIComponent(parishName)}`);
    if (backend.ok) {
      const data = await backend.json();
      currentWeather = {
        temp: data.forecast.temp,
        rain7: data.forecast.rain_7d,
        rain3: data.forecast.rain_3d,
        live: data.forecast.live,
      };
      currentClimate = data.climate
        ? { rain: data.climate.avg_rain, years: data.climate.years_used }
        : null;
      currentWeather.daily = data.forecast.daily; // 7-day list for the forecast strip
      updateWeatherChip(true, true);
      renderFarmStats();
      checkRainAlert();
      renderTopPicks();
      renderForecastStrip();
      renderSeasonChips();
      return;
    }
  } catch {
    // no backend running (e.g. opened as a file) → use the browser path below
  }

  // --- Standalone path: call Open-Meteo directly from the browser ---
  const parish = PARISHES.find((p) => p.name === parishName);

  // A. live 7-day forecast
  try {
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${parish.lat}&longitude=${parish.lon}` +
      "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum" +
      "&forecast_days=7&timezone=auto";
    const response = await fetch(url);
    if (!response.ok) throw new Error("forecast request failed");
    const data = await response.json();
    currentWeather = {
      temp: Math.round((data.daily.temperature_2m_max[0] + data.daily.temperature_2m_min[0]) / 2),
      rain7: Math.round(data.daily.precipitation_sum.reduce((a, b) => a + b, 0)),
      rain3: data.daily.precipitation_sum.slice(0, 3).map((mm) => Math.round(mm)),
      daily: data.daily.precipitation_sum.slice(0, 7).map((mm, i) => ({
        rain: Math.round(mm),
        tmax: Math.round(data.daily.temperature_2m_max[i]),
      })),
      live: true,
    };
  } catch {
    // Offline or blocked? Use realistic sample data so the app never breaks.
    currentWeather = { temp: 27, rain7: 24, live: false };
  }

  // B. 10-year climate history for the same month each year
  try {
    const now = new Date();
    const thisYear = now.getFullYear();
    let rainSum = 0, years = 0;
    const results = await Promise.all(
      Array.from({ length: 10 }, (_, i) => fetchClimateYear(parish, thisYear - 1 - i, now))
    );
    for (const rain of results) {
      if (rain !== null) { rainSum += rain; years++; }
    }
    if (years > 0) currentClimate = { rain: Math.round(rainSum / years), years };
  } catch {
    currentClimate = null; // the recommendation falls back gracefully
  }

  updateWeatherChip(currentWeather.live, !!currentClimate);
  renderFarmStats();
  checkRainAlert();
  renderTopPicks();
  renderForecastStrip();
  renderSeasonChips();
}

// 7-day forecast strip: one open column per day, rain bars warn about heavy days.
function renderForecastStrip() {
  const strip = document.getElementById("forecast-strip");
  if (!currentWeather || !currentWeather.daily) {
    strip.textContent = "Forecast unavailable — showing sample data only.";
    return;
  }
  const today = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  strip.innerHTML = "";
  currentWeather.daily.forEach((day, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const col = document.createElement("div");
    col.className = "forecast-day" + (day.rain >= 20 ? " wet" : "");
    col.innerHTML =
      `<span class="f-day">${i === 0 ? "Today" : dayNames[date.getDay()]}</span>` +
      `<span class="f-temp">${day.tmax}°</span>` +
      `<span class="f-rain">${day.rain} mm</span>`;
    strip.appendChild(col);
  });
}

// "Planting right now" chips: crops whose season is open this month.
function renderSeasonChips() {
  const box = document.getElementById("season-chips");
  const month = new Date().getMonth() + 1;
  const inSeason = CROPS.filter((c) => c.bestMonths.includes(month));
  box.innerHTML = "";
  if (!inSeason.length) {
    box.innerHTML = `<p class="muted small">Nothing is in season this month — check the top picks above for what's closest.</p>`;
    return;
  }
  inSeason.forEach((crop) => {
    const index = CROPS.indexOf(crop);
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.innerHTML = `<span class="icon">${CROP_ICONS[crop.name]}</span>${crop.name}`;
    chip.addEventListener("click", () => showPlan(index));
    box.appendChild(chip);
  });
}

// One line of live status in the top bar.
function updateWeatherChip(hasWeather, hasClimate) {
  const chip = document.getElementById("weather-chip");
  if (!hasWeather) { chip.textContent = "Weather unavailable — sample data in use"; return; }
  const liveLabel = currentWeather.live ? "live" : "sample";
  const climateLabel = hasClimate ? `${currentClimate.years}-yr avg ${currentClimate.rain} mm/mo` : "climate offline";
  chip.textContent = `${currentWeather.temp}°C · ${currentWeather.rain7} mm/7d · ${climateLabel} (${liveLabel})`;
}

// Small stat strip on the Home "your farm" card.
function renderFarmStats() {
  const box = document.getElementById("farm-stats");
  if (!currentWeather) return;
  box.classList.remove("hidden");
  const climate = currentClimate ? `${currentClimate.rain}<small> mm/mo</small>` : "–";
  box.innerHTML =
    `<div class="stat"><span class="label">Temp now</span><span class="value">${currentWeather.temp}<small> °C</small></span></div>` +
    `<div class="stat"><span class="label">Rain 7 days</span><span class="value">${currentWeather.rain7}<small> mm</small></span></div>` +
    `<div class="stat"><span class="label">10-yr avg</span><span class="value">${climate}</span></div>`;
}

// Rain alert: warn BEFORE heavy rain arrives so farmers can plan around it.
function checkRainAlert() {
  const banner = document.getElementById("rain-alert");
  const rain3 = currentWeather && currentWeather.rain3;
  if (!rain3) { banner.classList.add("hidden"); return; }

  const heavyDays = [];
  const today = new Date();
  for (let i = 0; i < rain3.length; i++) {
    if (rain3[i] >= 20) {
      const day = new Date(today);
      day.setDate(day.getDate() + i);
      heavyDays.push(`${rain3[i]} mm on ${day.toLocaleDateString(undefined, { weekday: "long" })}`);
    }
  }

  if (heavyDays.length) {
    document.getElementById("rain-alert-text").textContent =
      `${heavyDays.join(", ")} expected. Hold off planting and spraying until it passes — good time for mulching instead.`;
    banner.classList.remove("hidden");
  } else {
    banner.classList.add("hidden");
  }
}

// TOP PICKS: score every crop for this parish and show the best 3.
// This is the "what should I plant right now" answer, no clicking needed.
function renderTopPicks() {
  const box = document.getElementById("top-picks");
  if (!currentWeather && !currentClimate) { box.innerHTML = ""; return; }

  const parish = localStorage.getItem("agrilink-parish");
  if (parish) document.getElementById("picks-parish").textContent = parish;

  const scored = CROPS.map((crop, index) => ({
    crop, index,
    rec: recommendCrop(crop, currentWeather, currentClimate),
  })).sort((a, b) => b.rec.score - a.rec.score);

  box.innerHTML = "";
  scored.slice(0, 3).forEach((entry, rank) => {
    const row = document.createElement("div");
    row.className = "pick";
    row.innerHTML =
      `<span class="rank">${rank + 1}</span>` +
      `<span class="icon">${CROP_ICONS[entry.crop.name]}</span>` +
      `<span class="pick-info">` +
        `<span class="pick-name">${entry.crop.name}</span>` +
        `<div class="pick-why">${entry.rec.verdict} · rain ${entry.rec.rain} mm · ${entry.rec.score}% fit</div>` +
      `</span>` +
      `<span class="pick-score"><span class="num">${entry.rec.score}%</span>` +
        `<div class="bar"><div style="width:${entry.rec.score}%"></div></div></span>`;
    row.addEventListener("click", () => {
      showScreen("screen-planner");
      showPlan(entry.index);
    });
    box.appendChild(row);
  });
}

// Rainfall total for `month` of `year`, at this parish.
async function fetchClimateYear(parish, year, now) {
  const month = now.getMonth(); // 0-based
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0); // last day of that month
  const fmt = (d) => d.toISOString().slice(0, 10);

  const url =
    "https://archive-api.open-meteo.com/v1/archive" +
    `?latitude=${parish.lat}&longitude=${parish.lon}` +
    `&start_date=${fmt(start)}&end_date=${fmt(end)}` +
    "&daily=precipitation_sum&timezone=auto";

  const response = await fetch(url);
  if (!response.ok) return null;
  const data = await response.json();
  const days = data.daily.precipitation_sum || [];
  if (!days.length) return null;
  return days.reduce((a, b) => a + (b ?? 0), 0);
}

// ============ 4. PLANNER SCREEN ============
function renderCrops() {
  const grid = document.getElementById("crop-grid");
  grid.innerHTML = "";

  CROPS.forEach((crop, index) => {
    const tile = document.createElement("button");
    tile.className = "crop-tile";
    tile.type = "button";
    tile.innerHTML =
      `<span class="icon">${CROP_ICONS[crop.name]}</span>` +
      `<span class="crop-name">${crop.name}</span>` +
      `<span class="crop-months">Best: ${crop.bestMonths.map(monthName).join(", ")}</span>`;
    tile.addEventListener("click", () => showPlan(index));
    grid.appendChild(tile);
  });
}

function showPlan(index) {
  const crop = CROPS[index];
  document.querySelectorAll(".crop-tile").forEach((t, i) => {
    t.classList.toggle("selected", i === index);
  });

  const rec = recommendCrop(crop, currentWeather, currentClimate);

  document.getElementById("plan-result").classList.remove("hidden");
  document.getElementById("plan-title").textContent = `${crop.name} — Planting Advice`;
  document.getElementById("plan-verdict").textContent = rec.verdict;
  document.getElementById("plan-verdict").className = "verdict " + rec.cls;

  // the three key numbers, as clean stat tiles
  const climateRain = rec.climateRain ? `${rec.climateRain}<small> mm/mo</small>` : "–";
  document.getElementById("plan-stats").innerHTML =
    `<div class="stat"><span class="label">Forecast</span><span class="value">${rec.rain}<small> mm/7d</small></span></div>` +
    `<div class="stat"><span class="label">Climate avg</span><span class="value">${climateRain}</span></div>` +
    `<div class="stat"><span class="label">Temp</span><span class="value">${rec.temp}<small> °C</small></span></div>`;

  document.getElementById("confidence-bar").style.width = rec.score + "%";
  document.getElementById("confidence-label").textContent =
    `Confidence ${rec.score}% — season + parish climate history + 7-day forecast.`;

  document.getElementById("plan-details").innerHTML =
    rec.facts.map((f) =>
      `<div class="fact"><span class="mark ${f.cls}">${f.mark}</span><span>${f.text}</span></div>`
    ).join("") +
    `<div class="fact"><span class="mark">·</span><span><b>Best months:</b> ${crop.bestMonths.map(monthName).join(", ")}.</span></div>` +
    `<div class="fact"><span class="mark">·</span><span>Planted today, you'd harvest around <b>${harvestDate(crop)}</b>.</span></div>`;

  // Also pre-select this crop in the tracker and photo check
  document.getElementById("track-crop").value = crop.name;
  syncPhotoCrop();
}

// Add up the crop's total days to estimate the harvest date.
function harvestDate(crop) {
  const totalDays = crop.stages.reduce((sum, stage) => sum + stage.days, 0);
  const date = new Date();
  date.setDate(date.getDate() + totalDays);
  return date.toLocaleDateString(undefined, { day: "numeric", month: "long" });
}

// SHARE: turn the plan into a short text farmers can paste into WhatsApp.
document.getElementById("share-plan").addEventListener("click", async () => {
  const crop = CROPS.find((c) => c.name === document.getElementById("track-crop").value);
  const rec = recommendCrop(crop, currentWeather, currentClimate);
  const place = `${localStorage.getItem("agrilink-town") || ""}, ${localStorage.getItem("agrilink-parish") || ""}`.replace(/^, /, "");
  const text =
    `AgriLink plan — ${place}\n` +
    `${crop.name}: ${rec.verdict} (${rec.score}% confidence)\n` +
    `Best months: ${crop.bestMonths.map(monthName).join(", ")}\n` +
    `Planted now → harvest around ${harvestDate(crop)}\n` +
    `Rain this week: ${rec.rain} mm · Temp: ${rec.temp}°C`;

  if (navigator.share) {
    try { await navigator.share({ title: "AgriLink plan", text }); } catch { /* user cancelled */ }
  } else {
    await navigator.clipboard.writeText(text);
    const btn = document.getElementById("share-plan");
    btn.textContent = "Copied! Paste it in WhatsApp";
    setTimeout(() => { btn.textContent = "Copy plan to share (WhatsApp)"; }, 2000);
  }
});

// ============ 5. TRACKER SCREEN ============
const trackCropSelect = document.getElementById("track-crop");
CROPS.forEach((crop) => {
  const option = document.createElement("option");
  option.value = crop.name;
  option.textContent = crop.name;
  trackCropSelect.appendChild(option);
});

// default the planting date to today
document.getElementById("track-date").value = new Date().toISOString().slice(0, 10);

document.getElementById("build-timeline").addEventListener("click", () => {
  const cropName = trackCropSelect.value;
  const crop = CROPS.find((c) => c.name === cropName);
  const plantingDate = new Date(document.getElementById("track-date").value + "T12:00:00");

  const roadmap = buildRoadmap(crop, plantingDate);
  const today = new Date();

  document.getElementById("timeline-output").classList.remove("hidden");

  // how far through the journey are we? (both measured in days)
  const totalDays = (roadmap[roadmap.length - 1].date - plantingDate) / (1000 * 60 * 60 * 24);
  const daysIn = Math.max(0, (today - plantingDate) / (1000 * 60 * 60 * 24));
  const percent = Math.min(100, Math.round((daysIn / totalDays) * 1000) / 10);
  document.getElementById("progress-fill").style.width = percent + "%";
  document.getElementById("progress-text").textContent =
    daysIn <= 0
      ? `Roadmap ready — it starts on your chosen planting date.`
      : `${Math.round(daysIn)} days since planting — ${percent}% of the way to harvest.`;

  const timeline = document.getElementById("timeline");
  timeline.innerHTML = "";

  roadmap.forEach((stage) => {
    const div = document.createElement("div");
    const isDone = stage.date < today;
    const isCurrent = !isDone && stage === roadmap.find((s) => s.date >= today);

    div.className = "stage" + (isDone ? " done" : "") + (isCurrent ? " current" : "");

    const dateStr = stage.date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
    div.innerHTML =
      `<b>${stage.name}</b> · <span class="date">${dateStr}</span>` +
      `<div class="tip">${stage.tip}</div>`;
    timeline.appendChild(div);
  });
});

// ============ PHOTO CHECK FAB (bottom-left button) ============
document.getElementById("photo-fab").addEventListener("click", () => {
  showScreen("screen-photo");
});

// ============ 6. PHOTO CHECK ============
document.getElementById("photo-btn").addEventListener("click", () => {
  document.getElementById("photo-input").click(); // opens the camera or photo picker
});

// which crop the photo belongs to (syncs with the planner/tracker choice)
const photoCropSelect = document.getElementById("photo-crop");
CROPS.forEach((crop) => {
  const option = document.createElement("option");
  option.value = crop.name;
  option.textContent = crop.name;
  photoCropSelect.appendChild(option);
});

document.getElementById("photo-input").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const img = document.getElementById("photo-img");
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    document.getElementById("photo-preview").classList.remove("hidden");

    // 1. count the colours in the LEAF area of the photo
    const analysis = analysePhoto(img);
    const bars = document.getElementById("photo-bars");

    // 2. not enough plant in the photo? say so instead of guessing
    if (analysis.leafPct < 15) {
      bars.innerHTML = `<p class="muted small">We can't see enough plant in this photo (only ${analysis.leafPct}% leaf).
        Try again with the leaf filling most of the frame, in good light.</p>`;
      document.getElementById("photo-matches").innerHTML = "";
      document.getElementById("photo-result").classList.remove("hidden");
      return;
    }

    bars.innerHTML =
      colourBar("Healthy green", analysis.greenPct, "#2e9e55") +
      colourBar("Yellowing", analysis.yellowPct, "#e0b03a") +
      colourBar("Brown / dry", analysis.brownPct, "#a3703f") +
      colourBar("Dark spots", analysis.darkPct, "#4a3b2a");

    // 3. use the crop chosen right here on this screen
    const cropName = photoCropSelect.value;

    // 4. match against the problem dataset
    const matches = matchProblems(analysis, cropName);
    const box = document.getElementById("photo-matches");
    box.innerHTML =
      `<p class="small muted">Checking as: <b>${cropName}</b></p>` +
      matches.slice(0, 3).map((m) =>
        `<div class="match">
           <div class="match-head"><b>${m.problem.name}</b>
             <span class="match-score">${m.score}% match</span></div>
           <div class="small muted"><b>Looks like:</b> ${m.problem.looksLike}</div>
           <div class="small"><b>What to do:</b> ${m.problem.fix}</div>
         </div>`
      ).join("");

    document.getElementById("photo-result").classList.remove("hidden");
  };
});

// one labelled progress bar for the colour report
function colourBar(label, pct, colour) {
  return `<div class="colour-row">
    <span class="colour-label">${label}</span>
    <div class="colour-track"><div class="colour-fill" style="width:${pct}%; background:${colour}"></div></div>
    <span class="colour-pct">${pct}%</span>
  </div>`;
}

// keep the photo-check crop in sync when the farmer checks a different crop
function syncPhotoCrop() {
  photoCropSelect.value = document.getElementById("track-crop").value;
}

// ============ 7. COMMUNITY ============
document.getElementById("chat-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const messageBox = document.getElementById("chat-message");
  const nameBox = document.getElementById("chat-name");
  if (nameBox.value.trim()) localStorage.setItem("agrilink-name", nameBox.value.trim()); // save FIRST so the message shows as "mine"
  sendMessage(nameBox.value.trim(), messageBox.value.trim());
  messageBox.value = "";
});

// ============ START THE APP ============
renderChat();
renderReports();

const savedParish = localStorage.getItem("agrilink-parish");
if (savedParish) {
  // returning user → fill in the farm card and load data
  const savedTown = localStorage.getItem("agrilink-town") || "";
  document.getElementById("farm-place").textContent = `${savedTown}, ${savedParish}`;
  document.getElementById("how-it-works").classList.add("hidden"); // setup done
  loadFarmData(savedParish);
  renderCrops();
  renderTopPicks();
  syncPhotoCrop();
}
