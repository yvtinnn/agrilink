# AgriLink

A simple web app that helps Caribbean farmers decide **when to plant**. It works offline, installs on Android, and covers 14 Caribbean countries.

**Live app:** https://timely-marshmallow-9054ac.netlify.app

## How to get it

Open the link in Chrome on your Android phone:

**https://timely-marshmallow-9054ac.netlify.app**

**To install it on an Android phone (Chrome):**
1. Open the link above in Chrome.
2. Tap the **⋮** menu (top right) → **Add to Home screen** (or tap **Install AgriLink** if it appears).
3. Tap **Install**. The app now sits on your home screen and works offline.

The code can also be downloaded from this repo: click the green **Code** button → **Download ZIP**.

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

## Countries and regions covered

**126 regions across 14 Caribbean countries.** Pick your country on first launch, then your parish/district/region from that country's list:

| Country | Regions |
|---|---|
| Jamaica | 14 parishes |
| Barbados | 11 parishes |
| St. Kitts & Nevis | 13 parishes (St. Kitts + Nevis) |
| Dominican Republic | 11 regions |
| Haiti | 10 departments |
| St. Lucia | 10 districts |
| Dominica | 10 parishes |
| Trinidad & Tobago | 9 areas incl. Tobago |
| Guyana | 7 regions |
| Antigua & Barbuda | 6 parishes + Barbuda |
| Belize | 6 districts |
| Bahamas | 6 islands |
| Grenada | 6 parishes |
| St. Vincent & the Grenadines | 6 parishes + the Grenadines |

Region names repeat across countries (several have a "Saint George"), so the app always keeps the country with the region — in the location label ("Town, Region, Country"), the saved settings and the API.

## App flow

How a farmer moves through the app, from first launch to the community board:

![AgriLink app flow chart](docs/agrilink-app-flow-chart.svg)

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
| `GET /api/parishes` | all 126 regions across 14 countries, grouped by country, with coordinates |
| `GET /api/farm-data/{country}/{region}` | live forecast and ten-year climate history (e.g. `/api/farm-data/Jamaica/Clarendon`) |
| `GET /api/crops` | crop database with planting windows and growth stages |
| `GET /api/recommend/{country}/{region}?crop=Corn` | scored planting recommendation |
| `GET /api/problems` | crop-problem dataset used by the photo checker |

The old one-name routes (`/api/farm-data/{parish}`, `/api/recommend/{parish}`) still work for Jamaica parishes.

Without the backend, the same app runs standalone from `index.html` (or the Netlify link above) and calls Open-Meteo directly from the browser.

## How the planting score works

1. **Season** — is this one of the crop's best months?
2. **Climate history** — the 10-year average rainfall for this month in your area.
3. **Live forecast** — rain and temperature for the next 7 days.

Each signal shows as a plus or minus, so the score is easy to read.

Data comes from [Open-Meteo](https://open-meteo.com) (free, no key needed).
