
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

# ---- Regions by country: Jamaica's 14 parishes plus the parishes, districts
#      and departments of the 13 other Caribbean countries AgriLink covers.
#      Same data as the frontend in js/app.js (rough map coordinates). ----
LOCATIONS = {
    "Jamaica": {
        "Kingston":      (17.97, -76.78),
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
    },
    "Antigua & Barbuda": {
        "Saint John":    (17.12, -61.83),
        "Saint Mary":    (17.05, -61.85),
        "Saint Paul":    (17.05, -61.75),
        "Saint Peter":   (17.10, -61.73),
        "Saint Philip":  (17.10, -61.66),
        "Saint George":  (17.15, -61.68),
        "Barbuda":       (17.62, -61.81),
    },
    "Bahamas": {
        "New Providence": (25.08, -77.35),
        "Grand Bahama":   (26.53, -78.70),
        "Abaco":          (26.54, -77.04),
        "Andros":         (25.18, -78.01),
        "Eleuthera":      (25.19, -76.25),
        "Exuma":          (23.49, -75.77),
    },
    "Barbados": {
        "Saint Lucy":    (13.30, -59.64),
        "Saint Peter":   (13.26, -59.63),
        "Saint James":   (13.22, -59.62),
        "Saint Andrew":  (13.27, -59.56),
        "Saint Joseph":  (13.22, -59.56),
        "Saint Thomas":  (13.19, -59.58),
        "Saint John":    (13.20, -59.50),
        "Saint George":  (13.17, -59.56),
        "Saint Michael": (13.13, -59.61),
        "Saint Philip":  (13.15, -59.49),
        "Christ Church": (13.06, -59.53),
    },
    "Belize": {
        "Belize District": (17.50, -88.20),
        "Cayo":            (17.25, -88.77),
        "Corozal":         (18.00, -88.39),
        "Orange Walk":     (17.82, -88.56),
        "Stann Creek":     (16.97, -88.23),
        "Toledo":          (15.81, -88.85),
    },
    "Dominica": {
        "Saint Andrew":  (15.56, -61.28),
        "Saint David":   (15.44, -61.26),
        "Saint George":  (15.30, -61.39),
        "Saint John":    (15.58, -61.44),
        "Saint Joseph":  (15.47, -61.42),
        "Saint Luke":    (15.25, -61.38),
        "Saint Mark":    (15.22, -61.39),
        "Saint Patrick": (15.32, -61.27),
        "Saint Paul":    (15.41, -61.41),
        "Saint Peter":   (15.52, -61.43),
    },
    "Grenada": {
        "Saint George":  (12.05, -61.74),
        "Saint Andrew":  (12.28, -61.62),
        "Saint David":   (12.14, -61.60),
        "Saint John":    (12.14, -61.69),
        "Saint Mark":    (12.20, -61.70),
        "Saint Patrick": (12.32, -61.66),
    },
    "Guyana": {
        "Demerara-Mahaica":      (6.80, -58.16),
        "Pomeroon-Supenaam":     (7.27, -58.52),
        "Essequibo-W. Demerara": (6.79, -58.42),
        "Mahaica-Berbice":       (6.47, -57.82),
        "E. Berbice-Corentyne":  (6.25, -57.53),
        "Upper Demerara-Berbice": (6.00, -58.30),
        "Barima-Waini":          (8.25, -59.60),
    },
    "Haiti": {
        "Ouest":      (18.54, -72.34),
        "Artibonite": (19.45, -72.68),
        "Nord":       (19.76, -72.20),
        "Nord-Est":   (19.67, -72.19),
        "Nord-Ouest": (19.94, -72.83),
        "Sud":        (18.19, -73.75),
        "Sud-Est":    (18.23, -72.53),
        "Grand'Anse": (18.65, -74.12),
        "Centre":     (19.15, -72.02),
        "Nippes":     (18.44, -73.08),
    },
    "Dominican Republic": {
        "Distrito Nacional": (18.49, -69.90),
        "Azua":              (18.46, -70.73),
        "La Vega":           (19.22, -70.53),
        "Puerto Plata":      (19.79, -70.71),
        "Santiago":          (19.45, -70.70),
        "San Cristóbal":     (18.42, -70.11),
        "San Juan":          (18.81, -70.72),
        "Peravia":           (18.28, -70.33),
        "La Altagracia":     (18.62, -68.71),
        "Duarte":            (19.30, -70.25),
        "La Romana":         (18.43, -68.96),
    },
    "St. Kitts & Nevis": {
        "Christ Church Nichola Town": (17.30, -62.72),
        "Saint Anne Sandy Point":     (17.34, -62.78),
        "Saint George Basseterre":    (17.29, -62.73),
        "Saint John Capisterre":      (17.37, -62.79),
        "Saint Mary Cayon":           (17.31, -62.76),
        "Saint Paul Capisterre":      (17.40, -62.83),
        "Saint Peter Basseterre":     (17.31, -62.68),
        "Trinity Palmetto Point":     (17.29, -62.78),
        "Saint George Gingerland":    (17.14, -62.59),
        "Saint James Windward":       (17.18, -62.55),
        "Saint John Figtree":         (17.14, -62.66),
        "Saint Paul Charlestown":     (17.14, -62.63),
        "Saint Thomas Lowland":       (17.17, -62.64),
    },
    "St. Lucia": {
        "Castries":    (14.01, -60.99),
        "Anse la Raye": (13.92, -61.03),
        "Canaries":    (13.91, -61.07),
        "Choiseul":    (13.76, -61.04),
        "Dennery":     (13.92, -60.92),
        "Gros Islet":  (14.08, -60.94),
        "Laborie":     (13.75, -60.99),
        "Micoud":      (13.82, -60.90),
        "Soufrière":   (13.86, -61.06),
        "Vieux Fort":  (13.72, -60.95),
    },
    "St. Vincent & the Grenadines": {
        "Saint George":  (13.16, -61.22),
        "Saint Andrew":  (13.23, -61.20),
        "Saint David":   (13.21, -61.15),
        "Saint Patrick": (13.27, -61.25),
        "Charlotte":     (13.29, -61.14),
        "Grenadines":    (12.60, -61.43),
    },
    "Trinidad & Tobago": {
        "Port of Spain": (10.65, -61.50),
        "San Fernando":  (10.28, -61.46),
        "Chaguanas":     (10.52, -61.39),
        "Arima":         (10.64, -61.28),
        "Couva":         (10.42, -61.32),
        "Sangre Grande": (10.59, -61.13),
        "Princes Town":  (10.27, -61.36),
        "Penal–Debe":    (10.16, -61.45),
        "Tobago":        (11.19, -60.73),
    },
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

FARM_CACHE = {}
FARM_CACHE_TTL = 600  # seconds


# ---- helpers ---------------------------------------------------------

def get_coords(country: str, region: str) -> tuple[float, float]:
    country_map = LOCATIONS.get(country)
    coords = country_map.get(region) if country_map else None
    if not coords:
        raise HTTPException(status_code=404, detail=f"Unknown region: {region}, {country}")
    return coords


def get_coords_by_name(parish: str) -> tuple[str, str]:
    """Old one-segment lookups: search countries in order, first match wins."""
    for country, regions in LOCATIONS.items():
        if parish in regions:
            return country, parish
    raise HTTPException(status_code=404, detail=f"Unknown parish: {parish}")


def location_label(country: str, region: str) -> str:
    return f"{region}, {country}" if country in LOCATIONS else region


# ---- API endpoints ---------------------------------------------------

@app.get("/api/parishes")
async def list_parishes():
    """Every region AgriLink supports, grouped by country, with coordinates."""
    return [
        {"country": country, "name": name, "lat": lat, "lon": lon}
        for country, regions in LOCATIONS.items()
        for name, (lat, lon) in regions.items()
    ]


async def farm_data_impl(country: str, region: str):
    """Live 7-day forecast + 10-year climate history for one region."""
    lat, lon = get_coords(country, region)
    label = location_label(country, region)
    now = datetime.now()
    month_index = now.month - 1

    # serve from the 10-minute cache when we have it
    cached = FARM_CACHE.get(label)
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
        "country": country,
        "parish": region,
        "location": label,
        "forecast": {"temp": temp, "rain_7d": rain7, "rain_3d": [round(p) for p in daily["precipitation_sum"][:3]], "daily": daily_list, "live": True},
        "climate": climate,
    }
    FARM_CACHE[label] = (time.monotonic(), result)
    return result


@app.get("/api/farm-data/{country}/{region}")
async def farm_data(country: str, region: str):
    return await farm_data_impl(country, region)


@app.get("/api/farm-data/{parish}")
async def farm_data_legacy(parish: str):
    """Old Jamaica-style single-name route, kept working."""
    country, region = get_coords_by_name(parish)
    return await farm_data_impl(country, region)


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


async def recommend_impl(country: str, region: str, crop: str):
    """Full planting recommendation for one crop in one region."""
    from backend.crops import CROPS
    from backend.recommend import recommend_crop

    crop_data = next((c for c in CROPS if c["name"].lower() == crop.lower()), None)
    if not crop_data:
        raise HTTPException(status_code=404, detail=f"Unknown crop: {crop}")

    farm = await farm_data_impl(country, region)
    result = recommend_crop(crop_data, farm["forecast"], farm["climate"])
    result["crop"] = crop_data["name"]
    result["parish"] = region
    result["location"] = location_label(country, region)
    return result


@app.get("/api/recommend/{country}/{region}")
async def recommend(country: str, region: str, crop: str = Query(..., description="Crop name, e.g. Corn")):
    return await recommend_impl(country, region, crop)


@app.get("/api/recommend/{parish}")
async def recommend_legacy(parish: str, crop: str = Query(..., description="Crop name, e.g. Corn")):
    """Old Jamaica-style single-name route, kept working."""
    country, region = get_coords_by_name(parish)
    return await recommend_impl(country, region, crop)


# ---- serve the frontend (single-command launch!) --------------------
# The frontend lives outside this repo; when its files sit next to the
# backend folder, the same command serves the whole app.
frontend_dir = Path(__file__).resolve().parent.parent
if (frontend_dir / "index.html").exists():
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
