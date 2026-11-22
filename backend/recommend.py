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
                      "text": f"{MONTH_NAMES[month - 1]} is a strong planting month for {crop['name'].lower()} here."})
    else:
        for offset in range(1, 13):
            check = (month + offset - 1) % 12 + 1
            if check in crop["bestMonths"]:
                facts.append({"mark": "!", "cls": "warn",
                              "text": f"The next planting window opens in {MONTH_NAMES[check - 1]}, about {offset} month(s) away."})
                break

    # ---- 2. parish climate history ----
    climate_rain = climate["avg_rain"] if climate else 60
    climate_label = (f"Ten-year average for {MONTH_NAMES[month - 1]} in your parish: {climate_rain} mm"
                     if climate else "Ten-year average unavailable, using typical values.")
    if climate_rain < 15:
        score -= 10
        facts.append({"mark": "-", "cls": "bad", "text": climate_label + ". The month is usually dry, so plan to irrigate."})
    elif climate_rain > 250:
        score -= 10
        facts.append({"mark": "-", "cls": "bad", "text": climate_label + ". The month is usually wet; drainage matters."})
    else:
        score += 10
        facts.append({"mark": "+", "cls": "good", "text": climate_label + ". Moisture is usually workable."})

    # ---- 3. live forecast ----
    rain = forecast["rain_7d"]
    temp = forecast["temp"]
    if rain < 5:
        score -= 15
        facts.append({"mark": "-", "cls": "bad",
                      "text": f"Only {rain} mm of rain forecast this week. Irrigate or wait for showers."})
    elif rain > 80:
        score -= 20
        facts.append({"mark": "-", "cls": "bad",
                      "text": f"{rain} mm of rain forecast this week. Check drainage before planting."})
    else:
        score += 15
        facts.append({"mark": "+", "cls": "good",
                      "text": f"{rain} mm of rain forecast this week. Enough to start seed."})

    if temp < 18 or temp > 33:
        score -= 10
        facts.append({"mark": "-", "cls": "bad",
                      "text": f"{temp}°C is outside this crop's usual range."})
    else:
        score += 5
        facts.append({"mark": "+", "cls": "good",
                      "text": f"{temp}°C is in the normal growing range."})

    score = max(10, min(95, round(score)))
    if score >= 70:
        verdict, cls = "Good planting window", "good"
    elif score >= 50:
        verdict, cls = "Tight window, watch the rain", "warn"
    else:
        verdict, cls = "Wait for a better window", "bad"

    return {
        "score": score,
        "verdict": verdict,
        "cls": cls,
        "facts": facts,
        "forecast": {"temp": temp, "rain_7d": rain},
        "climate_rain": climate_rain,
        "best_months": [MONTH_NAMES[m - 1] for m in crop["bestMonths"]],
    }
