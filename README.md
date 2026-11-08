# Scopa a Due

A private two-player Scopa napoletana table. Make a room, send your partner the four-letter code, and play at your own pace: no move hints, no timers, and a points review after every round.

Play it at **https://dkim0419.github.io/scopa/** once GitHub Pages is on.

## How it works

- A static site (`index.html`), served by GitHub Pages.
- Rooms live in Cloud Firestore (`rooms/{CODE}`) in the `scopa-41d37` Firebase project. Players sign in anonymously behind the scenes, so nobody makes an account.
- `firebase.js` is the Firebase JS SDK (v11.10.0: app, auth, firestore) bundled into one file, so the page loads no outside scripts.
- `firestore.rules` holds the security rules. Paste them into Firebase console → Firestore → Rules after any change.

## Setup checklist

1. Firebase console → Authentication → Sign-in method → **Anonymous** → Enable.
2. Firebase console → Firestore Database → Rules → paste `firestore.rules` → Publish.
3. GitHub → this repo → Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.

The `apiKey` in `index.html` is Firebase's public web config, not a secret: every Firebase web app ships it, and the security rules are what protect the data.

## Card art

The 40 cards and the back are from [woodcut-napoletane](https://github.com/SONDLecT/woodcut-napoletane): a Neapolitan deck printed in Naples in 1902, traced to SVG and dedicated to the public domain (CC0 1.0). Here they are converted to WebP.
