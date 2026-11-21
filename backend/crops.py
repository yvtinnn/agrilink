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
]
