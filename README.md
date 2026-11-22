# AgriLink

A planting almanac for Jamaican farmers. It gives a planting window for your parish, a dated growth roadmap, and an offline leaf check. It runs as a web app and installs on Android.

## What it does

- **Planner.** Ranks crops for the current month using each crop's planting window, ten years of parish rainfall from Open-Meteo's ERA5 archive, and the next seven days of rain and temperature. Heavy rain days are flagged before they arrive.
- **Weather predictor.** Every forecast day shows its rain chance in percent, and a one-line prediction says what is coming and when to plant around it.
- **Tracker.** Takes a crop and planting date, then builds a calendar of growth stages with a progress bar and harvest countdown. Roadmaps are saved on the phone.
- **Photo check.** Shrinks a leaf photo to 160×160, builds a colour-pattern feature vector (green, yellow, brown, dark spots, white powder), and scores it against a 14-problem dataset with an on-device nearest-pattern model. The photo never leaves the phone.
- **Community.** A farmer chat, a problem board filtered by parish, and a sample market price table. With Firebase configured the chat and board are live and shared between phones; without it everything stays local (demo messages keep the feed alive).

## Making the community live (Firebase, free)

The app ships in local mode: chat messages and problem reports stay on one phone. To make them shared and live:

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and click **Add project** (no billing needed)
2. In the project: **Build → Realtime Database → Create database**. Choose a location, and **test mode** rules to start
3. **Project settings (gear) → Your apps → Web app (`</>`)**, register it, and copy the `firebaseConfig` values
4. Paste them into `js/firebase-config.js` (replace every `PASTE_` / `YOUR_PROJECT` placeholder) and redeploy

Now the chat and problem board sync between every phone with the app, live. Notes:

- Test-mode rules allow read/write for 30 days; tighten them later in **Realtime Database → Rules**
- The `apiKey` in the config is safe to publish for a public web app; security comes from the database rules
- No config or no signal? The app falls back to local mode automatically and says so with a toast
- **Offline.** The last real forecast is cached, so the app still opens without signal and says when the data is old.

## Open it

- **Hosted:** open the link in any browser.
- **Local:** double-click `index.html`.
- **Install on Android:** open the hosted link in Chrome, then use *Install AgriLink* or *Add to Home screen*. The service worker caches the app for offline use.

## Run the backend

The frontend works on its own. The FastAPI backend adds an API layer and serves the same app.

```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

Then open `http://localhost:8000`.

| Endpoint | Returns |
|---|---|
| `GET /api/parishes` | all 14 parishes with coordinates |
| `GET /api/farm-data/{parish}` | live forecast and ten-year climate history |
| `GET /api/crops` | crop database with planting windows and growth stages |
| `GET /api/recommend/{parish}?crop=Corn` | scored planting recommendation |
| `GET /api/problems` | crop-problem dataset used by the photo checker |
| `/docs` | interactive API documentation |

When the app is served by the backend it uses these endpoints. Opened as a file, it calls Open-Meteo directly from the browser.

## How the prediction works

Three signals go into each score:

1. **Season.** The months when each crop usually grows well in Jamaica.
2. **Climate history.** The ten-year average rainfall for the coming month, for the farmer's parish.
3. **Live forecast.** Rain and temperature for the next seven days.

Each signal is shown as a plus or minus in the plan, so the score is readable. The same rules live in `js/planner.js` and `backend/recommend.py`.

If Open-Meteo is unreachable, the app uses the last saved forecast and labels it as saved. If there is no saved forecast, it falls back to sample values and says so.

## How the photo check works

1. The browser shrinks the photo to 160×160.
2. Each pixel is sorted into healthy green, yellowing, brown or dark spots. Background pixels are ignored.
3. The colour mix is compared with the expected pattern for each problem in the dataset.
4. The closest matches show what the problem looks like and what to do about it.

The result card says this is a colour check, not a lab test, and points serious cases to a RADA extension officer.

## The problem dataset

`js/problems.js` and `backend/problems.py` hold eight common Jamaican crop problems: nitrogen deficiency, drought stress, early blight, waterlogging, army worm, sun scorch, powdery mildew, and a healthy plant. Each entry lists the crops it affects, what it looks like, the colour pattern the analyser expects, and a practical fix.

## A note on AI

We used AI tools to help write and review parts of the code. The crop and problem data, the scoring rules, and the testing are ours. We can explain every line.

## Project structure

```
agrilink/
├── index.html            the app
├── css/styles.css        the look
├── js/planner.js         crop database, planting advice, growth roadmap
├── js/problems.js        problem dataset, photo analyser, problem board
├── js/app.js             onboarding, navigation, weather, screens
├── backend/main.py       FastAPI server
├── backend/crops.py      crop database (server copy)
├── backend/problems.py   problem dataset (server copy)
├── backend/recommend.py  scoring rules (server copy)
├── backend/requirements.txt
├── assets/               logo and fonts
├── manifest.json         installable app metadata
├── service-worker.js     offline cache
├── icons/                app icons
└── docs/                 flow chart and screenshots
```

## Built with

Plain HTML, CSS and JavaScript. No frameworks, no build step. The app is readable and runs from the folder.

Data comes from [Open-Meteo](https://open-meteo.com) and its [historical weather archive](https://open-meteo.com/en/docs/historical-weather-api).
