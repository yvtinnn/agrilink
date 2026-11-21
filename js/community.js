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
    when.textContent = post.time;

    bubble.append(who, text, when);
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
