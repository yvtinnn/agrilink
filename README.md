# 🌱 AgriLink — Plant smarter. Harvest more.

AgriLink helps smallholder and local farmers fight climate unpredictability with:
- **Predictive Crop Planning** — the best time to plant, built from a live 7-day forecast **and 10 years of rainfall history for your exact parish**
- **Growth Lifecycle Tracking** — a dated roadmap from seed to harvest for every crop

**Free for everyone. No paywall. No account needed.**

---

## ▶️ How to open AgriLink (for judges)

### Option 1 — Just open the link
If you received a link to this app (e.g. hosted on Netlify or GitHub Pages), simply **click it**.
It works in any browser, on any phone or computer, with nothing to install.

### Option 2 — Open from the folder
Double-click **`index.html`**. That's it — the whole app runs locally in your browser.

### Option 3 — Install it as a real app (Android, one tap)
1. Open the hosted link in **Chrome on Android**
2. Tap the **"Install AgriLink"** banner at the bottom of the screen (or ⋮ menu → *Add to Home screen*)
3. AgriLink appears on your home screen with its own icon and opens full-screen, like any Play Store app.
   It even works **offline** once installed — perfect for farms with weak signal.

---

## 🚀 How we host it (for the team)

**Easiest — Netlify Drop:**
1. Go to https://app.netlify.com/drop
2. Drag this whole `agrilink` folder onto the page
3. Netlify gives you a public link in ~10 seconds. Done.

**Alternative — GitHub Pages (already a GitHub repo):**
1. Repo → *Settings → Pages*
2. Source: *Deploy from a branch*, branch `main`, folder `/ (root)` → Save
3. Live at `https://yvtinnn.github.io/agrilink/` in about a minute

---

## 🧠 How the prediction works

AgriLink combines three signals, shown transparently with every recommendation:

1. **Season** — which months each crop historically does best in Jamaica
2. **Climate history** — the 10-year average rainfall for the *coming month*, fetched for
   the farmer's exact parish from [Open-Meteo's ERA5 archive](https://open-meteo.com/en/docs/historical-weather-api)
   (so St. Elizabeth is judged by St. Elizabeth's history, not the island average)
3. **Live forecast** — the next 7 days of rain and temperature from [Open-Meteo](https://open-meteo.com)

Each fact is shown as a simple +/- contribution to a confidence score. No black box.
If the APIs are unreachable (offline farm, no signal), the app falls back to sensible
sample values so it never breaks.

## 🗂 Project structure

```
agrilink/
├── index.html          ← the whole app (open this!)
├── css/styles.css      ← the AgriLink look
├── js/planner.js       ← crop database + planting advice + growth roadmap
├── js/app.js           ← glue: navigation, location, weather, climate, screens
├── manifest.json       ← makes it installable as an app
├── service-worker.js   ← makes it work offline
├── icons/              ← app icons
└── docs/               ← flow chart & design documents
```

## 🛠 Built with

Plain **HTML, CSS and JavaScript** — no frameworks, no build tools, no installs.
That's on purpose: anyone (including us!) can read the code, and anyone can run the app.
