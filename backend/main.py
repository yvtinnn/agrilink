# ============================================================
# AgriLink backend, FastAPI.
# One command runs the whole app:
#     uvicorn backend.main:app --reload
# then open http://localhost:8000
#
# The backend serves the frontend AND provides /api endpoints:
#   - live weather + 10-year climate history (via Open-Meteo)
#   - crop recommendations (same scoring rules as the frontend)
#   - growth roadmaps
# ============================================================

from pathlib import Path
from datetime import datetime
import time
from collections import defaultdict, deque

import httpx
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware

# ---- Locations across the Caribbean (same list as js/app.js) ----
# Jamaica keeps its plain parish names; other countries add the country in
# brackets so every key stays unique. Kingston sits on land at Halfway Tree:
# the old point fell in Kingston Harbour and returned marine rainfall.
PARISHES = {
    # Jamaica (the 14 parishes)
    "Kingston":      (17.98, -76.79),
    "St. Andrew":    (18.02, -76.75),
    "St. Catherine": (17.99, -77.06),
    "Clarendon":     (17.78, -77.37),
    "Manchester":    (18.04, -77.44),
    "St. Elizabeth": (18.07, -77.68),
    "Westmoreland":  (18.18, -78.14),
    "Hanover":       (18.36, -78.12),
    "St. James":     (18.35, -77.90),
    "Trelawny":      (18.35, -77.55),
    "St. Ann":       (18.29, -77.20),
    "St. Mary":      (18.19, -76.93),
    "Portland":      (18.10, -76.60),
    "St. Thomas":    (17.88, -76.42),
    # Barbados
    "St. Michael (Barbados)":    (13.11, -59.60),
    "Christ Church (Barbados)":  (13.07, -59.55),
    "St. James (Barbados)":      (13.09, -59.65),
    "St. Peter (Barbados)":      (13.16, -59.65),
    "St. Lucy (Barbados)":       (13.28, -59.64),
    "St. Andrew (Barbados)":     (13.24, -59.59),
    "St. Thomas (Barbados)":     (13.17, -59.59),
    "St. George (Barbados)":     (13.14, -59.56),
    "St. Philip (Barbados)":     (13.16, -59.50),
    "St. Joseph (Barbados)":     (13.21, -59.56),
    "St. John (Barbados)":       (13.19, -59.52),
    # Trinidad & Tobago
    "Port of Spain (Trinidad)":  (10.65, -61.50),
    "San Fernando (Trinidad)":   (10.28, -61.47),
    "Chaguanas (Trinidad)":      (10.52, -61.41),
    "Arima (Trinidad)":          (10.64, -61.28),
    "Couva (Trinidad)":          (10.42, -61.44),
    "Princes Town (Trinidad)":   (10.27, -61.37),
    "Sangre Grande (Trinidad)":  (10.59, -61.13),
    "Penal (Trinidad)":          (10.16, -61.46),
    "Scarborough (Tobago)":      (11.19, -60.74),
    # Guyana
    "Georgetown (Guyana)":       (6.80, -58.16),
    "New Amsterdam (Guyana)":    (6.25, -57.51),
    "Linden (Guyana)":           (6.00, -58.31),
    "Bartica (Guyana)":          (6.40, -58.62),
    # Belize
    "Belize City (Belize)":      (17.50, -88.20),
    "Belmopan (Belize)":         (17.25, -88.77),
    "Corozal (Belize)":          (18.39, -88.39),
    "Orange Walk (Belize)":      (18.27, -88.56),
    "Dangriga (Belize)":         (16.97, -88.23),
    "Punta Gorda (Belize)":      (15.81, -88.75),
    # Haiti
    "Port-au-Prince (Haiti)":    (18.54, -72.34),
    "Cap-Haïtien (Haiti)":       (19.76, -72.20),
    "Les Cayes (Haiti)":         (18.19, -73.74),
    "Gonaïves (Haiti)":          (19.45, -72.69),
    # Dominican Republic
    "Santo Domingo (Dominican Republic)": (18.49, -69.93),
    "Santiago (Dominican Republic)":      (19.45, -70.70),
    "La Vega (Dominican Republic)":       (19.22, -70.53),
    "San Cristóbal (Dominican Republic)": (18.42, -70.11),
    "Punta Cana (Dominican Republic)":    (18.58, -68.41),
    # St. Lucia
    "Castries (St. Lucia)":      (14.01, -60.99),
    "Soufrière (St. Lucia)":     (13.86, -61.06),
    "Vieux Fort (St. Lucia)":    (13.72, -60.95),
    "Gros Islet (St. Lucia)":    (14.09, -60.94),
    "Dennery (St. Lucia)":       (13.90, -60.92),
    # Grenada
    "St. George's (Grenada)":    (12.05, -61.75),
    "Grenville (Grenada)":       (12.11, -61.63),
    "Sauteurs (Grenada)":        (12.19, -61.60),
    "Hillsborough (Grenada)":    (12.47, -61.68),
    # St. Vincent & the Grenadines
    "Kingstown (St. Vincent)":   (13.16, -61.22),
    "Calliaqua (St. Vincent)":   (13.15, -61.18),
    "Barrouallie (St. Vincent)": (13.25, -61.26),
    "Chateaubelair (St. Vincent)": (13.28, -61.25),
    "Clifton (St. Vincent)":     (12.61, -61.43),
    # Antigua & Barbuda
    "St. John's (Antigua)":      (17.12, -61.85),
    "All Saints (Antigua)":      (17.09, -61.79),
    "Codrington (Barbuda)":      (17.64, -61.79),
    # Dominica
    "Roseau (Dominica)":         (15.30, -61.39),
    "Portsmouth (Dominica)":     (15.57, -61.46),
    "Marigot (Dominica)":        (15.57, -61.29),
    # St. Kitts & Nevis
    "Basseterre (St. Kitts)":    (17.30, -62.72),
    "Charlestown (Nevis)":       (17.19, -62.64),
    # Bahamas
    "Nassau (Bahamas)":          (25.06, -77.35),
    "Freeport (Bahamas)":        (26.53, -78.70),
}

MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July",
               "August", "September", "October", "November", "December"]

app = FastAPI(title="AgriLink API", version="1.0")

# Allow the frontend (and judges) to call the API from anywhere.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# A shared client keeps connections to Open-Meteo fast.
client = httpx.AsyncClient(timeout=15)


# ---- rate limiting (dependency-free, per-IP sliding window) ----------
# /api/farm-data and /api/recommend each trigger ~11 upstream Open-Meteo
# calls, so they're capped hard; cheap local-data endpoints get a wide cap.
RATE_RULES = [
    ("/api/farm-data", 10, 60),   # 10 requests / minute / IP
    ("/api/recommend", 10, 60),   # 10 requests / minute / IP
    ("/api/",           60, 60),   # everything else on the API
]


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.hits = defaultdict(deque)  # {(ip, rule): deque[timestamps]}

    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        rule = next(((r, limit, secs) for r, limit, secs in RATE_RULES if path.startswith(r)), None)
        if rule is None:
            return await call_next(request)  # static frontend, never blocked

        _, limit, window = rule
        ip = request.client.host if request.client else "unknown"
        key = (ip, rule[0])
        now = time.monotonic()

        hits = self.hits[key]
        while hits and hits[0] <= now - window:
            hits.popleft()  # slide the window

        if len(hits) >= limit:
            retry_after = max(1, int(hits[0] + window - now))
            return JSONResponse(
                {"detail": f"Too many requests, try again in {retry_after}s."},
                status_code=429,
                headers={"Retry-After": str(retry_after)},
            )

        hits.append(now)
        remaining = limit - len(hits)
        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(limit)
        response.headers["X-RateLimit-Remaining"] = str(max(0, remaining))
        response.headers["X-RateLimit-Reset"] = str(int(window))
        return response


app.add_middleware(RateLimitMiddleware)


# ---- upstream cache: one fetch per parish per 10 minutes max ---------
# farm-data costs ~11 Open-Meteo calls; the cache means heavy traffic
# never translates into heavy upstream usage (and farmers get instant loads).
FARM_CACHE = {}
FARM_CACHE_TTL = 600  # seconds


# ---- helpers ---------------------------------------------------------

def get_coords(parish: str) -> tuple[float, float]:
    coords = PARISHES.get(parish)
    if not coords:
        raise HTTPException(status_code=404, detail=f"Unknown parish: {parish}")
    return coords


# ---- API endpoints ---------------------------------------------------

@app.get("/api/parishes")
async def list_parishes():
    """All parishes AgriLink supports, with map coordinates."""
    return [{"name": name, "lat": lat, "lon": lon} for name, (lat, lon) in PARISHES.items()]


@app.get("/api/farm-data/{parish}")
async def farm_data(parish: str):
    """Live 7-day forecast + 10-year climate history for one parish."""
    lat, lon = get_coords(parish)
    now = datetime.now()
    month_index = now.month - 1

    # serve from the 10-minute cache when we have it
    cached = FARM_CACHE.get(parish)
    if cached and time.monotonic() - cached[0] < FARM_CACHE_TTL:
        return cached[1]

    # --- live forecast (next 7 days) ---
    forecast_url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum"
        "&forecast_days=7&timezone=auto"
    )
    forecast_response = await client.get(forecast_url)
    if forecast_response.status_code != 200:
        raise HTTPException(status_code=502, detail="Weather service unavailable")
    daily = forecast_response.json()["daily"]
    temp = round((daily["temperature_2m_max"][0] + daily["temperature_2m_min"][0]) / 2)
    rain7 = round(sum(daily["precipitation_sum"]))
    daily_list = [
        {"rain": round(p), "tmax": round(t)}
        for p, t in zip(daily["precipitation_sum"], daily["temperature_2m_max"])
    ]

    # --- 10-year climate history (same month, previous 10 years) ---
    import datetime as dt
    climate_years = []
    for offset in range(1, 11):
        year = now.year - offset
        start = dt.date(year, month_index + 1, 1)
        end = (dt.date(year, month_index + 2, 1) - dt.timedelta(days=1))
        archive_url = (
            f"https://archive-api.open-meteo.com/v1/archive"
            f"?latitude={lat}&longitude={lon}"
            f"&start_date={start}&end_date={end}"
            "&daily=precipitation_sum&timezone=auto"
        )
        archive_response = await client.get(archive_url)
        if archive_response.status_code == 200:
            days = archive_response.json()["daily"]["precipitation_sum"]
            climate_years.append(sum(d or 0 for d in days))

    climate = None
    if climate_years:
        climate = {
            "month": MONTH_NAMES[month_index],
            "avg_rain": round(sum(climate_years) / len(climate_years)),
            "years_used": len(climate_years),
        }

    result = {
        "parish": parish,
        "forecast": {"temp": temp, "rain_7d": rain7, "rain_3d": [round(p) for p in daily["precipitation_sum"][:3]], "daily": daily_list, "live": True},
        "climate": climate,
    }
    FARM_CACHE[parish] = (time.monotonic(), result)
    return result


@app.get("/api/crops")
async def list_crops():
    """Crop names + planting windows + growth stages."""
    from backend.crops import CROPS
    return CROPS


@app.get("/api/problems")
async def list_problems():
    """Our dataset of common crop problems (used by the photo checker)."""
    from backend.problems import PROBLEMS
    return PROBLEMS


@app.get("/api/recommend/{parish}")
async def recommend(parish: str, crop: str = Query(..., description="Crop name, e.g. Corn")):
    """Full planting recommendation for one crop in one parish."""
    from backend.crops import CROPS
    from backend.recommend import recommend_crop

    crop_data = next((c for c in CROPS if c["name"].lower() == crop.lower()), None)
    if not crop_data:
        raise HTTPException(status_code=404, detail=f"Unknown crop: {crop}")

    farm = await farm_data(parish)
    result = recommend_crop(crop_data, farm["forecast"], farm["climate"])
    result["crop"] = crop_data["name"]
    result["parish"] = parish
    return result


# ---- serve the frontend (single-command launch!) --------------------
frontend_dir = Path(__file__).resolve().parent.parent
app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
