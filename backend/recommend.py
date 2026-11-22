# ============================================================
# recommend.py, the planting scoring rules (server-side copy of
# the logic in js/planner.js so both agree with each other).
# ============================================================

from datetime import datetime

MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July",
               "August", "September", "October", "November", "December"]


def recommend_crop(crop: dict, forecast: dict, climate: dict | None) -> dict:
    """Score how good right now is for planting this crop.

    Three transparent signals:
      1. season , is it one of the crop's best months?
      2. climate, 10-year average rainfall for this month, this parish
      3. forecast live 7-day rain and temperature
    """
    month = datetime.now().month
    score = 35
    facts = []

    # ---- 1. seasonal window ----
    if month in crop["bestMonths"]:
        score += 40
        facts.append({"mark": "+", "cls": "good",
                      "text": f"{MONTH_NAMES[month - 1]} is historically a strong month to plant {crop['name'].lower()} in Jamaica."})
    else:
        for offset in range(1, 13):
            check = (month + offset - 1) % 12 + 1
            if check in crop["bestMonths"]:
                facts.append({"mark": "!", "cls": "warn",
                              "text": f"The usual window opens in {MONTH_NAMES[check - 1]} (about {offset} month(s) away)."})
                break

    # ---- 2. parish climate history ----
    climate_rain = climate["avg_rain"] if climate else 60
    climate_label = (f"10-year average for this parish in {MONTH_NAMES[month - 1]}: {climate_rain} mm"
                     if climate else "10-year average unavailable, using typical values.")
    if climate_rain < 15:
        score -= 10
        facts.append({"mark": "-", "cls": "bad", "text": climate_label + ", historically dry. Irrigation needed."})
    elif climate_rain > 250:
        score -= 10
        facts.append({"mark": "-", "cls": "bad", "text": climate_label + ", historically very wet. Waterlogging risk."})
    else:
        score += 10
        facts.append({"mark": "+", "cls": "good", "text": climate_label + ", comfortable moisture."})

    # ---- 3. live forecast ----
    rain = forecast["rain_7d"]
    temp = forecast["temp"]
    if rain < 5:
        score -= 15
        facts.append({"mark": "-", "cls": "bad",
                      "text": f"Live forecast: only {rain} mm rain this week. Irrigate or wait."})
    elif rain > 80:
        score -= 20
        facts.append({"mark": "-", "cls": "bad",
                      "text": f"Live forecast: heavy rain this week ({rain} mm). Waterlogging risk, drainage needed."})
    else:
        score += 15
        facts.append({"mark": "+", "cls": "good",
                      "text": f"Live forecast: {rain} mm rain this week, good moisture for germination."})

    if temp < 18 or temp > 33:
        score -= 10
        facts.append({"mark": "-", "cls": "bad",
                      "text": f"Temperatures around {temp}°C are outside this crop's comfort zone."})
    else:
        score += 5
        facts.append({"mark": "+", "cls": "good",
                      "text": f"Temperatures around {temp}°C are in the normal growing range."})

    score = max(10, min(95, round(score)))
    if score >= 70:
        verdict, cls = "Great time to plant", "good"
    elif score >= 50:
        verdict, cls = "Possible, plan carefully", "warn"
    else:
        verdict, cls = "Better to wait", "bad"

    return {
        "score": score,
        "verdict": verdict,
        "cls": cls,
        "facts": facts,
        "forecast": {"temp": temp, "rain_7d": rain},
        "climate_rain": climate_rain,
        "best_months": [MONTH_NAMES[m - 1] for m in crop["bestMonths"]],
    }
