# AgriLink

A simple web app that helps Caribbean farmers decide **when to plant**. It works offline, installs on Android, and covers 14 Caribbean countries.

**Live app:** https://timely-marshmallow-9054ac.netlify.app

## How to access and run the code

**You need:**
- A web browser (you already have one) — https://www.google.com/chrome
- **Python 3.11+** (only for the backend) — download: https://www.python.org/downloads/

**Step 1 — Get the code.** Download it from GitHub: click the green **Code** button → **Download ZIP**, unzip it. (Or with Git: `git clone https://github.com/yvtinnn/agrilink.git`)

**Step 2 — Run it, easiest way:** double-click `index.html`. The whole app opens in your browser. No install needed.

**Step 3 — Run it with the backend (optional, Python):**
```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```
Then open `http://localhost:8000` in your browser.

That's it — 3 steps.

## How to use it

1. Open the app and choose your **country**, **parish/area** and town.
2. **Home** shows the weather, the top crops to plant right now, and heavy-rain warnings.
3. **Planner** — pick a crop to see its planting score, best months and this week's forecast.
4. **Tracker** — enter a crop and planting date to get a dated roadmap from seed to harvest. Tick stages off as they happen.
5. **Scan** — take a photo of a sick leaf; the phone compares it against common crop problems and suggests a fix. Nothing is uploaded.
6. **Community** — chat with other farmers and post problems to the board.
7. **Settings** — change your location, switch light/dark and °C/°F, or clear your data.

## What it does

- **Planner** — ranks crops for your area using the planting season, 10 years of rainfall history, and the 7-day forecast.
- **Tracker** — dated growth roadmap with a progress bar and harvest countdown.
- **Photo check** — on-device colour analysis of a leaf photo against 8 common crop problems.
- **Community** — farmer chat and problem board (live sharing with Firebase, local-only without it).

## Countries covered

Jamaica (14 parishes) plus Barbados, Trinidad & Tobago, Guyana, Belize, Haiti, Dominican Republic, St. Lucia, Grenada, St. Vincent & the Grenadines, Antigua & Barbuda, Dominica, St. Kitts & Nevis, and the Bahamas.

## Built with

JavaScript and Python only. No frameworks, no build step.

## This is the backend

The `backend/` folder is the Python server (FastAPI). It serves the app and provides the API the JavaScript frontend calls:

```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

Then open `http://localhost:8000`. The API also serves `/docs` with all endpoints:

| Endpoint | Returns |
|---|---|
| `GET /api/parishes` | all 77 locations across the Caribbean with coordinates |
| `GET /api/farm-data/{location}` | live forecast and ten-year climate history |
| `GET /api/crops` | crop database with planting windows and growth stages |
| `GET /api/recommend/{location}?crop=Corn` | scored planting recommendation |
| `GET /api/problems` | crop-problem dataset used by the photo checker |

Without the backend, the same app runs standalone from `index.html` (or the Netlify link above) and calls Open-Meteo directly from the browser.

## How the planting score works

1. **Season** — is this one of the crop's best months?
2. **Climate history** — the 10-year average rainfall for this month in your area.
3. **Live forecast** — rain and temperature for the next 7 days.

Each signal shows as a plus or minus, so the score is easy to read.

Data comes from [Open-Meteo](https://open-meteo.com) (free, no key needed).
