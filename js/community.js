/* ============================================================
   community.js — the peer-to-peer farmer chat.
   Messages from other farmers are saved in the browser
   (localStorage) so the conversation keeps growing.
============================================================ */

// Seed messages: realistic farmer conversations so the community
// feels alive the first time anyone opens the app.
const SEED_POSTS = [
  {
    name: "Miss Pauline",
    region: "St. Elizabeth",
    text: "Good morning all! Anyone else seeing army worm on their callaloo this week?",
    time: "2 days ago",
  },
  {
    name: "Farmer Ray",
    region: "Clarendon",
    text: "Try spraying the leaves early morning before the sun gets hot. Worked for me last season.",
    time: "2 days ago",
  },
  {
    name: "Junior B",
    region: "St. Mary",
    text: "My tomato seedlings are ready for transplant but rain is coming Thursday. Should I wait?",
    time: "1 day ago",
  },
  {
    name: "Miss Pauline",
    region: "St. Elizabeth",
    text: "Junior, light rain right after transplant actually helps them settle in. Just don't plant in standing water!",
    time: "20 hours ago",
  },
  {
    name: "Auntie Vee",
    region: "Westmoreland",
    text: "Reminder: scotch bonnet prices going up at the market next month. Get your plants in early!",
    time: "5 hours ago",
  },
];

// Get saved posts, or create them from the seeds above.
function loadPosts() {
  const saved = localStorage.getItem("agrilink-posts");
  if (saved) return JSON.parse(saved);
  localStorage.setItem("agrilink-posts", JSON.stringify(SEED_POSTS));
  return SEED_POSTS;
}

function savePosts(posts) {
  localStorage.setItem("agrilink-posts", JSON.stringify(posts));
}

// Draw all messages on the screen, with a round initial avatar.
function renderChat() {
  const feed = document.getElementById("chat-feed");
  const posts = loadPosts();
  const myName = localStorage.getItem("agrilink-name") || "";

  feed.innerHTML = "";
  for (const post of posts) {
    const div = document.createElement("div");
    const isMine = post.name === myName && myName !== "";
    div.className = "msg " + (isMine ? "mine" : "other");

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = post.name.charAt(0).toUpperCase();

    const bubble = document.createElement("div");
    bubble.className = "bubble";

    const who = document.createElement("div");
    who.className = "who";
    who.textContent = post.name + (post.region ? " · " + post.region : "");

    const text = document.createElement("div");
    text.textContent = post.text;

    const when = document.createElement("div");
    when.className = "when";
    when.textContent = post.time + (post.helpful ? ` · ${post.helpful} found this helpful` : "");

    bubble.append(who, text, when);

    // "Helpful" reaction — thanks a farmer for good advice.
    // The button lives inside MY view only (it's a local demo app).
    const helpful = document.createElement("button");
    helpful.type = "button";
    helpful.className = "helpful" + (post.iHelped ? " did" : "");
    helpful.textContent = post.iHelped ? "You found this helpful" : "Helpful";
    helpful.addEventListener("click", () => {
      const posts = loadPosts();
      const target = posts.find((x) => x === post);
      if (target.iHelped) { target.iHelped = false; target.helpful = (target.helpful || 1) - 1; }
      else { target.iHelped = true; target.helpful = (target.helpful || 0) + 1; }
      savePosts(posts);
      renderChat();
    });
    bubble.appendChild(helpful);

    div.append(avatar, bubble);
    feed.appendChild(div);
  }
  feed.scrollTop = feed.scrollHeight; // scroll to newest message
}

// Send a new message.
function sendMessage(name, text) {
  const posts = loadPosts();
  posts.push({
    name: name || "Anonymous Farmer",
    region: localStorage.getItem("agrilink-region") || localStorage.getItem("agrilink-parish") || "",
    text: text,
    time: "just now",
  });
  savePosts(posts);
  renderChat();
}

// ---- Market watch ----------------------------------------------------
// Indicative wholesale prices (J$) at Coronation Market. The base prices
// are realistic samples; a small deterministic wobble (seeded by the date)
// makes them move a little day to day. Honestly labelled as sample data.
const MARKET_SEED = [
  { crop: "Tomato",        unit: "lb", price: 180 },
  { crop: "Scotch Bonnet", unit: "lb", price: 250 },
  { crop: "Sweet Pepper",  unit: "lb", price: 200 },
  { crop: "Callaloo",      unit: "lb", price: 80  },
  { crop: "Cabbage",       unit: "lb", price: 90  },
  { crop: "Okra",          unit: "lb", price: 150 },
  { crop: "Carrot",        unit: "lb", price: 130 },
  { crop: "Onion",         unit: "lb", price: 140 },
  { crop: "Sweet Potato",  unit: "lb", price: 90  },
  { crop: "Pumpkin",       unit: "lb", price: 60  },
];

function renderMarket() {
  const box = document.getElementById("market-list");
  if (!box) return;

  // a stable pseudo-random number from the day of the year — the board
  // looks alive but doesn't jump around every time you open the app
  const now = new Date();
  const dayIndex = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  const seeded = (i, salt) => {
    const x = Math.sin(dayIndex * 12.9898 + i * 78.233 + salt * 3.7) * 43758.5453;
    return x - Math.floor(x); // 0..1
  };

  box.innerHTML = "";
  MARKET_SEED.forEach((item, i) => {
    // ±8% drift from the base price, plus a week-over-week change
    const price = Math.round(item.price * (1 + (seeded(i, 1) - 0.5) * 0.16));
    const change = Math.round((seeded(i, 2) - 0.42) * 20); // -8..+12%
    const dir = change > 0 ? "up" : change < 0 ? "down" : "flat";

    const row = document.createElement("div");
    row.className = "market-row";
    row.innerHTML =
      `<span class="market-crop">${item.crop}</span>` +
      `<span class="market-unit">${item.unit}</span>` +
      `<span class="market-price">J$ ${price}</span>` +
      `<span class="market-change ${dir}">${change > 0 ? "▲" : change < 0 ? "▼" : "–"} ${Math.abs(change)}%</span>`;
    box.appendChild(row);
  });
}

renderMarket();
