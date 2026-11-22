/* ============================================================
   community.js, the farmer community: chat, market watch.

   Two modes:
   LIVE mode: a free Firebase Realtime Database (see
     js/firebase-config.js). Every phone with the app sees the same
     chat, live, as messages arrive.
   LOCAL mode (default until a config is pasted): messages stay on
     this phone and demo farmers keep the feed alive.
============================================================ */

// ---- live mode: Firebase Realtime Database ---------------------------
// Set up by js/firebase-config.js. Until that file holds a real config,
// the app stays in local mode and nothing here is ever contacted.
let liveMode = false;
let LIVE_CHAT = [];      // chat messages from Firebase, oldest first
let LIVE_REPORTS = null; // problem-board reports from Firebase, newest first

(function initCommunity() {
  try {
    const cfg = typeof FIREBASE_CONFIG === "undefined" ? null : FIREBASE_CONFIG;
    // the Realtime Database needs a real databaseURL + projectId; apiKey is
    // only required if you later add Auth or Firestore
    const configured = cfg && cfg.databaseURL
      && !String(cfg.databaseURL).includes("YOUR_PROJECT")
      && cfg.projectId && !String(cfg.projectId).includes("YOUR_PROJECT");
    if (typeof firebase !== "undefined" && configured) {
      firebase.initializeApp(cfg);
      const db = firebase.database();

      // chat: keep the last 80 messages in sync, live
      db.ref("chat").limitToLast(80).on("value", (snap) => {
        const val = snap.val();
        LIVE_CHAT = val ? Object.entries(val).map(([key, post]) => ({ ...post, _key: key })) : [];
        renderChat();
      }, () => communityOffline());

      // problem board: live (problems.js renders whatever this provides)
      db.ref("reports").limitToLast(80).on("value", (snap) => {
        const val = snap.val();
        LIVE_REPORTS = val
          ? Object.entries(val).map(([key, report]) => ({ ...report, _key: key })).reverse()
          : [];
        renderReports();
      }, () => communityOffline());

      liveMode = true;
    }
  } catch { liveMode = false; } // no config, or blocked: local mode it is
})();

// Firebase broke mid-session (bad rules, no signal): fall back to local
// data so the screen is never empty.
function communityOffline() {
  liveMode = false;
  if (typeof showToast === "function") showToast("Community offline: showing messages saved on this phone");
  renderChat();
  if (typeof renderReports === "function") renderReports();
}

// which messages THIS phone has already marked helpful (live mode only)
function myHelpfulMarks() {
  try { return JSON.parse(localStorage.getItem("agrilink-helpful")) || {}; } catch { return {}; }
}

// "2 days ago" style labels from a message timestamp
function agoLabel(ts) {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return mins + " min ago";
  const hours = Math.round(mins / 60);
  if (hours < 24) return hours + " hour" + (hours > 1 ? "s" : "") + " ago";
  const days = Math.round(hours / 24);
  return days + " day" + (days > 1 ? "s" : "") + " ago";
}

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
  const posts = liveMode ? LIVE_CHAT : loadPosts();
  const myName = localStorage.getItem("agrilink-name") || "";

  feed.innerHTML = "";
  // live database still empty: invite the first message
  if (!posts.length) {
    feed.innerHTML = `<p class="muted small" style="padding:12px 0">No messages yet. Say hello and tell us what you're growing.</p>`;
    return;
  }
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
    const whenText = post.time || (post.ts ? agoLabel(post.ts) : "");
    when.textContent = whenText + (post.helpful ? ` · ${post.helpful} found this helpful` : "");

    bubble.append(who, text, when);

    // "Helpful" reaction, thanks a farmer for good advice.
    // Local mode: saved with the message. Live mode: a transaction on the
    // shared count, and this phone remembers which ones it already marked.
    const helpful = document.createElement("button");
    helpful.type = "button";
    const didHelp = liveMode ? !!myHelpfulMarks()[post._key] : !!post.iHelped;
    helpful.className = "helpful" + (didHelp ? " did" : "");
    helpful.textContent = didHelp ? "You found this helpful" : "Helpful";
    helpful.addEventListener("click", () => {
      if (liveMode) {
        const marks = myHelpfulMarks();
        const countRef = firebase.database().ref("chat/" + post._key + "/helpful");
        if (marks[post._key]) {
          countRef.transaction((v) => Math.max(0, (v || 1) - 1));
          delete marks[post._key];
        } else {
          countRef.transaction((v) => (v || 0) + 1);
          marks[post._key] = true;
        }
        try { localStorage.setItem("agrilink-helpful", JSON.stringify(marks)); } catch {}
      } else {
        const posts = loadPosts();
        const target = posts.find((x) => x === post);
        if (target.iHelped) { target.iHelped = false; target.helpful = (target.helpful || 1) - 1; }
        else { target.iHelped = true; target.helpful = (target.helpful || 0) + 1; }
        savePosts(posts);
      }
      renderChat();
    });
    bubble.appendChild(helpful);

    div.append(avatar, bubble);
    feed.appendChild(div);
  }
  feed.scrollTop = feed.scrollHeight; // scroll to newest message
}

// Send a new message. Live mode: pushed to Firebase, every phone sees it
// within a second. Local mode: saved on this phone as before.
function sendMessage(name, text) {
  const post = {
    name: name || "Anonymous Farmer",
    region: localStorage.getItem("agrilink-region") || localStorage.getItem("agrilink-parish") || "",
    text: text,
  };
  if (liveMode) {
    post.ts = firebase.database.ServerValue.TIMESTAMP;
    firebase.database().ref("chat").push(post);
  } else {
    post.time = "just now";
    const posts = loadPosts();
    posts.push(post);
    savePosts(posts);
    renderChat();
  }
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

  // a stable pseudo-random number from the day of the year, the board
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
      `<span class="market-change ${dir}">${change > 0 ? "▲" : change < 0 ? "▼" : "0"} ${Math.abs(change)}%</span>`;
    box.appendChild(row);
  });
}

renderMarket();
