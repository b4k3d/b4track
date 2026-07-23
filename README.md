# <picture><img src="public/icon-512.png" alt="logo" width="56" height="56" align="center" /></picture> B4TRACK

> Strip tracking parameters from any link — clean, private, open source.

B4TRACK is a privacy-first PWA that removes tracking parameters (`utm_*`, `gclid`, `fbclid`, YouTube `si`, `igshid`, and 100+ more) from URLs so the links you share can't be traced back to you. Everything runs **on-device** — no servers, no analytics, no data collection. Paste a link, get a clean one, share it.

Built on · React + Tailwind CSS · 

---

## ✨ Features

- **One-tap cleaning** — paste a link (or share into the app from any Android share sheet) and get a tracker-free URL instantly.
- **100+ tracking params removed** across Google, Meta, TikTok, LinkedIn, Amazon, HubSpot, Mailchimp, and more.
- **Domain-aware rules** — YouTube (`si`/`is`/`pp`/`feature`/`app`), Amazon (`tag`/`ref_`/`pf_rd_*`), Spotify, Reddit, X, and more.
- **Aggressive Mode** — also strips parameter *prefixes* (`utm_`, `mtm_`, `pk_`, `hsa_`, `_hs`, `gclid`, `gad_`…).
- **Clipboard + multi-URL** — clean every URL found in a block of copied text at once.
- **Share Target** — registered as an Android share target so you can clean a link from any app without leaving it.
- **On-device history** — last 50 cleaned links kept locally; one tap to re-copy or re-share.
- **Dark / light neon theme** — follows your system by default, toggle anytime.
- **Zero data collection** — no analytics, no external requests, no account required. See [`src/pages/Privacy.jsx`](src/pages/Privacy.jsx).

---

## 📱 Get the app

1. Install from **Google Play** once published (search *B4TRACK*), **or**
2. Use it on the web / install as a PWA from your browser.

> Building the Android package yourself requires the Base44 **Builder** plan to generate the `.aab` (App Bundle) for Google Play.

---

## 🚀 Run it locally

**Prerequisites:** Node.js 18+ and npm.

1. Clone the repository:
   ```bash
   git clone https://github.com/b4k3d/b4track.git
   cd b4track
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create an `.env.local` file with your Base44 backend:
   ```env
   VITE_BASE44_APP_ID=your_app_id
   VITE_BASE44_APP_BASE_URL=https://your-app.base44.app
   ```
   *(You'll get these values from your Base44 app settings. The app runs fully client-side — no app server.)*
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open the printed local URL in your browser.

**Other scripts**

```bash
npm run build       # production build
npm run preview     # preview the production build
npm run lint        # eslint (quiet)
npm run lint:fix    # eslint --fix
```

---

## 🧹 How cleaning works

The core logic lives in [`src/lib/urlCleaner.js`](src/lib/urlCleaner.js):

- A fixed set of known tracking parameter names is removed from the query string.
- **Domain rules** apply an extra set of params for specific hosts (e.g. YouTube).
- Optionally **unwrap redirect URLs** from wrappers like `l.facebook.com`, `t.co`, `bit.ly`.
- Tracking parameters inside the URL **hash** are cleaned too.
- **Aggressive Mode** additionally strips any parameter whose name starts with known tracking prefixes.

Updating the blocklist = editing the `TRACKING_PARAMS` set or the `DOMAIN_RULES` map in that one file. Logic inspired by [Untracker](https://github.com/zhanghai/Untracker).

---

## 🤝 Contributing

PRs welcome! The easiest way to help:

- Add a missing tracker parameter to `TRACKING_PARAMS` in [`src/lib/urlCleaner.js`](src/lib/urlCleaner.js).
- Add a domain-specific rule to `DOMAIN_RULES`.
- Report a link that isn't cleaned as an issue with the full URL.

1. Fork it
2. Create your branch: `git checkout -b feat/new-tracker`
3. Commit: `git commit -m 'Add tracker for …'`
4. Push: `git push origin feat/new-tracker`
5. Open a Pull Request

Please keep changes on the `main` branch — that's what syncs back to the Base44 builder.

---

## 🔒 Privacy

B4TRACK collects nothing. All URL cleaning, history, and settings happen in your browser's local storage and never leave your device. Full policy: [`src/pages/Privacy.jsx`](src/pages/Privacy.jsx).

---

## 📄 License

Released under the **MIT License** — see [`LICENSE`](LICENSE). Free to use, modify, and distribute.

---

## ☕ Support

If B4TRACK saved you some trackers, consider [buying me a coffee](https://buymeacoffee.com/b4k3d) — it helps cover the Base44 + Google Play dev fees. ⭐ Starring the repo helps too!

---

## 🙏 Acknowledgements

- [Base44](https://base44.com) — the platform this app is built and published with.
- [Untracker](https://github.com/zhanghai/Untracker) — inspiration for the parameter blocklist.
- All the open trackers-of-the-world, for giving us something to clean.
