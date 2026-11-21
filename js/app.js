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

document.getElementById("onboard-finish").addEventListener("click", () => {
  const parish = onboardParish.value;
  const town = document.getElementById("onboard-town").value.trim();
  const errorBox = document.getElementById("onboard-error");

  // keep it simple: we really just need a parish + town
  if (!parish || !town) {
    errorBox.textContent = "Just pick your parish and type your town — that's all we need.";
    errorBox.classList.remove("hidden");
    return;
  }
  finishOnboarding(parish, town);
});

document.getElementById("onboard-skip").addEventListener("click", () => {
  document.getElementById("onboarding").classList.add("hidden");
});

// shared by the finish button and the "Change" button on Home
function finishOnboarding(parish, town) {
  localStorage.setItem("agrilink-parish", parish);
  localStorage.setItem("agrilink-town", town);
  document.getElementById("onboarding").classList.add("hidden");
  document.getElementById("farm-place").textContent = `${town}, ${parish}`;
  loadFarmData(parish);
  renderCrops();
}

// "Change" button on the Home card re-opens onboarding
document.getElementById("change-farm").addEventListener("click", () => {
  onboardParish.value = localStorage.getItem("agrilink-parish") || "";
  document.getElementById("onboard-town").value = localStorage.getItem("agrilink-town") || "";
  document.getElementById("onboard-step-1").classList.remove("active");
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
        live: data.forecast.live,
      };
      currentClimate = data.climate
        ? { rain: data.climate.avg_rain, years: data.climate.years_used }
        : null;
      updateWeatherChip(true, true);
      renderFarmStats();
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
}

// One line of live status in the top bar.
function updateWeatherChip(hasWeather, hasClimate) {
  const chip = document.getElementById("weather-chip");
  if (!hasWeather) { chip.textContent = "Weather unavailable — sample data in use"; return; }
  const liveLabel = currentWeather.live ? "live" : "sample";
  const climateLabel = hasClimate ? `${currentClimate.years}-yr avg ${currentClimate.rain} mm/mo` : "climate offline";
  chip.textContent = `${currentWeather.temp}°C · ${currentWeather.rain7} mm/7d · ${climateLabel} (${liveLabel})`;
}

// Small stat tiles on the Home "your farm" card.
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
    const tile = document.createElement("div");
    tile.className = "crop-tile";
    tile.innerHTML = `<span class="icon">${CROP_ICONS[crop.name]}</span>${crop.name}`;
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
    `<div class="fact"><span class="mark">·</span><span>Use the <b>Tracker</b> tab to see every growth stage with real dates.</span></div>`;

  // Also pre-select this crop in the tracker
  document.getElementById("track-crop").value = crop.name;
}

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

// ============ 6. PHOTO CHECK ============
document.getElementById("photo-btn").addEventListener("click", () => {
  document.getElementById("photo-input").click(); // opens the camera or photo picker
});

document.getElementById("photo-input").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const img = document.getElementById("photo-img");
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    document.getElementById("photo-preview").classList.remove("hidden");

    // 1. count the colours in the photo
    const analysis = analysePhoto(img);

    // 2. draw simple colour bars so the farmer can see what we measured
    const bars = document.getElementById("photo-bars");
    bars.innerHTML =
      colourBar("Healthy green", analysis.greenPct, "#2e9e55") +
      colourBar("Yellowing", analysis.yellowPct, "#e0b03a") +
      colourBar("Brown / dry", analysis.brownPct, "#a3703f");

    // 3. which crop? (from the planner selection, or ask via the tracker dropdown)
    const cropName = document.getElementById("track-crop").value || "Tomato";

    // 4. match against the problem dataset
    const matches = matchProblems(analysis, cropName);
    const box = document.getElementById("photo-matches");
    box.innerHTML =
      `<p class="small muted">Checking as: <b>${cropName}</b> (change it in the Tracker tab)</p>` +
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

// ============ 7. PUBLIC PROBLEM BOARD ============
const reportCropSelect = document.getElementById("report-crop");
CROPS.forEach((crop) => {
  const option = document.createElement("option");
  option.value = crop.name;
  option.textContent = crop.name;
  reportCropSelect.appendChild(option);
});

const reportProblemSelect = document.getElementById("report-problem");
PROBLEMS.forEach((p) => {
  if (p.name === "Healthy plant") return; // not a reportable problem
  const option = document.createElement("option");
  option.value = p.name;
  option.textContent = p.name;
  reportProblemSelect.appendChild(option);
});

document.getElementById("report-form").addEventListener("submit", (event) => {
  event.preventDefault();
  addReport(
    reportCropSelect.value,
    reportProblemSelect.value,
    document.getElementById("report-note").value.trim()
  );
  document.getElementById("report-note").value = "";
});

// ============ START THE APP ============
renderReports();

const savedParish = localStorage.getItem("agrilink-parish");
if (savedParish) {
  // returning user → fill in the farm card and load data
  const savedTown = localStorage.getItem("agrilink-town") || "";
  document.getElementById("farm-place").textContent = `${savedTown}, ${savedParish}`;
  loadFarmData(savedParish);
  renderCrops();
}
