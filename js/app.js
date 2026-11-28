
// ---- Regions by country: Jamaica's 14 parishes plus the parishes, districts
//      and departments of the 13 other Caribbean countries AgriLink covers.
//      Rough map coordinates, used for weather lookups. ----
const COUNTRIES = {
  "Jamaica": [
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
  ],
  "Antigua & Barbuda": [
    { name: "Saint John",         lat: 17.12, lon: -61.83 },
    { name: "Saint Mary",         lat: 17.05, lon: -61.85 },
    { name: "Saint Paul",         lat: 17.05, lon: -61.75 },
    { name: "Saint Peter",        lat: 17.10, lon: -61.73 },
    { name: "Saint Philip",       lat: 17.10, lon: -61.66 },
    { name: "Saint George",       lat: 17.15, lon: -61.68 },
    { name: "Barbuda",            lat: 17.62, lon: -61.81 },
  ],
  "Bahamas": [
    { name: "New Providence",     lat: 25.08, lon: -77.35 },
    { name: "Grand Bahama",       lat: 26.53, lon: -78.70 },
    { name: "Abaco",              lat: 26.54, lon: -77.04 },
    { name: "Andros",             lat: 25.18, lon: -78.01 },
    { name: "Eleuthera",          lat: 25.19, lon: -76.25 },
    { name: "Exuma",              lat: 23.49, lon: -75.77 },
  ],
  "Barbados": [
    { name: "Saint Lucy",         lat: 13.30, lon: -59.64 },
    { name: "Saint Peter",        lat: 13.26, lon: -59.63 },
    { name: "Saint James",        lat: 13.22, lon: -59.62 },
    { name: "Saint Andrew",       lat: 13.27, lon: -59.56 },
    { name: "Saint Joseph",       lat: 13.22, lon: -59.56 },
    { name: "Saint Thomas",       lat: 13.19, lon: -59.58 },
    { name: "Saint John",         lat: 13.20, lon: -59.50 },
    { name: "Saint George",       lat: 13.17, lon: -59.56 },
    { name: "Saint Michael",      lat: 13.13, lon: -59.61 },
    { name: "Saint Philip",       lat: 13.15, lon: -59.49 },
    { name: "Christ Church",      lat: 13.06, lon: -59.53 },
  ],
  "Belize": [
    { name: "Belize District",    lat: 17.50, lon: -88.20 },
    { name: "Cayo",               lat: 17.25, lon: -88.77 },
    { name: "Corozal",            lat: 18.00, lon: -88.39 },
    { name: "Orange Walk",        lat: 17.82, lon: -88.56 },
    { name: "Stann Creek",        lat: 16.97, lon: -88.23 },
    { name: "Toledo",             lat: 15.81, lon: -88.85 },
  ],
  "Dominica": [
    { name: "Saint Andrew",       lat: 15.56, lon: -61.28 },
    { name: "Saint David",        lat: 15.44, lon: -61.26 },
    { name: "Saint George",       lat: 15.30, lon: -61.39 },
    { name: "Saint John",         lat: 15.58, lon: -61.44 },
    { name: "Saint Joseph",       lat: 15.47, lon: -61.42 },
    { name: "Saint Luke",         lat: 15.25, lon: -61.38 },
    { name: "Saint Mark",         lat: 15.22, lon: -61.39 },
    { name: "Saint Patrick",      lat: 15.32, lon: -61.27 },
    { name: "Saint Paul",         lat: 15.41, lon: -61.41 },
    { name: "Saint Peter",        lat: 15.52, lon: -61.43 },
  ],
  "Grenada": [
    { name: "Saint George",       lat: 12.05, lon: -61.74 },
    { name: "Saint Andrew",       lat: 12.28, lon: -61.62 },
    { name: "Saint David",        lat: 12.14, lon: -61.60 },
    { name: "Saint John",         lat: 12.14, lon: -61.69 },
    { name: "Saint Mark",         lat: 12.20, lon: -61.70 },
    { name: "Saint Patrick",      lat: 12.32, lon: -61.66 },
  ],
  "Guyana": [
    { name: "Demerara-Mahaica",   lat: 6.80,  lon: -58.16 },
    { name: "Pomeroon-Supenaam",  lat: 7.27,  lon: -58.52 },
    { name: "Essequibo-W. Demerara", lat: 6.79, lon: -58.42 },
    { name: "Mahaica-Berbice",    lat: 6.47,  lon: -57.82 },
    { name: "E. Berbice-Corentyne", lat: 6.25, lon: -57.53 },
    { name: "Upper Demerara-Berbice", lat: 6.00, lon: -58.30 },
    { name: "Barima-Waini",       lat: 8.25,  lon: -59.60 },
  ],
  "Haiti": [
    { name: "Ouest",              lat: 18.54, lon: -72.34 },
    { name: "Artibonite",         lat: 19.45, lon: -72.68 },
    { name: "Nord",               lat: 19.76, lon: -72.20 },
    { name: "Nord-Est",           lat: 19.67, lon: -72.19 },
    { name: "Nord-Ouest",         lat: 19.94, lon: -72.83 },
    { name: "Sud",                lat: 18.19, lon: -73.75 },
    { name: "Sud-Est",            lat: 18.23, lon: -72.53 },
    { name: "Grand'Anse",         lat: 18.65, lon: -74.12 },
    { name: "Centre",             lat: 19.15, lon: -72.02 },
    { name: "Nippes",             lat: 18.44, lon: -73.08 },
  ],
  "Dominican Republic": [
    { name: "Distrito Nacional",  lat: 18.49, lon: -69.90 },
    { name: "Azua",               lat: 18.46, lon: -70.73 },
    { name: "La Vega",            lat: 19.22, lon: -70.53 },
    { name: "Puerto Plata",       lat: 19.79, lon: -70.71 },
    { name: "Santiago",           lat: 19.45, lon: -70.70 },
    { name: "San Cristóbal",      lat: 18.42, lon: -70.11 },
    { name: "San Juan",           lat: 18.81, lon: -70.72 },
    { name: "Peravia",            lat: 18.28, lon: -70.33 },
    { name: "La Altagracia",      lat: 18.62, lon: -68.71 },
    { name: "Duarte",             lat: 19.30, lon: -70.25 },
    { name: "La Romana",          lat: 18.43, lon: -68.96 },
  ],
  "St. Kitts & Nevis": [
    { name: "Christ Church Nichola Town", lat: 17.30, lon: -62.72 },
    { name: "Saint Anne Sandy Point",     lat: 17.34, lon: -62.78 },
    { name: "Saint George Basseterre",    lat: 17.29, lon: -62.73 },
    { name: "Saint John Capisterre",      lat: 17.37, lon: -62.79 },
    { name: "Saint Mary Cayon",           lat: 17.31, lon: -62.76 },
    { name: "Saint Paul Capisterre",      lat: 17.40, lon: -62.83 },
    { name: "Saint Peter Basseterre",     lat: 17.31, lon: -62.68 },
    { name: "Trinity Palmetto Point",     lat: 17.29, lon: -62.78 },
    { name: "Saint George Gingerland",    lat: 17.14, lon: -62.59 },
    { name: "Saint James Windward",       lat: 17.18, lon: -62.55 },
    { name: "Saint John Figtree",         lat: 17.14, lon: -62.66 },
    { name: "Saint Paul Charlestown",     lat: 17.14, lon: -62.63 },
    { name: "Saint Thomas Lowland",       lat: 17.17, lon: -62.64 },
  ],
  "St. Lucia": [
    { name: "Castries",           lat: 14.01, lon: -60.99 },
    { name: "Anse la Raye",       lat: 13.92, lon: -61.03 },
    { name: "Canaries",           lat: 13.91, lon: -61.07 },
    { name: "Choiseul",           lat: 13.76, lon: -61.04 },
    { name: "Dennery",            lat: 13.92, lon: -60.92 },
    { name: "Gros Islet",         lat: 14.08, lon: -60.94 },
    { name: "Laborie",            lat: 13.75, lon: -60.99 },
    { name: "Micoud",             lat: 13.82, lon: -60.90 },
    { name: "Soufrière",          lat: 13.86, lon: -61.06 },
    { name: "Vieux Fort",         lat: 13.72, lon: -60.95 },
  ],
  "St. Vincent & the Grenadines": [
    { name: "Saint George",       lat: 13.16, lon: -61.22 },
    { name: "Saint Andrew",       lat: 13.23, lon: -61.20 },
    { name: "Saint David",        lat: 13.21, lon: -61.15 },
    { name: "Saint Patrick",      lat: 13.27, lon: -61.25 },
    { name: "Charlotte",          lat: 13.29, lon: -61.14 },
    { name: "Grenadines",         lat: 12.60, lon: -61.43 },
  ],
  "Trinidad & Tobago": [
    { name: "Port of Spain",      lat: 10.65, lon: -61.50 },
    { name: "San Fernando",       lat: 10.28, lon: -61.46 },
    { name: "Chaguanas",          lat: 10.52, lon: -61.39 },
    { name: "Arima",              lat: 10.64, lon: -61.28 },
    { name: "Couva",              lat: 10.42, lon: -61.32 },
    { name: "Sangre Grande",      lat: 10.59, lon: -61.13 },
    { name: "Princes Town",       lat: 10.27, lon: -61.36 },
    { name: "Penal–Debe",         lat: 10.16, lon: -61.45 },
    { name: "Tobago",             lat: 11.19, lon: -60.73 },
  ],
};
const COUNTRY_NAMES = Object.keys(COUNTRIES);

// find one region, preferring the farmer's own country, else search everywhere
function findRegion(name, country) {
  if (!name) return null;
  const list = (country && COUNTRIES[country]) || null;
  return (list && list.find((r) => r.name === name)) || null;
}

function findRegionAnywhere(name) {
  if (!name) return null;
  for (const country of COUNTRY_NAMES) {
    const hit = COUNTRIES[country].find((r) => r.name === name);
    if (hit) return { ...hit, country };
  }
  return null;
}

// "Town, Region, Country" in one line, leaving out whatever isn't set
function placeLabel(town, region) {
  const country = localStorage.getItem("agrilink-country") || "";
  return [town, region, country].filter(Boolean).join(", ");
}

// how many regions, for the README and the count in the UI
const REGION_COUNT = COUNTRY_NAMES.reduce((n, c) => n + COUNTRIES[c].length, 0);

let currentWeather = null; // live 7-day forecast
let currentClimate = null; // 10-year average for the coming month

// ============ 0. GLOBAL HELPERS (theme, units, toasts, animation) ============

// --- temperature units: stored °C internally, rendered in the chosen unit ---
function getUnit() { return localStorage.getItem("agrilink-unit") || "c"; }

function fmtTemp(celsius) {
  const c = Number(celsius);
  if (getUnit() === "f") return Math.round(c * 9 / 5 + 32);
  return Math.round(c);
}

function unitLabel() { return getUnit() === "f" ? "fahrenheit" : "celsius"; }

// --- theme: "Daylight" is the default (phones are used outdoors); "Night" is the opt-in ---
function applyTheme(theme) {
  document.documentElement.classList.toggle("theme-dark", theme === "dark");
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === "dark" ? "#0C1512" : "#F5F2E9";
  const btn = document.getElementById("settings-theme");
  if (btn) btn.textContent = theme === "dark" ? "Light" : "Dark"; // shows what you'd switch TO
}

function getTheme() { return localStorage.getItem("agrilink-theme") || "light"; }

function toggleTheme() {
  const next = getTheme() === "dark" ? "light" : "dark";
  localStorage.setItem("agrilink-theme", next);
  applyTheme(next);
  showToast(next === "dark" ? "Night theme on" : "Daylight theme on");
}

// --- toast: quiet confirmation for actions (no silent success) ---
let toastTimer = null;
function showToast(message) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
}

// --- count-up numbers (temp, ring %), instant under reduced motion or hidden tabs ---
let animSeq = 0;
function animateValue(el, to, duration = 700, format = (n) => String(n)) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finish = () => { el.textContent = format(to); };
  if (reduced || document.hidden) { finish(); return; }

  const token = ++animSeq; // a newer animation always wins
  const from = 0;
  const start = performance.now();
  function tick(now) {
    if (token !== animSeq) return; // superseded
    if (document.hidden) { finish(); return; }
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
    el.textContent = format(Math.round(from + (to - from) * eased));
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  // safety net: rAF may never fire in a hidden tab → snap to final
  setTimeout(() => { if (token === animSeq) finish(); }, duration + 120);
}

// --- forecast skeleton: static blocks while weather loads ---
function renderForecastSkeleton() {
  const strip = document.getElementById("forecast-strip");
  if (!strip) return;
  strip.className = "rain-chart";
  strip.innerHTML = "";
  for (let i = 0; i < 7; i++) {
    const col = document.createElement("div");
    col.className = "rain-col";
    col.innerHTML =
      `<span class="rc-day"></span>` +
      `<span class="rc-plot"><span class="skeleton" style="width:22px;height:30px"></span></span>` +
      `<span class="skeleton" style="width:22px;height:9px;justify-self:center"></span>`;
    strip.appendChild(col);
  }
}

// ============ 1. ONBOARDING (first launch only) ============
const onboardCountry = document.getElementById("onboard-country");
const onboardParish = document.getElementById("onboard-parish");
COUNTRY_NAMES.forEach((name) => {
  const option = document.createElement("option");
  option.value = name;
  option.textContent = name;
  onboardCountry.appendChild(option);
});

// the region list follows the chosen country
function fillRegionSelect(country) {
  onboardParish.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Choose your region…";
  onboardParish.appendChild(placeholder);
  (COUNTRIES[country] || []).forEach((r) => {
    const option = document.createElement("option");
    option.value = r.name;
    option.textContent = r.name;
    onboardParish.appendChild(option);
  });
}
onboardCountry.addEventListener("change", () => fillRegionSelect(onboardCountry.value));
fillRegionSelect("");

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
let pendingParish = "", pendingTown = "", pendingName = "", pendingCountry = "";

document.getElementById("onboard-finish").addEventListener("click", () => {
  pendingParish = onboardParish.value;
  pendingCountry = onboardCountry.value;
  pendingTown = document.getElementById("onboard-town").value.trim();
  pendingName = document.getElementById("onboard-name").value.trim();
  const errorBox = document.getElementById("onboard-error");

  // keep it simple: name, country, region, town. The name is what shows in the chat.
  if (!pendingName || !pendingCountry || !pendingParish || !pendingTown) {
    errorBox.textContent = "Type your name, choose your country and region, and enter your town.";
    errorBox.classList.remove("hidden");
    return;
  }
  localStorage.setItem("agrilink-country", pendingCountry); // remember before the tutorial
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
    text: "The Planner ranks crops for your parish using this month's planting window, ten years of rainfall and the week's forecast. It also warns you before heavy rain.",
  },
  {
    title: "Follow every stage",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18"/><path d="M4 16l4-6 4 3 5-8"/></svg>`,
    text: "Enter a planting date and the Tracker builds a dated roadmap from germination to harvest. A progress bar shows where the crop is now.",
  },
  {
    title: "Check a sick plant",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16l4-5 3 3 4-6 5 8"/><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="1.6"/></svg>`,
    text: "The scan button opens the photo check. It compares a leaf photo with common crop problems on this phone. You can report the result to the parish board.",
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
  pendingName = localStorage.getItem("agrilink-name") || "";
  pendingCountry = localStorage.getItem("agrilink-country") || "";
  showTutorialStep(0);
  document.getElementById("onboarding").classList.remove("hidden");
});

// shared by the tutorial's Start button and the "Change" buttons on Home and Settings
function finishOnboarding(parish, town) {
  if (parish && town) {
    localStorage.setItem("agrilink-parish", parish);
    localStorage.setItem("agrilink-town", town);
    // remember the farmer's name too: it signs their chat messages
    if (pendingName) localStorage.setItem("agrilink-name", pendingName);
    document.getElementById("chat-name").value = pendingName || localStorage.getItem("agrilink-name") || "";
    document.getElementById("farm-place").textContent = placeLabel(town, parish);
    loadFarmData(parish);
    renderCrops();
  }
  document.getElementById("onboarding").classList.add("hidden");
  document.getElementById("how-it-works").classList.add("hidden"); // setup done, no longer needed
  window.scrollTo({ top: 0 });
}

// "Change" buttons re-open onboarding exactly like the first run, filled in
function reopenOnboarding() {
  const country = localStorage.getItem("agrilink-country") || "";
  onboardCountry.value = country;
  fillRegionSelect(country);
  onboardParish.value = localStorage.getItem("agrilink-parish") || "";
  document.getElementById("onboard-town").value = localStorage.getItem("agrilink-town") || "";
  document.getElementById("onboard-name").value = localStorage.getItem("agrilink-name") || "";
  document.getElementById("onboard-step-1").classList.remove("active");
  document.getElementById("onboard-step-2").classList.remove("active");
  document.getElementById("onboard-step-3").classList.remove("active");
  document.getElementById("onboard-step-2").classList.add("active");
  document.getElementById("onboarding").classList.remove("hidden");
}

document.getElementById("change-farm").addEventListener("click", reopenOnboarding);

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
  document.body.dataset.screen = id; // each tab gets its own mood light
  window.scrollTo({ top: 0 });
}

// ============ 3. WEATHER & CLIMATE HISTORY ============

// Weather cache: the last real forecast we fetched, saved on this phone.
// Going offline on the farm? The app shows the last known numbers instead
// of inventing sample ones, honest and more useful.
function cacheFarmData() {
  try {
    localStorage.setItem("agrilink-cache", JSON.stringify({
      at: Date.now(),
      weather: currentWeather,
      climate: currentClimate,
    }));
  } catch { /* storage full, no problem, the app still works */ }
}

function loadCachedFarmData() {
  try { return JSON.parse(localStorage.getItem("agrilink-cache")); } catch { return null; }
}

async function loadFarmData(parishName) {
  renderForecastSkeleton(); // shimmer while we wait
  const chip = document.getElementById("weather-chip"); // may be null, status now lives in the hero
  if (chip) chip.textContent = "Loading local data…";

  // --- Preferred path: our own FastAPI backend (same origin) ---
  const country = localStorage.getItem("agrilink-country") || "Jamaica";
  try {
    const backend = await fetch(
      `/api/farm-data/${encodeURIComponent(country)}/${encodeURIComponent(parishName)}`
    );
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
      cacheFarmData();
      updateWeatherChip(true, true);
      renderFarmStats();
      checkRainAlert();
      renderTopPicks();
      renderForecastStrip();
      renderSeasonChips();
      renderHeroCondition();
      updateOfflineBadge();
      return;
    }
    if (backend.status === 429) {
      showToast("Server is busy, using your browser's data instead");
    }
  } catch {
    // no backend running (e.g. opened as a file) → use the browser path below
  }

  // --- Standalone path: call Open-Meteo directly from the browser ---
  const parish = findRegion(parishName, localStorage.getItem("agrilink-country"))
    || findRegionAnywhere(parishName);
  if (!parish) {
    if (chip) chip.textContent = "Location not set — open Settings to pick your region";
    return;
  }

  // A. live 7-day forecast (rain, temps, wind, humidity)
  try {
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${parish.lat}&longitude=${parish.lon}` +
      "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,relative_humidity_2m_mean" +
      "&forecast_days=7&timezone=auto";
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error("forecast request failed");
    const data = await response.json();
    currentWeather = {
      temp: (data.daily.temperature_2m_max[0] + data.daily.temperature_2m_min[0]) / 2,
      rain7: Math.round(data.daily.precipitation_sum.reduce((a, b) => a + b, 0)),
      rain3: data.daily.precipitation_sum.slice(0, 3).map((mm) => Math.round(mm)),
      daily: data.daily.precipitation_sum.slice(0, 7).map((mm, i) => ({
        rain: Math.round(mm),
        tmax: Math.round(data.daily.temperature_2m_max[i]),
        wind: Math.round(data.daily.wind_speed_10m_max[i]),
        rh: Math.round(data.daily.relative_humidity_2m_mean[i]),
        prob: data.daily.precipitation_probability_max[i] != null
          ? Math.round(data.daily.precipitation_probability_max[i]) : null,
      })),
      live: true,
    };
    cacheFarmData();
  } catch {
    // Offline or blocked? Show the last real forecast we saved, if we have one 
    // better than fake numbers. Otherwise fall back to sensible sample data.
    const cached = loadCachedFarmData();
    if (cached && cached.weather && cached.weather.daily) {
      currentWeather = cached.weather;
      currentWeather.live = false; // stale, say so honestly
      currentClimate = currentClimate || cached.climate || null;
    } else {
      currentWeather = { temp: 27, rain7: 24, wind: 12, rh: 75, live: false };
    }
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
    else if (!currentClimate) {
      const cached = loadCachedFarmData();
      if (cached && cached.climate) currentClimate = cached.climate;
    }
  } catch {
    currentClimate = currentClimate || null; // the recommendation falls back gracefully
  }

  cacheFarmData();
  updateWeatherChip(currentWeather.live, !!currentClimate);
  renderFarmStats();
  checkRainAlert();
  renderTopPicks();
  renderForecastStrip();
  renderSeasonChips();
  renderHeroCondition();
  updateOfflineBadge();
}

// Offline indicator, the PWA story: it still works, just tells you.
function updateOfflineBadge() {
  const el = document.getElementById("offline-note");
  if (!el) return;
  el.textContent = navigator.onLine ? "" : "Offline. Showing the last forecast saved on this phone.";
  el.classList.toggle("hidden", navigator.onLine);
}
window.addEventListener("online", updateOfflineBadge);
window.addEventListener("offline", updateOfflineBadge);
function renderHeroCondition() {
  const el = document.getElementById("hero-condition");
  if (!currentWeather) return; // keep the placeholder until data lands
  const flag = document.getElementById("hero-flag");
  if (flag) {
    if (!currentWeather.live) {
      const cached = loadCachedFarmData();
      if (cached) {
        const age = Math.round((Date.now() - cached.at) / 3600000);
        flag.textContent = age > 0 ? `Saved ${age}h ago` : "Saved just now";
        flag.className = "hero-status saved";
      } else {
        flag.textContent = "Offline"; // no cache either, honest sample data
        flag.className = "hero-status offline";
      }
    } else {
      flag.textContent = "Live forecast";
      flag.className = "hero-status live";
    }
  }
  if (!currentWeather.live) {
    el.innerHTML = `No live forecast. This advice uses <b>your parish's rainfall history</b>.`;
    return;
  }
  const rain7 = currentWeather.rain7;
  if (rain7 < 10)      el.innerHTML = `Dry week ahead. <b>Plan to irrigate</b> if you plant now.`;
  else if (rain7 < 40) el.innerHTML = `A few showers this week. <b>Good week to plant.</b>`;
  else                 el.innerHTML = `Wet week ahead. <b>Check drainage</b> before planting.`;
}


function renderForecastStrip() {
  const strip = document.getElementById("forecast-strip");
  if (!currentWeather || !currentWeather.daily) {
    strip.className = "forecast-strip muted";
    strip.textContent = "Forecast unavailable: the rest of the app still works.";
    return;
  }
  const today = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  strip.innerHTML = "";
  strip.className = "rain-chart";
  const goodDays = [];
  // scale bars to the week so a light week still reads as a chart,
  // but never past 20 mm (that is already "stay off the field")
  const maxRain = Math.max(...currentWeather.daily.map((d) => d.rain), 1);
  const MAX_MM = Math.min(20, Math.max(9, maxRain));

  currentWeather.daily.forEach((day, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const plantable = day.rain >= 2 && day.rain < 20 && i > 0;
    if (plantable) goodDays.push(dayNames[date.getDay()]);

    const level = day.rain >= 25 ? "lvl-high" : day.rain >= 10 ? "lvl-mid" : "lvl-low";
    const mmCls = day.rain >= 25 ? "heavy" : day.rain >= 10 ? "some" : "";
    const h = day.rain <= 0 ? 3 : Math.round(6 + Math.min(day.rain, MAX_MM) / MAX_MM * 48);

    const col = document.createElement("div");
    col.className = "rain-col" + (plantable ? " plantable" : "");
    col.style.setProperty("--i", i); // stagger the bar grow-in animation
    col.innerHTML =
      `<span class="rc-day">${i === 0 ? "Today" : dayNames[date.getDay()]}</span>` +
      `<span class="rc-plot"><span class="rc-bar ${level}" style="height:${h}px"></span></span>` +
      `<span class="rc-mm ${mmCls}">${day.rain} mm</span>` +
      (day.prob != null ? `<span class="rc-prob">${day.prob}%</span>` : "");
    strip.appendChild(col);
  });

  // the practical answer: when can this field actually be worked?
  const window_ = document.getElementById("plant-days");
  if (goodDays.length >= 5) {
    window_.innerHTML = `Light rain all week: <b>any day works</b>.`;
    window_.classList.remove("hidden");
  } else if (goodDays.length) {
    window_.innerHTML = `Good planting days: <b>${goodDays.join(" · ")}</b>`;
    window_.classList.remove("hidden");
  } else if (currentWeather.daily.some((d) => d.rain >= 25)) {
    window_.innerHTML = `Too wet this week: wait for a green bar before planting.`;
    window_.classList.remove("hidden");
  } else {
    window_.classList.add("hidden");
  }

  // ---- the weather predictor: what the numbers say is coming next ----
  // Combines the rain chance (% from the forecast model) with how much rain
  // is expected, and answers in one line: what's coming, and when to act.
  const predictor = document.getElementById("rain-predictor");
  if (!currentWeather.daily.some((d) => d.prob != null)) {
    predictor.classList.add("hidden"); // sample/offline data has no probabilities
  } else {
    let wetDay = null, wetIndex = -1;
    for (let i = 0; i < currentWeather.daily.length; i++) {
      const d = currentWeather.daily[i];
      if (d.prob != null && d.prob >= 50) { wetDay = d; wetIndex = i; break; }
    }
    if (wetDay) {
      const when = wetIndex === 0 ? "today" : "on " + dayNames[new Date(Date.now() + wetIndex * 86400000).getDay()];
      const advice = wetDay.rain >= 20
        ? "Hold off planting and spraying, use the time to mulch."
        : "Good window to plant just before or right after it falls.";
      predictor.innerHTML = `Weather predictor: <b>${wetDay.prob}% rain chance ${when}</b> (around ${wetDay.rain} mm). ${advice}`;
    } else {
      predictor.innerHTML = `Weather predictor: <b>rain unlikely for 3 days</b>. Plan to irrigate if you plant now.`;
    }
    predictor.classList.remove("hidden");
  }
}

// "Planting right now" chips: crops whose season is open this month.
function renderSeasonChips() {
  const box = document.getElementById("season-chips");
  const month = new Date().getMonth() + 1;
  const inSeason = CROPS.filter((c) => c.bestMonths.includes(month));
  box.innerHTML = "";
  if (!inSeason.length) {
    box.innerHTML = `<p class="muted small">Nothing is in season this month. The picks above are the closest fit.</p>`;
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
  const chip = document.getElementById("weather-chip"); // may be null, status now lives in the hero
  if (!chip) return;
  if (!hasWeather) { chip.textContent = "Offline: sample data"; return; }
  const climateLabel = hasClimate ? `${currentClimate.years}-yr climate` : "climate offline";
  chip.textContent = currentWeather.live ? `Live data · ${climateLabel}` : `Sample data · ${climateLabel}`;
}

// Stat strip on the farm header, the data IS the header.
function renderFarmStats() {
  const box = document.getElementById("farm-stats");
  if (!currentWeather) return;
  box.classList.remove("hidden");
  const today = currentWeather.daily && currentWeather.daily[0];
  const probStat = today && today.prob != null
    ? `<div class="stat"><span class="label">Rain chance</span><span class="value">${today.prob}<small> %</small></span></div>`
    : "";
  const windStat = today && today.wind != null
    ? `<div class="stat"><span class="label">Wind today</span><span class="value">${today.wind}<small> km/h</small></span></div>`
    : "";
  const rhStat = today && today.rh != null
    ? `<div class="stat"><span class="label">Humidity</span><span class="value">${today.rh}<small> %</small></span></div>`
    : "";
  const climateStat = currentClimate
    ? `<div class="stat"><span class="label">10-yr avg</span><span class="value">${currentClimate.rain}<small> mm/mo</small></span></div>`
    : "";
  box.innerHTML =
    `<div class="stat"><span class="label">Temp now</span><span class="value">${fmtTemp(currentWeather.temp)}<small>°</small></span></div>` +
    `<div class="stat"><span class="label">Rain 7 days</span><span class="value">${currentWeather.rain7}<small> mm</small></span></div>` +
    probStat + windStat + rhStat + climateStat;
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
      `${heavyDays.join(", ")}. Hold planting and spraying until it passes. Mulch instead.`;
    banner.classList.remove("hidden");
    // badge the Planner tab so farmers notice even from another screen
    const plannerTab = document.querySelector('.tab[data-screen="screen-planner"]');
    if (plannerTab) plannerTab.classList.add("has-alert");
  } else {
    banner.classList.add("hidden");
    const plannerTab = document.querySelector('.tab[data-screen="screen-planner"]');
    if (plannerTab) plannerTab.classList.remove("has-alert");
  }
}

// Short, factual reasons why a crop ranks where it does.
function pickReasons(crop, rec) {
  const reasons = [];
  const month = new Date().getMonth() + 1;
  if (crop.bestMonths.includes(month)) reasons.push("in season");
  if (rec.climateRain >= 15 && rec.climateRain <= 250) reasons.push("rainfall near normal");
  else if (rec.climateRain < 15) reasons.push("dry month on record");
  else reasons.push("wet month on record");
  if (rec.rain >= 5 && rec.rain <= 80) reasons.push("rain this week");
  else if (rec.rain < 5) reasons.push("dry week ahead");
  return reasons.slice(0, 2);
}

// The verdict in one or two words, for the compact picks list.
function shortVerdict(rec) {
  if (rec.score >= 70) return "Good window";
  if (rec.score >= 50) return "Tight window";
  return "Wait";
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
    const reasons = pickReasons(entry.crop, entry.rec);
    const row = document.createElement("div");
    row.className = "pick";
    row.innerHTML =
      `<span class="rank">#${rank + 1}</span>` +
      `<span class="icon">${CROP_ICONS[entry.crop.name]}</span>` +
      `<span class="pick-info">` +
        `<span class="pick-name">${entry.crop.name}</span>` +
        `<div class="pick-why">${reasons.join(" · ")} · harvest around ${harvestDate(entry.crop).replace(/,.*/, "")}</div>` +
      `</span>` +
      `<span class="pick-score ${entry.rec.cls}">${shortVerdict(entry.rec)}</span>`;
    row.addEventListener("click", () => {
      showScreen("screen-planner");
      showPlan(entry.index);
    });
    box.appendChild(row);
  });
}

// Rainfall total for `month` of `year`, at this parish.
// Weak-signal protection: every archive request is capped at 8 seconds so a
// hanging connection can never stall the whole recommendation.
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

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return null;
    const data = await response.json();
    const days = data.daily.precipitation_sum || [];
    if (!days.length) return null;
    return days.reduce((a, b) => a + (b ?? 0), 0);
  } catch {
    return null; // timeout or network error, skip this year
  }
}

// ============ 4. PLANNER SCREEN ============
let cropSearchText = "";
let cropTypeFilter = "All";

// Filter chips: All · Greens · Fruit veg · Roots & tubers · Vines & melons · Tree & long crops
function renderTypeChips() {
  const box = document.getElementById("crop-type-chips");
  const types = ["All", ...new Set(CROPS.map((c) => CROP_TYPES[c.name]).filter(Boolean))];
  box.innerHTML = "";
  types.forEach((type) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "type-chip" + (type === cropTypeFilter ? " on" : "");
    chip.textContent = type;
    chip.addEventListener("click", () => {
      cropTypeFilter = type;
      renderTypeChips();
      renderCrops(cropSearchText);
    });
    box.appendChild(chip);
  });
}

function renderCrops(filterText) {
  const grid = document.getElementById("crop-grid");
  grid.innerHTML = "";
  const filter = (filterText || "").toLowerCase();

  const visible = CROPS.filter((crop) => {
    const matchesText = crop.name.toLowerCase().includes(filter);
    const matchesType = cropTypeFilter === "All" || CROP_TYPES[crop.name] === cropTypeFilter;
    return matchesText && matchesType;
  });
  if (!visible.length) {
    grid.innerHTML = `<p class="muted small">No crop called "${filterText}". Try lettuce, okra or corn.</p>`;
    return;
  }

  visible.forEach((crop) => {
    const index = CROPS.indexOf(crop);
    const tile = document.createElement("button");
    tile.className = "crop-tile";
    tile.type = "button";
    tile.innerHTML =
      `<span class="icon">${CROP_ICONS[crop.name]}</span>` +
      `<span style="flex:1;min-width:0">` +
        `<span class="crop-name" style="display:block">${crop.name}</span>` +
        `<span class="crop-window">${cropWindowText(crop.bestMonths)}</span>` +
      `</span>`;
    tile.addEventListener("click", () => showPlan(index));
    grid.appendChild(tile);
  });
}

// Turn [1,2,8,9,10] into "Plant Jan–Feb, Aug–Oct".
function cropWindowText(months) {
  if (months.length >= 12) return "Plant all year";
  const set = [...new Set(months)].sort((a, b) => a - b);
  const ranges = [];
  let start = set[0], prev = set[0];
  for (let i = 1; i < set.length; i++) {
    if (set[i] === prev + 1) { prev = set[i]; continue; }
    ranges.push([start, prev]);
    start = prev = set[i];
  }
  ranges.push([start, prev]);

  // Dec + Jan is one continuous window, not two.
  if (ranges.length > 1 && ranges[0][0] === 1 && ranges[ranges.length - 1][1] === 12) {
    const first = ranges.shift();
    const last = ranges.pop();
    ranges.push([last[0], first[1] + 12]);
  }

  const abbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const label = ranges.map(([a, b]) => {
    const from = abbr[((a - 1) % 12 + 12) % 12];
    const to = abbr[((b - 1) % 12 + 12) % 12];
    return a === b ? from : `${from}–${to}`;
  }).join(", ");
  return `Plant ${label}`;
}

document.getElementById("crop-search").addEventListener("input", (event) => {
  cropSearchText = event.target.value.trim();
  renderCrops(cropSearchText);
});

function showPlan(index) {
  const crop = CROPS[index];
  document.querySelectorAll(".crop-tile").forEach((t, i) => {
    t.classList.toggle("selected", i === index);
  });

  const rec = recommendCrop(crop, currentWeather, currentClimate);

  document.getElementById("plan-result").classList.remove("hidden");
  document.getElementById("plan-title").textContent = crop.name;
  document.getElementById("plan-parish").textContent =
    localStorage.getItem("agrilink-parish") || "your parish";
  document.getElementById("plan-verdict").textContent = rec.verdict;
  document.getElementById("plan-verdict").className = "verdict " + rec.cls;

  // the three key numbers, as clean stat tiles
  const climateRain = rec.climateRain ? `${rec.climateRain}<small> mm/mo</small>` : "–";
  document.getElementById("plan-stats").innerHTML =
    `<div class="stat"><span class="label">Forecast</span><span class="value">${rec.rain}<small> mm/7d</small></span></div>` +
    `<div class="stat"><span class="label">Climate avg</span><span class="value">${climateRain}</span></div>` +
    `<div class="stat"><span class="label">Temp</span><span class="value">${fmtTemp(rec.temp)}<small> °${getUnit().toUpperCase()}</small></span></div>`;

  document.getElementById("plan-months").innerHTML = monthStripHTML(crop.bestMonths);
  document.getElementById("confidence-bar").style.width = rec.score + "%";
  document.getElementById("confidence-label").textContent =
    `Score ${rec.score} of 100. Season, parish rainfall history and this week's forecast.`;

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
  const place = placeLabel(localStorage.getItem("agrilink-town") || "", localStorage.getItem("agrilink-parish") || "");
  const text =
    `AgriLink plan, ${place}\n` +
    `${crop.name}: ${rec.verdict} (score ${rec.score}/100)\n` +
    `Best months: ${crop.bestMonths.map(monthName).join(", ")}\n` +
    `Planted now, harvest around ${harvestDate(crop)}\n` +
    `Rain this week: ${rec.rain} mm. Temp: ${rec.temp}°C`;

  if (navigator.share) {
    try { await navigator.share({ title: "AgriLink plan", text }); } catch { /* user cancelled */ }
  } else {
    await navigator.clipboard.writeText(text);
    const btn = document.getElementById("share-plan");
    btn.textContent = "Copied! Paste it in WhatsApp";
    showToast("Plan copied to clipboard");
    setTimeout(() => { btn.textContent = "Copy plan to share (WhatsApp)"; }, 2000);
  }
});

// TRACK THIS CROP: jump from the plan straight into a built roadmap.
document.getElementById("track-this").addEventListener("click", () => {
  showScreen("screen-tracker");
  document.getElementById("build-timeline").click(); // roadmap is already valid, just build it
  showToast("Roadmap built, see the Tracker");
  window.scrollTo({ top: 0 });
});

// Tip of the day: one practical farming tip, changes daily.
const TIPS = [
  "Water early morning or after 4 pm: midday water burns leaves and evaporates fast.",
  "Mulch with dry grass or banana leaves. It holds soil moisture and feeds worms.",
  "Plant marigold around the field; it pushes away some pests, for free.",
  "Don't plant the same crop in the same spot every season; rotate to protect the soil.",
  "Ash from the wood fire pot helps against some leaf-eating pests. Dust lightly.",
  "Check plants every 2 days: catching one worm early saves a whole row.",
  "Compost your crop leftovers: free fertiliser by next season.",
  "Weeds steal water and food. Pull them small, before they seed.",
  "Collect rainwater from the roof in drums: free irrigation for dry weeks.",
  "Healthy soil smells earthy and sweet. If it smells sour, rest that bed with compost.",
];

function renderTipOfDay() {
  // changes at midnight: day-of-year decides which tip shows
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);
  document.getElementById("tip-text").textContent = TIPS[dayOfYear % TIPS.length];
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

// How far along is the journey? The farmer's log of what REALLY happened
// wins over the predicted calendar: the last stage they ticked anchors the
// estimate, and how far into that stage the log date falls fills the rest.
function trackProgress(crop, plantingDate, roadmap, log, today) {
  const totalDays = Math.round((roadmap[roadmap.length - 1].date - plantingDate) / 86400000);
  const daysToHarvest = Math.max(0, Math.round((roadmap[roadmap.length - 1].date - today) / 86400000));
  const logged = roadmap.filter((s) => log[s.name]);

  if (!logged.length) {
    // nothing ticked yet: estimate from the planting date alone
    const daysIn = Math.round((today - plantingDate) / 86400000);
    return {
      percent: Math.min(100, Math.max(0, Math.round((daysIn / totalDays) * 100))),
      stageName: (roadmap.find((s) => s.date >= today) || { name: "harvest" }).name.toLowerCase(),
      done: daysIn >= totalDays,
      notStarted: daysIn < 0,
      daysToHarvest,
      loggedCount: 0,
    };
  }

  // the last ticked stage anchors the estimate
  const last = logged[logged.length - 1];
  const logDate = new Date(log[last.name].date + "T12:00:00");
  const stageStartMs = last.date - last.days * 86400000; // stage start = end date minus its length
  const startDays = Math.round((stageStartMs - plantingDate) / 86400000);
  const into = Math.round((logDate - stageStartMs) / 86400000);
  const frac = Math.min(1, Math.max(0, into / Math.max(1, last.days)));
  const percent = Math.min(100, Math.round(((startDays + frac) / totalDays) * 100));

  // current stage: the first stage after the last one they ticked
  const nextStage = roadmap[roadmap.indexOf(last) + 1];
  return {
    percent,
    stageName: nextStage ? nextStage.name.toLowerCase() : "harvest",
    done: percent >= 100,
    notStarted: false,
    daysToHarvest,
    loggedCount: logged.length,
  };
}

// turn a stage log entry into its calendar date
function logDate(logEntry) {
  return new Date(logEntry.date + "T12:00:00");
}

function isoOf(date) {
  return date.toISOString().slice(0, 10);
}

// write one track's changes back into storage (the log lives on it)
function persistTrack(track) {
  const tracks = loadTracks();
  const index = tracks.findIndex((t) => t.id === track.id);
  if (index >= 0) tracks[index] = track;
  saveTracks(tracks);
}

// rebuild the roadmap view + every summary that depends on it
function rebuildTracker() {
  document.getElementById("build-timeline").click();
  renderSavedCrops();
  renderMyCrops();
}

document.getElementById("build-timeline").addEventListener("click", () => {
  const cropName = trackCropSelect.value;
  const crop = CROPS.find((c) => c.name === cropName);
  const plantingDate = new Date(document.getElementById("track-date").value + "T12:00:00");
  const dateISO = document.getElementById("track-date").value;

  // find (or create) the saved track. The log of what really happened
  // lives on it, so the tracker and "My crops" always agree.
  const tracks = loadTracks();
  let track = tracks.find((t) => t.crop === cropName && t.date === dateISO);
  if (!track) {
    track = { id: Date.now(), crop: cropName, date: dateISO };
    tracks.unshift(track);
    saveTracks(tracks);
  }
  const log = track.log || {};

  const roadmap = buildRoadmap(crop, plantingDate);
  const today = new Date();

  document.getElementById("timeline-output").classList.remove("hidden");

  // progress: real log first, calendar estimate as the fallback
  const progress = trackProgress(crop, plantingDate, roadmap, log, today);
  const totalDays = Math.round((roadmap[roadmap.length - 1].date - plantingDate) / 86400000);
  const daysIn = Math.max(0, Math.round((today - plantingDate) / 86400000));

  // progress ring (like a fitness ring), smooth sweep to the right spot
  const RING = 2 * Math.PI * 52; // matches r=52 in the SVG
  const ringFill = document.getElementById("ring-fill");
  ringFill.style.strokeDashoffset = RING * (1 - progress.percent / 100);
  ringFill.style.opacity = progress.percent > 0 ? "1" : "0"; // a round cap would otherwise draw a dot at zero
  animateValue(document.getElementById("ring-num"), Math.round(progress.percent));

  document.getElementById("progress-text").textContent =
    progress.done ? "Harvest time, the journey is done." :
    progress.notStarted ? "Roadmap ready: plant on your chosen date." :
    `Currently in the ${progress.stageName} stage.`;
  document.getElementById("progress-sub").textContent =
    progress.loggedCount > 0
      ? `${progress.loggedCount} of ${roadmap.length} stages logged · ${crop.name}`
      : daysIn <= 0 ? `${crop.name} · ${roadmap.length} stages ahead of you.`
      : `${daysIn} of ${totalDays} days since planting · ${crop.name}`;

  const timeline = document.getElementById("timeline");
  timeline.innerHTML = "";

  roadmap.forEach((stage, index) => {
    const actual = log[stage.name];
    const isLogged = !!actual;
    const predictedPast = stage.date < today;
    const isCurrent = !isLogged && index === roadmap.indexOf(
      roadmap.filter((s) => !log[s.name])[0]
    );

    const div = document.createElement("div");
    div.className = "stage" + (isLogged || predictedPast ? " done" : "") + (isCurrent ? " current" : "");

    const dateStr = stage.date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
    div.innerHTML =
      `<b>${stage.name}</b> · <span class="date">${dateStr}</span>` +
      `<div class="tip">${stage.tip}</div>`;

    // the log row: what really happened, with the one-day nudges the user
    // asked for. Tick, then correct it if reality ran early or late.
    const logRow = document.createElement("div");
    logRow.className = "stage-log";
    if (isLogged) {
      const shift = Math.round((logDate(actual) - stage.date) / 86400000);
      const shiftNote = shift === 0 ? "" :
        ` · <span class="log-shift">${Math.abs(shift)} day${Math.abs(shift) > 1 ? "s" : ""} ${shift < 0 ? "early" : "late"} vs plan</span>`;
      logRow.innerHTML =
        `<span class="log-date">✓ done ${logDate(actual).toLocaleDateString(undefined, { day: "numeric", month: "short" })}${shiftNote}</span>`;
      logRow.appendChild(logBtn("-1 day", () => shiftLog(track, stage, -1)));
      logRow.appendChild(logBtn("+1 day", () => shiftLog(track, stage, +1)));
      logRow.appendChild(logBtn("Undo", () => {
        delete track.log[stage.name];
        persistTrack(track);
        rebuildTracker();
        showToast(`${stage.name} unmarked`);
      }));
    } else {
      logRow.appendChild(logBtn("Mark done", () => {
        track.log = track.log || {};
        track.log[stage.name] = { date: isoOf(today) };
        persistTrack(track);
        rebuildTracker();
        showToast(`${stage.name} marked done today`);
      }, true));
    }
    div.appendChild(logRow);
    timeline.appendChild(div);
  });

  renderSavedCrops();
  renderMyCrops();
});

// one small pill button for the stage log row
function logBtn(label, onClick, primary) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "log-btn" + (primary ? " tick" : "");
  btn.textContent = label;
  btn.addEventListener("click", (event) => {
    event.stopPropagation();
    onClick();
  });
  return btn;
}

// move a logged stage one day earlier or later, the real life happened
function shiftLog(track, stage, days) {
  track.log = track.log || {};
  const entry = track.log[stage.name];
  if (!entry) return;
  const d = logDate(entry);
  d.setDate(d.getDate() + days);
  entry.date = isoOf(d);
  persistTrack(track);
  rebuildTracker();
  showToast(`${stage.name} logged ${Math.abs(days)} day${Math.abs(days) > 1 ? "s" : ""} ${days < 0 ? "earlier" : "later"}`);
}

// ---- My crops: every built roadmap is saved on this phone ------------
function loadTracks() {
  try { return JSON.parse(localStorage.getItem("agrilink-tracks")) || []; } catch { return []; }
}
function saveTracks(list) {
  try { localStorage.setItem("agrilink-tracks", JSON.stringify(list)); } catch { /* full storage */ }
}

// One saved track → everything the UI needs (progress, stage, countdown).
// Uses the farmer's real log when there is one, the calendar otherwise.
function trackSummary(track) {
  const crop = CROPS.find((c) => c.name === track.crop);
  if (!crop) return null;
  const plantingDate = new Date(track.date + "T12:00:00");
  const roadmap = buildRoadmap(crop, plantingDate);
  const summary = trackProgress(crop, plantingDate, roadmap, track.log || {}, new Date());
  return { crop, ...summary };
}

// Home card: one compact row per tracked crop.
function renderMyCrops() {
  const card = document.getElementById("my-crops-card");
  const box = document.getElementById("my-crops");
  if (!card || !box) return;
  const tracks = loadTracks();
  card.classList.toggle("hidden", !tracks.length);
  box.innerHTML = "";

  tracks.forEach((track) => {
    const s = trackSummary(track);
    if (!s) return;
    const countdown = s.done ? "<b>Harvest ready</b>"
      : s.notStarted ? `starts in ${-Math.round((new Date(track.date + "T12:00:00") - new Date()) / 86400000)} days`
      : `<b>${s.daysToHarvest} days</b> to harvest`;

    const row = document.createElement("div");
    row.className = "mini-crop";
    row.innerHTML =
      `<span class="icon">${CROP_ICONS[s.crop.name]}</span>` +
      `<span class="mini-info">` +
        `<span class="mini-name">${s.crop.name}</span>` +
        `<span class="mini-sub">${s.stageName} · ${countdown}</span>` +
        `<span class="mini-bar"><span style="width:${s.percent}%"></span></span>` +
      `</span>` +
      `<span class="mini-pct">${s.percent}%</span>`;
    row.addEventListener("click", () => openTrack(track));
    box.appendChild(row);
  });
}

// Tracker card: fuller rows with the planting date and a remove button.
function renderSavedCrops() {
  const card = document.getElementById("saved-crops");
  const box = document.getElementById("saved-list");
  if (!card || !box) return;
  const tracks = loadTracks();
  card.classList.toggle("hidden", !tracks.length);
  box.innerHTML = "";

  tracks.forEach((track) => {
    const s = trackSummary(track);
    if (!s) return;
    const planted = new Date(track.date + "T12:00:00")
      .toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

    const row = document.createElement("div");
    row.className = "saved-item";
    row.innerHTML =
      `<span class="icon">${CROP_ICONS[s.crop.name]}</span>` +
      `<span class="saved-info">` +
        `<span class="saved-name">${s.crop.name}</span>` +
        `<span class="saved-sub">Planted ${planted} · ${s.done ? "harvest ready" : s.notStarted ? "not planted yet" : `${s.daysToHarvest} days to harvest`}</span>` +
        `<span class="saved-bar"><span style="width:${s.percent}%"></span></span>` +
      `</span>` +
      `<button type="button" class="saved-remove" aria-label="Remove ${s.crop.name}">Remove</button>`;
    row.addEventListener("click", () => openTrack(track));
    row.querySelector(".saved-remove").addEventListener("click", (event) => {
      event.stopPropagation();
      saveTracks(loadTracks().filter((t) => t.id !== track.id));
      renderSavedCrops();
      renderMyCrops();
      showToast(`${s.crop.name} removed from My crops`);
    });
    box.appendChild(row);
  });
}

// Tap a saved crop → it opens in the Tracker with its roadmap rebuilt.
function openTrack(track) {
  showScreen("screen-tracker");
  document.getElementById("track-crop").value = track.crop;
  document.getElementById("track-date").value = track.date;
  document.getElementById("build-timeline").click();
  window.scrollTo({ top: 0 });
}

// ============ PHOTO CHECK FAB (bottom-centre scan button) ============
// Scan → photo screen → file/camera picker opens immediately.
// If the picker is cancelled, the farmer simply lands on the photo screen.
document.getElementById("photo-fab").addEventListener("click", () => {
  showScreen("screen-photo");
  document.getElementById("photo-btn").click(); // same tap also opens the picker
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

// a crop the farmer chose for photos wins over the planner/tracker choice
const savedPhotoCrop = localStorage.getItem("agrilink-photo-crop");
if (savedPhotoCrop) photoCropSelect.value = savedPhotoCrop;

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
    lastPhotoAnalysis = analysis; // kept so changing the crop re-runs the match

    // 2. not enough plant in the photo? say so instead of guessing
    if (analysis.leafPct < 15) {
      bars.innerHTML = `<p class="muted small">Not enough leaf in this photo (${analysis.leafPct}% of the frame).
        Fill the frame with the leaf and use good light.</p>`;
      document.getElementById("photo-matches").innerHTML = "";
      document.getElementById("photo-result").classList.remove("hidden");
      document.getElementById("photo-result").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    bars.innerHTML =
      colourBar("Healthy green", analysis.greenPct, "#2e9e55") +
      colourBar("Yellowing", analysis.yellowPct, "#e0b03a") +
      colourBar("Brown / dry", analysis.brownPct, "#a3703f") +
      (analysis.whitePct > 0 ? colourBar("White powder", analysis.whitePct, "#b9b5a9") : "") +
      colourBar("Dark spots", analysis.darkPct, "#4a3b2a");

    // 3. match against the problem dataset, then walk the farmer
    //    to the crop chooser, the match re-runs if they change it
    runPhotoMatch();
    photoCropSelect.focus();
    photoCropSelect.classList.add("nudge");
    setTimeout(() => photoCropSelect.classList.remove("nudge"), 1800);
    showToast("Now choose which crop this is");

    document.getElementById("photo-result").classList.remove("hidden");
    document.getElementById("photo-result").scrollIntoView({ behavior: "smooth", block: "start" });
    saveLastScan(img, analysis); // the scan stays on screen next visit
  };
});

// the colour analysis of the current photo (null = no photo yet)
let lastPhotoAnalysis = null;

// the farmer's crop choice for photos is remembered and respected:
// opening a plan no longer overwrites it (it only seeds the default)
let photoCropUserChosen = !!localStorage.getItem("agrilink-photo-crop");

// match the last analysis against the currently chosen crop and render
function runPhotoMatch() {
  if (!lastPhotoAnalysis || lastPhotoAnalysis.leafPct < 15) return;
  const cropName = photoCropSelect.value; // the crop chosen right here on this screen

  const matches = matchProblems(lastPhotoAnalysis, cropName);
  window.lastPhotoCheck = { cropName, matches, leafPct: lastPhotoAnalysis.leafPct };
  const box = document.getElementById("photo-matches");
  box.innerHTML =
    `<p class="small muted">Checked as <b>${cropName}</b></p>` +
    matches.slice(0, 3).map((m) =>
      `<div class="match">
         <div class="match-head"><b>${m.problem.name}</b>
           <span class="match-score">${m.score}% match</span></div>
         <div class="small muted"><b>Looks like:</b> ${m.problem.looksLike}</div>
         <div class="small"><b>What to do:</b> ${m.problem.fix}</div>
       </div>`
    ).join("");

  document.getElementById("photo-report").classList.toggle("hidden", !matches.length || matches[0].problem.name === "Healthy plant");
}

// changing the crop after a photo check re-runs the match instantly
photoCropSelect.addEventListener("change", () => {
  photoCropUserChosen = true; // the farmer decided; remember it
  try { localStorage.setItem("agrilink-photo-crop", photoCropSelect.value); } catch { /* full storage */ }
  if (lastPhotoAnalysis) {
    runPhotoMatch();
    showToast(`Re-checked as ${photoCropSelect.value}`);
  }
});

// ---- the last scan stays on the screen (photo + analysis, on this phone) ----
function saveLastScan(img, analysis) {
  try {
    // shrink to a 256px square thumbnail first: small enough for localStorage
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const scale = Math.max(size / img.width, size / img.height);
    const w = img.width * scale, h = img.height * scale;
    ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
    localStorage.setItem("agrilink-photo-last", JSON.stringify({
      img: canvas.toDataURL("image/jpeg", 0.7),
      analysis,
      at: Date.now(),
    }));
  } catch { /* storage full: the app still works, it just forgets the photo */ }
}

function restoreLastScan() {
  let last;
  try { last = JSON.parse(localStorage.getItem("agrilink-photo-last")); } catch { return; }
  if (!last || !last.analysis) return;
  lastPhotoAnalysis = last.analysis;
  document.getElementById("photo-img").src = last.img;
  document.getElementById("photo-preview").classList.remove("hidden");
  if (lastPhotoAnalysis.leafPct >= 15) {
    document.getElementById("photo-bars").innerHTML =
      colourBar("Healthy green", lastPhotoAnalysis.greenPct, "#2e9e55") +
      colourBar("Yellowing", lastPhotoAnalysis.yellowPct, "#e0b03a") +
      colourBar("Brown / dry", lastPhotoAnalysis.brownPct, "#a3703f") +
      (lastPhotoAnalysis.whitePct > 0 ? colourBar("White powder", lastPhotoAnalysis.whitePct, "#b9b5a9") : "") +
      colourBar("Dark spots", lastPhotoAnalysis.darkPct, "#4a3b2a");
    runPhotoMatch();
    document.getElementById("photo-result").classList.remove("hidden");
  }
}

// PHOTO CHECK -> PROBLEM BOARD: one tap files what the photo found.
document.getElementById("photo-report").addEventListener("click", () => {
  const check = window.lastPhotoCheck;
  if (!check) return;
  const top = check.matches[0];
  addReport(check.cropName, top.problem.name, `Flagged by a photo check (${top.score}% colour match), ${check.leafPct}% leaf in frame.`);
  document.getElementById("photo-report").classList.add("hidden");
  showToast("Reported to the Problem Board");
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
// (only until they pick one themselves on the photo screen)
function syncPhotoCrop() {
  if (photoCropUserChosen) return;
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

// board filter buttons
document.querySelectorAll("#board-filter button").forEach((btn) => {
  btn.addEventListener("click", () => setBoardFilter(btn.dataset.filter));
});

// ============ SETTINGS ============
// Appearance (dark / light) and units (°C / °F), saved on this phone.
document.getElementById("settings-theme").addEventListener("click", toggleTheme);

document.getElementById("settings-units").addEventListener("click", () => {
  const next = getUnit() === "c" ? "f" : "c";
  localStorage.setItem("agrilink-unit", next);
  showToast(next === "f" ? "Temperatures shown in °F" : "Temperatures shown in °C");
  // re-render everything that shows a temperature
  if (currentWeather) {
    renderFarmStats();
    renderForecastStrip();
    const crop = CROPS.find((c) => c.name === document.getElementById("track-crop").value);
    if (crop && !document.getElementById("plan-result").classList.contains("hidden")) showPlan(CROPS.indexOf(crop));
  }
  document.getElementById("settings-units").textContent = getUnit() === "f" ? "°F / °C" : "°C / °F";
});

document.getElementById("btn-settings").addEventListener("click", () => {
  const parish = localStorage.getItem("agrilink-parish") || "Not set yet";
  const town = localStorage.getItem("agrilink-town") || "";
  document.getElementById("settings-place").textContent = parish === "Not set yet" ? parish : placeLabel(town, parish);
  document.getElementById("settings-parish").textContent =
    parish === "Not set yet" ? "Weather and picks use your parish." : "Weather, picks and the board use this.";
  showScreen("screen-settings");
});

// "Change" in settings re-opens onboarding exactly like the Home button
document.getElementById("settings-change").addEventListener("click", reopenOnboarding);

// "Replay" in settings re-runs the tutorial
document.getElementById("settings-tutorial").addEventListener("click", () => {
  pendingParish = localStorage.getItem("agrilink-parish") || "";
  pendingTown = localStorage.getItem("agrilink-town") || "";
  pendingName = localStorage.getItem("agrilink-name") || "";
  pendingCountry = localStorage.getItem("agrilink-country") || "";
  showTutorialStep(0);
  document.getElementById("onboarding").classList.remove("hidden");
});

// "Clear" needs two taps, nobody wipes their farm by accident
let clearArmed = false;
document.getElementById("settings-clear").addEventListener("click", (event) => {
  const btn = event.currentTarget;
  if (!clearArmed) {
    clearArmed = true;
    btn.textContent = "Tap again to confirm";
    setTimeout(() => { clearArmed = false; btn.textContent = "Clear"; }, 3000);
    return;
  }
  Object.keys(localStorage)
    .filter((key) => key.startsWith("agrilink"))
    .forEach((key) => localStorage.removeItem(key));
  location.reload();
});

// ============ START THE APP ============
document.body.dataset.screen = "screen-home";
applyTheme(getTheme());
// prefill the chat name from onboarding so messages sign themselves
document.getElementById("chat-name").value = localStorage.getItem("agrilink-name") || "";
renderChat();
renderReports();
renderTypeChips();
renderMyCrops();
renderSavedCrops();
renderTipOfDay();
renderForecastSkeleton();
updateOfflineBadge();

document.getElementById("crop-search").placeholder = `Search ${CROPS.length} crops…`;
document.getElementById("settings-units").textContent = getUnit() === "f" ? "°F / °C" : "°C / °F";
restoreLastScan(); // the last plant photo and result stay on the scan screen

// refresh the forecast strip when the day flips over
setInterval(() => { if (currentWeather) renderForecastStrip(); }, 60 * 60 * 1000);

const savedParish = localStorage.getItem("agrilink-parish");
if (savedParish) {
  // returning user → fill in the farm card and load data
  const savedTown = localStorage.getItem("agrilink-town") || "";
  document.getElementById("farm-place").textContent = placeLabel(savedTown, savedParish);
  document.getElementById("hero-condition").textContent = "Checking this week's forecast…";
  document.getElementById("how-it-works").classList.add("hidden"); // setup done
  loadFarmData(savedParish);
  renderCrops();
  renderTopPicks();
  syncPhotoCrop();
}

// ---- keep hosted-site banners off the tab bar (Netlify Drop deploys) ----
// The "Powered by Netlify" / cookie banner is injected at the bottom of the
// page and covers the tab buttons. Any bottom-anchored overlay we don't own
// that overlaps the tab bar gets lifted above it, whatever it's called.
(function liftHostBanners() {
  function isOurs(el) {
    return el.closest && el.closest(".tabbar, .toast, .onboarding, .chat-feed, #onboarding");
  }
  function lift() {
    const tabbar = document.querySelector(".tabbar");
    if (!tabbar) return;
    const barRect = tabbar.getBoundingClientRect();
    const vh = window.innerHeight;
    // every element (banners can be wrapped or renamed by the host)
    for (const el of document.body.querySelectorAll("body, body *")) {
      if (el === document.body || isOurs(el)) continue;
      const cs = getComputedStyle(el);
      if (cs.position !== "fixed" || cs.display === "none" || cs.visibility === "hidden") continue;
      const rect = el.getBoundingClientRect();
      // only small-ish bottom-anchored overlays: banners, not full-screen modals
      const bottomAnchored = rect.bottom >= vh - 30;
      const overlapsBar = rect.bottom > barRect.top && rect.top < barRect.bottom;
      const isBannerSize = rect.height < vh * 0.6 && rect.height > 12 && rect.width > 80;
      if (bottomAnchored && overlapsBar && isBannerSize && !el.dataset.agrilinkLifted) {
        el.dataset.agrilinkLifted = "1";
        el.style.bottom = "calc(96px + env(safe-area-inset-bottom))";
        el.style.top = "auto";
      }
    }
  }
  lift();
  // hosts inject their banner later, or style it after inserting: watch for
  // both, throttled so page changes never cause a scan storm
  let timer = null;
  const schedule = () => {
    if (timer) return;
    timer = setTimeout(() => { timer = null; lift(); }, 300);
  };
  if ("MutationObserver" in window) {
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class"] });
  }
  window.addEventListener("load", lift);
  window.addEventListener("resize", lift);
})();

// Register the service worker so the app opens on a phone with no signal.
// (file:// previews simply skip this, there is nothing to register there.)
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}
