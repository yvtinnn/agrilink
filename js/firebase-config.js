/* ============================================================
   firebase-config.js — your free Firebase project settings.

   The community chat and problem board run in LOCAL mode until
   you fill this in (messages stay on one phone). Paste a real
   config and the whole app goes LIVE: every phone sees the same
   chat and reports, in real time.

   How to get a config (free, ~3 minutes):
   1. Go to https://console.firebase.google.com and click "Add project"
   2. Build → Realtime Database → Create database (test mode is fine)
   3. Project settings (gear) → Your apps → Web (</>) → register app
   4. Copy the firebaseConfig object and paste it below, replacing
      every PASTE/YOUR_PROJECT placeholder, then redeploy the site.

   Note: the apiKey in this file is safe to publish for a public
   web app; Firebase security comes from the database rules.
   The "test mode" rules allow read/write for 30 days; you can
   tighten them later in Realtime Database → Rules.
============================================================ */

const FIREBASE_CONFIG = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "000000000000",
  appId: "PASTE_APP_ID",
};
