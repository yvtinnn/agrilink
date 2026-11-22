# AgriLink

A simple web app that helps Caribbean farmers decide **when to plant**. It works offline, installs on Android, and now covers 14 Caribbean countries.

## What it does

- **Planner** — ranks crops for your area using the planting season, 10 years of rainfall history, and the 7-day forecast.
- **Tracker** — enter a crop and planting date, get a dated growth roadmap from seed to harvest.
- **Photo check** — take a photo of a sick leaf; the phone compares it against common crop problems and suggests a fix. Nothing is uploaded.
- **Community** — a farmer chat and a problem board (live sharing with Firebase, local-only without it).
- **Weather** — live forecast plus heavy-rain warnings before they arrive.

## Countries covered

Jamaica (14 parishes) plus Barbados, Trinidad & Tobago, Guyana, Belize, Haiti, Dominican Republic, St. Lucia, Grenada, St. Vincent & the Grenadines, Antigua & Barbuda, Dominica, St. Kitts & Nevis, and the Bahamas.

## Run it

**Frontend only:** open `index.html` in a browser. Done.

**With the backend (FastAPI):**

```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

Then open `http://localhost:8000`. The API also serves `/docs` with all endpoints (`/api/parishes`, `/api/farm-data/{location}`, `/api/crops`, `/api/recommend/{location}?crop=Corn`, `/api/problems`).

## How the planting score works

1. **Season** — is this one of the crop's best months?
2. **Climate history** — the 10-year average rainfall for this month in your area.
3. **Live forecast** — rain and temperature for the next 7 days.

Each signal shows as a plus or minus, so the score is easy to read.

## Project structure

```
agrilink/
├── index.html            the app
├── css/ js/              styles and logic
├── backend/              FastAPI server + data the app can call
├── manifest.json         installable app metadata
├── service-worker.js     offline cache
└── docs/                 flow chart and screenshots
```

Data comes from [Open-Meteo](https://open-meteo.com) (free, no key needed).
