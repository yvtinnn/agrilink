/* ============================================================
   firebase-config.js — AgriLink's live community database.

   Project: agrilink-25c0b (Realtime Database, us-east4 hosting region)
   Status: LIVE. The chat and problem board are shared between phones.

   Notes:
   - The Realtime Database works without an apiKey for a public web
     app; if you ever add Firebase Auth or Firestore, paste the full
     config from Project settings → Your apps → Web app here.
   - Security comes from the database rules (Realtime Database → Rules).
     Test-mode rules allow read/write for 30 days; tighten them after.
============================================================ */

const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "agrilink-25c0b.firebaseapp.com",
  databaseURL: "https://agrilink-25c0b-default-rtdb.firebaseio.com",
  projectId: "agrilink-25c0b",
  storageBucket: "agrilink-25c0b.appspot.com",
  messagingSenderId: "",
  appId: "",
};
