# 🌱 AgriLink — Plant smarter. Harvest more.

AgriLink helps smallholder and local farmers fight climate unpredictability with:
- **Predictive Crop Planning** — the best time to plant, built from a live 7-day forecast **and 10 years of rainfall history for your exact parish**
- **Growth Lifecycle Tracking** — a dated roadmap from seed to harvest for every crop
- **Crop Photo Check** — a photo of a sick plant is analysed against our dataset of 8 common crop problems (runs fully on the phone, no upload needed)
- **Public Problem Board** — farmers report what's attacking their crops so neighbours in the same parish can watch out for it

**Free for everyone. No paywall. No account needed. Built by high school students.**

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

**Easiest — Netlify Drop (frontend only):**
1. Go to https://app.netlify.com/drop
2. Drag this whole `agrilink` folder onto the page
3. Netlify gives you a public link in ~10 seconds. Done.

**Alternative — GitHub Pages (already a GitHub repo):**
1. Repo → *Settings → Pages*
2. Source: *Deploy from a branch*, branch `main`, folder `/ (root)` → Save
3. Live at `https://yvtinnn.github.io/agrilink/` in about a minute

## 🖥 Running the FastAPI backend (full app + API)

The frontend works standalone, but the backend adds a real API layer:

```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

Then open **http://localhost:8000** — the same app, now served by FastAPI, with:

| Endpoint | What it returns |
|---|---|
| `GET /api/parishes` | all 14 parishes with coordinates |
| `GET /api/farm-data/{parish}` | live forecast + 10-year climate history |
| `GET /api/crops` | crop database with planting windows and growth stages |
| `GET /api/recommend/{parish}?crop=Corn` | full scored planting recommendation |
| `GET /api/problems` | the crop-problem dataset used by the photo checker |
| `/docs` | automatic interactive API documentation |

When the frontend is served by the backend, it automatically uses these API
calls instead of calling Open-Meteo directly. Opened as a plain file, it still
works — it falls back to calling Open-Meteo from the browser.

---

## 🧠 How the prediction works

AgriLink combines three signals, shown transparently with every recommendation:

1. **Season** — which months each crop historically does best in Jamaica
2. **Climate history** — the 10-year average rainfall for the *coming month*, fetched for
   the farmer's exact parish from [Open-Meteo's ERA5 archive](https://open-meteo.com/en/docs/historical-weather-api)
   (so St. Elizabeth is judged by St. Elizabeth's history, not the island average)
3. **Live forecast** — the next 7 days of rain and temperature from [Open-Meteo](https://open-meteo.com)

Each fact is shown as a simple +/- contribution to a confidence score. No black box.
The same scoring rules exist in two places that agree with each other:
`js/planner.js` (browser) and `backend/recommend.py` (FastAPI server).
If the APIs are unreachable (offline farm, no signal), the app falls back to sensible
sample values so it never breaks.

## 🔎 How the photo check works

Honest and simple — no machine learning, so anyone can understand it:

1. The photo is shrunk to 160×160 pixels inside the browser (it never leaves the phone)
2. Every pixel is sorted into three colour families: **healthy green**, **yellowing**, and **brown/dry**
3. The colour mix is compared with the expected pattern of each problem in our dataset
4. The best matches are shown with what the problem looks like and what to do about it

The app tells the farmer straight: *this is a simple colour check, not a lab test* —
and suggests confirming with a RADA extension officer for serious cases.

## 📋 The problem dataset

`js/problems.js` (browser) and `backend/problems.py` (API) hold 8 common Jamaican crop
problems — nitrogen deficiency, drought stress, early blight, waterlogging, army worm,
sun scorch, powdery mildew, and healthy. Each lists which crops it affects, what it looks
like on the leaf, the colour pattern the analyser expects, and a practical fix.

## 🗂 Project structure

```
agrilink/
├── index.html            ← the whole app (open this!)
├── css/styles.css        ← the AgriLink look
├── js/planner.js         ← crop database + planting advice + growth roadmap
├── js/problems.js        ← crop-problem dataset + photo analyser + problem board
├── js/app.js             ← glue: onboarding, navigation, weather, climate, screens
├── backend/main.py       ← FastAPI server (serves the app + JSON API)
├── backend/crops.py      ← crop database (server-side copy)
├── backend/problems.py   ← crop-problem dataset (server-side copy)
├── backend/recommend.py  ← scoring rules (server-side copy)
├── backend/requirements.txt
├── assets/               ← logo files
├── manifest.json         ← makes it installable as an app
├── service-worker.js     ← makes it work offline
├── icons/                ← app icons (built from the real logo)
└── docs/                 ← flow chart, logo, screenshots & captions
```

## 🛠 Built with

Plain **HTML, CSS and JavaScript** — no frameworks, no build tools, no installs.
That's on purpose: anyone (including us!) can read the code, and anyone can run the app.
