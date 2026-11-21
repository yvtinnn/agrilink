/* ============================================================
   planner.js — the "brain" of AgriLink's farming advice.
   Crop database + the rules that turn live weather and
   10-year climate history into a planting recommendation
   and a growth roadmap.
============================================================ */

// ---- Minimal SVG icons for each crop (no emoji, prints crisp) ----
const CROP_ICONS = {
  Tomato: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="19" r="9" fill="currentColor" fill-opacity=".15"/><path d="M16 10c-2-3-5-4-7-3 1 2 3 4 7 3z" fill="currentColor" fill-opacity=".4"/><path d="M16 10c2-3 5-4 7-3-1 2-3 4-7 3z" fill="currentColor" fill-opacity=".4"/><path d="M16 10v3"/><path d="M12 17c.5-1.5 1.5-2.5 3-3"/></svg>`,
  Cabbage: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="16" cy="17" r="10" fill="currentColor" fill-opacity=".15"/><circle cx="16" cy="17" r="5" fill="currentColor" fill-opacity=".25"/><path d="M16 7c1-2 3-3 5-3"/><path d="M9 25c3 2 11 2 14 0"/></svg>`,
  "Scotch Bonnet": `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 8c4 0 6 4 4 9-2 6-8 11-13 11-3 0-5-2-5-5 0-2 2-3 4-3 5 0 8-4 8-8 0-2 1-4 2-4z" fill="currentColor" fill-opacity=".2"/><path d="M18 7c0-2 2-4 4-4"/></svg>`,
  Corn: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 6c4 0 7 5 7 12 0 4-2 8-5 8s-5-4-5-8c0-7 2-12 5-12z" fill="currentColor" fill-opacity=".15"/><path d="M15 26c-3-1-7-1-9 2"/><path d="M17 26c3-1 7-1 9 2"/><path d="M13 12h6M12 17h8M13 22h6" opacity=".7"/></svg>`,
  Okra: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 6c2 4 2 12-3 18-2 3-5 4-7 3s-2-4 0-7c4-7 8-12 10-14z" fill="currentColor" fill-opacity=".2"/><path d="M21 8c-3 2-6 6-8 10"/></svg>`,
  Callaloo: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 28V12" /><path d="M16 14C16 8 12 5 7 5c0 6 4 9 9 9z" fill="currentColor" fill-opacity=".2"/><path d="M16 18c0-5 4-8 9-8 0 6-4 9-9 8z" fill="currentColor" fill-opacity=".35"/></svg>`,
  Pumpkin: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="16" cy="19" rx="11" ry="8.5" fill="currentColor" fill-opacity=".15"/><path d="M11 11.5c-2 4-2 11 0 15M21 11.5c2 4 2 11 0 15M16 10v18" opacity=".7"/><path d="M16 10c0-3 1.5-5 4-6-1 3-1 5-2 6z" fill="currentColor" fill-opacity=".4"/></svg>`,
  "Sweet Potato": `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="15" cy="20" rx="10" ry="6.5" transform="rotate(-18 15 20)" fill="currentColor" fill-opacity=".2"/><path d="M21 8c1.5-1 3-1.5 5-1.5-1.5 2-3 3-5 4z" fill="currentColor" fill-opacity=".4"/><path d="M19 10l2-2"/></svg>`,
  Carrot: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 12 L22 24 C24 26 22 28 20 26 L8 14 Z" fill="currentColor" fill-opacity=".2"/><path d="M10 12 C9 9 9 6 11 3 M10 12 C12 10 15 9 18 9 M10 12 C8 11 5 11 3 12" stroke-width="2"/></svg>`,
  Lettuce: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 27c-6 0-10-4-10-9 0-6 4-13 10-13s10 7 10 13c0 5-4 9-10 9z" fill="currentColor" fill-opacity=".15"/><path d="M16 27c-3 0-5-2-5-4 0-3 2-5 5-5s5 2 5 5c0 2-2 4-5 4z" fill="currentColor" fill-opacity=".25"/><path d="M10 12c1-3 3-5 6-5" opacity=".7"/></svg>`,
  Onion: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 10c5 0 9 4 9 9 0 5-4 9-9 9s-9-4-9-9c0-5 4-9 9-9z" fill="currentColor" fill-opacity=".15"/><path d="M16 10v18" opacity=".6"/><path d="M16 10c0-3 0-5-2-7M16 10c1-2 3-4 5-4"/></svg>`,
  "Sweet Pepper": `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14c0-3 3-5 7-5s7 2 7 5c0 8-4 13-7 13s-7-5-7-13z" fill="currentColor" fill-opacity=".2"/><path d="M16 9c0-3 1-5 4-6-1 3-1 4-2 6z" fill="currentColor" fill-opacity=".4"/></svg>`,
  Cucumber: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="16" cy="17" rx="6" ry="11" transform="rotate(12 16 17)" fill="currentColor" fill-opacity=".2"/><path d="M13 7c-1 6-1 13 1 19" opacity=".6"/><path d="M16 6c0-2 1-4 3-5"/></svg>`,
  Beet: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 12c4 0 7 3 7 7 0 5-3 10-7 10s-7-5-7-10c0-4 3-7 7-7z" fill="currentColor" fill-opacity=".2"/><path d="M16 12V6M16 12c-2-2-5-3-7-2M16 12c2-2 5-3 7-2" stroke-width="2"/></svg>`,
};

// ---- Our crop database ---------------------------------------------
// bestMonths: month numbers (1 = Jan, 12 = Dec) when this crop grows
// best in Jamaica's climate, based on historical seasonal patterns.
// stages: each growth stage and how many days it takes, with a
// friendly tip a farmer can act on.
const CROPS = [
  {
    name: "Tomato",
    bestMonths: [1, 2, 8, 9, 10],
    stages: [
      { name: "Germination",   days: 6,   tip: "Keep soil moist but not soaked." },
      { name: "Seedling",      days: 20,  tip: "Transplant after 4-5 true leaves appear." },
      { name: "Vegetative",    days: 25,  tip: "Stake the plants now — they grow fast." },
      { name: "Flowering",     days: 20,  tip: "Water regularly; dry spells cause flower drop." },
      { name: "Fruiting",      days: 25,  tip: "Watch for pests — check leaves weekly." },
      { name: "Harvest",       days: 14,  tip: "Pick when colour is 70-80% developed." },
    ],
  },
  {
    name: "Cabbage",
    bestMonths: [9, 10, 11, 12, 1],
    stages: [
      { name: "Germination",   days: 5,   tip: "Sow in a nursery bed first." },
      { name: "Seedling",      days: 25,  tip: "Transplant when about 10 cm tall." },
      { name: "Vegetative",    days: 30,  tip: "Keep weeds down — cabbage hates competition." },
      { name: "Heading",       days: 25,  tip: "Even watering now makes tight heads." },
      { name: "Harvest",       days: 10,  tip: "Cut when heads are firm to the squeeze." },
    ],
  },
  {
    name: "Scotch Bonnet",
    bestMonths: [2, 3, 4, 8, 9],
    stages: [
      { name: "Germination",   days: 12,  tip: "Peppers sprout slowly — be patient." },
      { name: "Seedling",      days: 30,  tip: "Keep seedlings warm and lightly shaded." },
      { name: "Vegetative",    days: 35,  tip: "Space plants 60 cm apart — they get bushy." },
      { name: "Flowering",     days: 25,  tip: "Don't over-fertilise or you'll get leaves, not peppers." },
      { name: "Fruiting",      days: 30,  tip: "Green scotch bonnets are already hot — pick when needed." },
      { name: "Harvest",       days: 20,  tip: "One plant can produce for months." },
    ],
  },
  {
    name: "Corn",
    bestMonths: [4, 5, 9, 10],
    stages: [
      { name: "Germination",   days: 5,   tip: "Plant 2-3 cm deep, 25 cm apart." },
      { name: "Seedling",      days: 15,  tip: "Thin to the strongest plant per hole." },
      { name: "Vegetative",    days: 40,  tip: "This is when corn needs the most water." },
      { name: "Tasseling",     days: 10,  tip: "Pollination happens now — avoid drought stress." },
      { name: "Grain Fill",    days: 30,  tip: "Brown silks mean cobs are filling nicely." },
      { name: "Harvest",       days: 10,  tip: "Kernels should be milky when pressed." },
    ],
  },
  {
    name: "Okra",
    bestMonths: [3, 4, 5, 6],
    stages: [
      { name: "Germination",   days: 7,   tip: "Soak seeds overnight for faster sprouting." },
      { name: "Vegetative",    days: 30,  tip: "Okra loves heat — no shade needed." },
      { name: "Flowering",     days: 15,  tip: "Flowers open for one day only." },
      { name: "Pods",          days: 15,  tip: "Pick pods young, every 2 days." },
      { name: "Harvest",       days: 30,  tip: "Regular picking keeps the plant producing." },
    ],
  },
  {
    name: "Callaloo",
    bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    stages: [
      { name: "Germination",   days: 4,   tip: "Broadcast seeds thinly and cover lightly." },
      { name: "Vegetative",    days: 25,  tip: "Callaloo grows fast — weed early." },
      { name: "First Cut",     days: 10,  tip: "Cut 15 cm above ground so it regrows." },
      { name: "Regrowth",      days: 15,  tip: "You can harvest the same patch 3-4 times." },
      { name: "Harvest",       days: 1,   tip: "Sell fresh — callaloo wilts fast in the sun." },
    ],
  },
  {
    name: "Pumpkin",
    bestMonths: [9, 10, 11],
    stages: [
      { name: "Germination",   days: 6,   tip: "Plant on hills, 3 seeds per hole." },
      { name: "Vining",        days: 35,  tip: "Vines spread over 3 m — give them room." },
      { name: "Flowering",     days: 15,  tip: "Male flowers open first — that's normal." },
      { name: "Fruiting",      days: 35,  tip: "Put straw under fruit to prevent rot." },
      { name: "Harvest",       days: 15,  tip: "Ready when the stem is woody and hard." },
    ],
  },
  {
    name: "Carrot",
    bestMonths: [9, 10, 11, 12, 1],
    stages: [
      { name: "Germination",   days: 10,  tip: "Carrot seeds are tiny — mix with sand to sow evenly." },
      { name: "Seedling",      days: 25,  tip: "Thin to 5 cm apart — crowded carrots make no roots." },
      { name: "Vegetative",    days: 40,  tip: "Keep the soil loose and weed-free; rocks fork the roots." },
      { name: "Root Growth",   days: 30,  tip: "Hill soil over any shoulders poking out — green tops taste bitter." },
      { name: "Harvest",       days: 15,  tip: "Pull when tops are 2 cm wide at the soil line." },
    ],
  },
  {
    name: "Lettuce",
    bestMonths: [10, 11, 12, 1, 2],
    stages: [
      { name: "Germination",   days: 4,   tip: "Sow shallow — lettuce seed needs some light to sprout." },
      { name: "Seedling",      days: 20,  tip: "Shade seedlings; full sun makes them bitter." },
      { name: "Vegetative",    days: 25,  tip: "Water little and often — lettuce is mostly water." },
      { name: "Heading",       days: 20,  tip: "Even moisture now prevents bitter, loose heads." },
      { name: "Harvest",       days: 8,   tip: "Cut early morning and cool immediately." },
    ],
  },
  {
    name: "Onion",
    bestMonths: [10, 11, 12],
    stages: [
      { name: "Germination",   days: 8,   tip: "Start in a nursery bed — onion seedlings are slow." },
      { name: "Seedling",      days: 30,  tip: "Transplant when pencil-thick, 10 cm apart." },
      { name: "Vegetative",    days: 45,  tip: "Onions hate weeds — their leaves can't shade them out." },
      { name: "Bulbing",       days: 30,  tip: "Bulbing is triggered by day length — don't panic if growth stalls." },
      { name: "Harvest",       days: 15,  tip: "Wait until the tops fall over on their own, then cure in the sun." },
    ],
  },
  {
    name: "Sweet Pepper",
    bestMonths: [2, 3, 4, 8, 9],
    stages: [
      { name: "Germination",   days: 10,  tip: "Same as scotch bonnet — warm soil, be patient." },
      { name: "Seedling",      days: 30,  tip: "Transplant when 15 cm tall, 45 cm apart." },
      { name: "Vegetative",    days: 35,  tip: "Stake early — fruits get heavy and snap branches." },
      { name: "Flowering",     days: 20,  tip: "Pick the FIRST few fruits green to push more flowering." },
      { name: "Fruiting",      days: 30,  tip: "Red peppers are just ripe green ones — price differs, so plan." },
      { name: "Harvest",       days: 25,  tip: "Pick every 3-4 days and plants keep producing." },
    ],
  },
  {
    name: "Cucumber",
    bestMonths: [2, 3, 4, 9, 10],
    stages: [
      { name: "Germination",   days: 5,   tip: "Plant on hills like pumpkin, 2 seeds per hole." },
      { name: "Seedling",      days: 12,  tip: "Thin to the stronger seedling per hill." },
      { name: "Vining",        days: 25,  tip: "Trellising keeps fruit straight and clean." },
      { name: "Flowering",     days: 12,  tip: "Pick a few male flowers if plants are all vine, no fruit." },
      { name: "Fruiting",      days: 20,  tip: "Cucumbers grow fast — check plants every 2 days." },
      { name: "Harvest",       days: 25,  tip: "Pick young; overgrown cucumbers turn the plant off." },
    ],
  },
  {
    name: "Beet",
    bestMonths: [10, 11, 12, 1],
    stages: [
      { name: "Germination",   days: 7,   tip: "Each 'seed' is a cluster — thin to one plant per spot." },
      { name: "Seedling",      days: 20,  tip: "Thinnings are edible baby beets and greens — nothing wasted." },
      { name: "Vegetative",    days: 30,  tip: "Keep the soil loose; beets swell better in soft ground." },
      { name: "Root Growth",   days: 30,  tip: "Boron shortage makes black spots inside — a pinch of borax helps." },
      { name: "Harvest",       days: 12,  tip: "Twist the tops off when pulling — cutting makes them 'bleed'." },
    ],
  },
  {
    name: "Sweet Potato",
    bestMonths: [3, 4, 10, 11],
    stages: [
      { name: "Rooting",       days: 10,  tip: "Plant vine cuttings 20 cm deep." },
      { name: "Vining",        days: 40,  tip: "Redirect vines back into the row." },
      { name: "Tuber Growth",  days: 50,  tip: "Stop watering 2 weeks before harvest." },
      { name: "Harvest",       days: 15,  tip: "Cure in the sun 3 days for sweeter taste." },
    ],
  },
];

// ---- Planting recommendation ---------------------------------------
// A transparent scoring system:
//   1. Season: is this one of the crop's best months?
//   2. Climate history: average rainfall for the coming month,
//      taken from ~10 years of records for THIS parish.
//   3. Live forecast: rain and temperature for the next 7 days.
// The final score becomes our confidence percentage.
function recommendCrop(crop, weather, climate) {
  const month = new Date().getMonth() + 1; // 1..12

  let score = 35;
  const facts = [];

  // 1. Seasonal window
  if (crop.bestMonths.includes(month)) {
    score += 40;
    facts.push({ mark: "+", cls: "good", text: `<b>${monthName(month)}</b> is historically a strong month to plant ${crop.name.toLowerCase()} in Jamaica.` });
  } else {
    let next = 0;
    for (let i = 1; i <= 12; i++) {
      const m = ((month + i - 1) % 12) + 1;
      if (crop.bestMonths.includes(m)) { next = i; break; }
    }
    const nextName = monthName((((month + next - 1) % 12) + 1));
    facts.push({ mark: "!", cls: "warn", text: `The usual window for ${crop.name.toLowerCase()} opens in <b>${nextName}</b> (about ${next} month${next > 1 ? "s" : ""} away).` });
  }

  // 2. Climate history for this parish (10-year average)
  const climateRain = climate ? climate.rain : 60;
  const climateLabel = climate
    ? `10-year average for your parish in ${monthName(month)}: <b>${climateRain} mm</b>`
    : `10-year average unavailable — using typical values.`;

  if (climateRain < 15) {
    score -= 10;
    facts.push({ mark: "-", cls: "bad", text: `${climateLabel} — historically a dry month. Irrigation or careful timing needed.` });
  } else if (climateRain > 250) {
    score -= 10;
    facts.push({ mark: "-", cls: "bad", text: `${climateLabel} — historically very wet. Waterlogging and fungal risk.` });
  } else {
    score += 10;
    facts.push({ mark: "+", cls: "good", text: `${climateLabel} — comfortable moisture levels for establishment.` });
  }

  // 3. Live 7-day forecast
  const rain = weather ? weather.rain7 : climateRain / 4;
  const temp = weather ? weather.temp : 27;

  if (rain < 5) {
    score -= 15;
    facts.push({ mark: "-", cls: "bad", text: `Live forecast: only <b>${rain} mm</b> rain this week. Plan to irrigate or wait for showers.` });
  } else if (rain > 80) {
    score -= 20;
    facts.push({ mark: "-", cls: "bad", text: `Live forecast: heavy rain this week (<b>${rain} mm</b>). Risk of waterlogging — strong drainage needed.` });
  } else {
    score += 15;
    facts.push({ mark: "+", cls: "good", text: `Live forecast: <b>${rain} mm</b> rain this week — good moisture for germination.` });
  }

  if (temp < 18 || temp > 33) {
    score -= 10;
    facts.push({ mark: "-", cls: "bad", text: `Temperatures around <b>${temp}°C</b> are outside the usual comfort zone for this crop.` });
  } else {
    score += 5;
    facts.push({ mark: "+", cls: "good", text: `Temperatures around <b>${temp}°C</b> are in the normal growing range.` });
  }

  score = Math.max(10, Math.min(95, Math.round(score)));

  let verdict, cls;
  if (score >= 70)      { verdict = "Great time to plant"; cls = "good"; }
  else if (score >= 50) { verdict = "Possible — plan carefully"; cls = "warn"; }
  else                  { verdict = "Better to wait"; cls = "bad"; }

  return { score, verdict, cls, facts, rain, temp, month, climateRain };
}

function monthName(m) {
  return ["January","February","March","April","May","June","July",
          "August","September","October","November","December"][m - 1];
}

// ---- Growth roadmap builder -----------------------------------------
// Adds up each stage's days to get real calendar dates.
function buildRoadmap(crop, plantingDate) {
  const roadmap = [];
  let day = 0;
  for (const stage of crop.stages) {
    day += stage.days;
    const date = new Date(plantingDate);
    date.setDate(date.getDate() + day);
    roadmap.push({ ...stage, date });
  }
  return roadmap;
}
