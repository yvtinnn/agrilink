# ============================================================
# crops.py — the AgriLink crop database (mirrors js/planner.js).
# bestMonths: 1 = January ... 12 = December (Jamaica climate).
# stages: growth stages and how many days each one takes.
# ============================================================

CROPS = [
    {
        "name": "Tomato",
        "bestMonths": [1, 2, 8, 9, 10],
        "stages": [
            {"name": "Germination", "days": 6, "tip": "Keep soil moist but not soaked."},
            {"name": "Seedling", "days": 20, "tip": "Transplant after 4-5 true leaves appear."},
            {"name": "Vegetative", "days": 25, "tip": "Stake the plants now — they grow fast."},
            {"name": "Flowering", "days": 20, "tip": "Water regularly; dry spells cause flower drop."},
            {"name": "Fruiting", "days": 25, "tip": "Watch for pests — check leaves weekly."},
            {"name": "Harvest", "days": 14, "tip": "Pick when colour is 70-80% developed."},
        ],
    },
    {
        "name": "Cabbage",
        "bestMonths": [9, 10, 11, 12, 1],
        "stages": [
            {"name": "Germination", "days": 5, "tip": "Sow in a nursery bed first."},
            {"name": "Seedling", "days": 25, "tip": "Transplant when about 10 cm tall."},
            {"name": "Vegetative", "days": 30, "tip": "Keep weeds down — cabbage hates competition."},
            {"name": "Heading", "days": 25, "tip": "Even watering now makes tight heads."},
            {"name": "Harvest", "days": 10, "tip": "Cut when heads are firm to the squeeze."},
        ],
    },
    {
        "name": "Scotch Bonnet",
        "bestMonths": [2, 3, 4, 8, 9],
        "stages": [
            {"name": "Germination", "days": 12, "tip": "Peppers sprout slowly — be patient."},
            {"name": "Seedling", "days": 30, "tip": "Keep seedlings warm and lightly shaded."},
            {"name": "Vegetative", "days": 35, "tip": "Space plants 60 cm apart — they get bushy."},
            {"name": "Flowering", "days": 25, "tip": "Don't over-fertilise or you'll get leaves, not peppers."},
            {"name": "Fruiting", "days": 30, "tip": "Green scotch bonnets are already hot — pick when needed."},
            {"name": "Harvest", "days": 20, "tip": "One plant can produce for months."},
        ],
    },
    {
        "name": "Corn",
        "bestMonths": [4, 5, 9, 10],
        "stages": [
            {"name": "Germination", "days": 5, "tip": "Plant 2-3 cm deep, 25 cm apart."},
            {"name": "Seedling", "days": 15, "tip": "Thin to the strongest plant per hole."},
            {"name": "Vegetative", "days": 40, "tip": "This is when corn needs the most water."},
            {"name": "Tasseling", "days": 10, "tip": "Pollination happens now — avoid drought stress."},
            {"name": "Grain Fill", "days": 30, "tip": "Brown silks mean cobs are filling nicely."},
            {"name": "Harvest", "days": 10, "tip": "Kernels should be milky when pressed."},
        ],
    },
    {
        "name": "Okra",
        "bestMonths": [3, 4, 5, 6],
        "stages": [
            {"name": "Germination", "days": 7, "tip": "Soak seeds overnight for faster sprouting."},
            {"name": "Vegetative", "days": 30, "tip": "Okra loves heat — no shade needed."},
            {"name": "Flowering", "days": 15, "tip": "Flowers open for one day only."},
            {"name": "Pods", "days": 15, "tip": "Pick pods young, every 2 days."},
            {"name": "Harvest", "days": 30, "tip": "Regular picking keeps the plant producing."},
        ],
    },
    {
        "name": "Callaloo",
        "bestMonths": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        "stages": [
            {"name": "Germination", "days": 4, "tip": "Broadcast seeds thinly and cover lightly."},
            {"name": "Vegetative", "days": 25, "tip": "Callaloo grows fast — weed early."},
            {"name": "First Cut", "days": 10, "tip": "Cut 15 cm above ground so it regrows."},
            {"name": "Regrowth", "days": 15, "tip": "You can harvest the same patch 3-4 times."},
            {"name": "Harvest", "days": 1, "tip": "Sell fresh — callaloo wilts fast in the sun."},
        ],
    },
    {
        "name": "Pumpkin",
        "bestMonths": [9, 10, 11],
        "stages": [
            {"name": "Germination", "days": 6, "tip": "Plant on hills, 3 seeds per hole."},
            {"name": "Vining", "days": 35, "tip": "Vines spread over 3 m — give them room."},
            {"name": "Flowering", "days": 15, "tip": "Male flowers open first — that's normal."},
            {"name": "Fruiting", "days": 35, "tip": "Put straw under fruit to prevent rot."},
            {"name": "Harvest", "days": 15, "tip": "Ready when the stem is woody and hard."},
        ],
    },
    {
        "name": "Sweet Potato",
        "bestMonths": [3, 4, 10, 11],
        "stages": [
            {"name": "Rooting", "days": 10, "tip": "Plant vine cuttings 20 cm deep."},
            {"name": "Vining", "days": 40, "tip": "Redirect vines back into the row."},
            {"name": "Tuber Growth", "days": 50, "tip": "Stop watering 2 weeks before harvest."},
            {"name": "Harvest", "days": 15, "tip": "Cure in the sun 3 days for sweeter taste."},
        ],
    },
    {
        "name": "Carrot",
        "bestMonths": [9, 10, 11, 12, 1],
        "stages": [
            {"name": "Germination", "days": 10, "tip": "Carrot seeds are tiny — mix with sand to sow evenly."},
            {"name": "Seedling", "days": 25, "tip": "Thin to 5 cm apart — crowded carrots make no roots."},
            {"name": "Vegetative", "days": 40, "tip": "Keep the soil loose and weed-free; rocks fork the roots."},
            {"name": "Root Growth", "days": 30, "tip": "Hill soil over any shoulders poking out — green tops taste bitter."},
            {"name": "Harvest", "days": 15, "tip": "Pull when tops are 2 cm wide at the soil line."},
        ],
    },
    {
        "name": "Lettuce",
        "bestMonths": [10, 11, 12, 1, 2],
        "stages": [
            {"name": "Germination", "days": 4, "tip": "Sow shallow — lettuce seed needs some light to sprout."},
            {"name": "Seedling", "days": 20, "tip": "Shade seedlings; full sun makes them bitter."},
            {"name": "Vegetative", "days": 25, "tip": "Water little and often — lettuce is mostly water."},
            {"name": "Heading", "days": 20, "tip": "Even moisture now prevents bitter, loose heads."},
            {"name": "Harvest", "days": 8, "tip": "Cut early morning and cool immediately."},
        ],
    },
    {
        "name": "Onion",
        "bestMonths": [10, 11, 12],
        "stages": [
            {"name": "Germination", "days": 8, "tip": "Start in a nursery bed — onion seedlings are slow."},
            {"name": "Seedling", "days": 30, "tip": "Transplant when pencil-thick, 10 cm apart."},
            {"name": "Vegetative", "days": 45, "tip": "Onions hate weeds — their leaves can't shade them out."},
            {"name": "Bulbing", "days": 30, "tip": "Bulbing is triggered by day length — don't panic if growth stalls."},
            {"name": "Harvest", "days": 15, "tip": "Wait until the tops fall over on their own, then cure in the sun."},
        ],
    },
    {
        "name": "Sweet Pepper",
        "bestMonths": [2, 3, 4, 8, 9],
        "stages": [
            {"name": "Germination", "days": 10, "tip": "Same as scotch bonnet — warm soil, be patient."},
            {"name": "Seedling", "days": 30, "tip": "Transplant when 15 cm tall, 45 cm apart."},
            {"name": "Vegetative", "days": 35, "tip": "Stake early — fruits get heavy and snap branches."},
            {"name": "Flowering", "days": 20, "tip": "Pick the FIRST few fruits green to push more flowering."},
            {"name": "Fruiting", "days": 30, "tip": "Red peppers are just ripe green ones — price differs, so plan."},
            {"name": "Harvest", "days": 25, "tip": "Pick every 3-4 days and plants keep producing."},
        ],
    },
    {
        "name": "Cucumber",
        "bestMonths": [2, 3, 4, 9, 10],
        "stages": [
            {"name": "Germination", "days": 5, "tip": "Plant on hills like pumpkin, 2 seeds per hole."},
            {"name": "Seedling", "days": 12, "tip": "Thin to the stronger seedling per hill."},
            {"name": "Vining", "days": 25, "tip": "Trellising keeps fruit straight and clean."},
            {"name": "Flowering", "days": 12, "tip": "Pick a few male flowers if plants are all vine, no fruit."},
            {"name": "Fruiting", "days": 20, "tip": "Cucumbers grow fast — check plants every 2 days."},
            {"name": "Harvest", "days": 25, "tip": "Pick young; overgrown cucumbers turn the plant off."},
        ],
    },
    {
        "name": "Beet",
        "bestMonths": [10, 11, 12, 1],
        "stages": [
            {"name": "Germination", "days": 7, "tip": "Each 'seed' is a cluster — thin to one plant per spot."},
            {"name": "Seedling", "days": 20, "tip": "Thinnings are edible baby beets and greens — nothing wasted."},
            {"name": "Vegetative", "days": 30, "tip": "Keep the soil loose; beets swell better in soft ground."},
            {"name": "Root Growth", "days": 30, "tip": "Boron shortage makes black spots inside — a pinch of borax helps."},
            {"name": "Harvest", "days": 12, "tip": "Twist the tops off when pulling — cutting makes them 'bleed'."},
        ],
    },
]
