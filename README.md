# Manly Vale Match Day

A coach's match-day app for our football team. Pick the match, set the formation, run the game.

## What it does

- **Match selector** — every fixture from the season; per-match availability (Y / BEERS / TBC / NO).
- **Formation engine** — 4-4-2 Diamond (★), 4-1-4-1, 4-2-3-1. Auto-populate the XI by role.
- **Interactive board** — drag any player anywhere. Tap a player + tap a bench player to substitute.
- **Bench panel** — anyone available who isn't on the pitch, one tap away.
- **Fullscreen presentation mode** — clean pitch view to talk through with the team.
- **NEXT cycler (subtle, bottom-right)** in fullscreen — cycles through Left corner / Right corner / Penalty / Short FK / Long FK with the assigned taker highlighted on the pitch and named in a banner.
- **45-minute timer** with per-player minutes tracked across substitutions. Export to CSV.
- **Google Sheet sync** — pull availability from your roster sheet (must be shared as "Anyone with the link can view").
- **localStorage persistence** — all state is saved locally per browser. Nothing leaves the device unless you sync the sheet.

## Quick test locally

It's plain static HTML/CSS/JS — no build step.

```bash
cd "Manly_Vale_Management"
python3 -m http.server 8080
# open http://localhost:8080
```

Or just open `index.html` directly in a browser. Sheet sync needs `http(s)://`, so use the server when testing that.

## Deploy to Vercel via GitHub

### 1. Push to GitHub

```bash
git init
git add index.html app.css app.js README.md .gitignore football-board-horizontal.html
git commit -m "Initial commit: Manly Vale match day app"
gh repo create manly-vale-matchday --public --source=. --push
# or use the GitHub UI to create the repo and push
```

### 2. Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo.
2. **Framework preset**: select **Other** (it's a static site).
3. Leave **Build Command**, **Output Directory**, and **Install Command** empty.
4. Click **Deploy**.

You'll get a URL like `manly-vale-matchday.vercel.app`. Every push to `main` re-deploys automatically.

### Custom domain (optional)

In Vercel → Project → Settings → Domains, add your domain. Vercel handles HTTPS.

## Google Sheet sync — how to set it up

1. Open the [team sheet](https://docs.google.com/spreadsheets/d/1icq6EY1_dcMObs-bz_rLubiAKCLy9BWZugoushT-tns/).
2. **Share** → **General access** → **Anyone with the link** → **Viewer**. (Required so the app can read it from the browser without OAuth.)
3. The default Sheet ID is already wired in (`1icq6EY1_dcMObs-bz_rLubiAKCLy9BWZugoushT-tns`). To change it: app → ⚙ icon → **Sheet** tab → paste a new ID → **Sync now**.
4. Click the 🔄 icon in the top bar any time to re-sync.

The parser is heuristic. It locates the column with the most player names that match your squad, then any nearby column with a date in the header becomes a fixture column. Cells map as:

| Sheet value | Code | Available? |
| ----------- | ---- | ---------- |
| Y / YES     | Y    | ✅ |
| BEERS       | B    | ✅ (counts as yes) |
| TBC / ?     | TBC  | — |
| AWAY / INJ / NOT PICKED / NO / N | N | ❌ |

If the sync log says "Could not locate a player-name column", verify that the sheet's player names match the names in your squad list (Setup → Squad). The sync is name-based.

## Keyboard shortcuts (in fullscreen)

- `Space` — start / pause timer
- `→` — cycle NEXT (lineup → corners → penalty → free kicks)
- `Esc` — exit fullscreen / close drawer

## File structure

```
.
├── index.html         # markup
├── app.css            # styles (light + dark theme)
├── app.js             # all logic (vanilla JS, no deps)
├── football-board-horizontal.html  # original reference, untouched
└── README.md
```

## Customising

- **Squad / fixtures**: ⚙ icon → tabs. Saved to localStorage.
- **Formation positions**: edit `FORMATIONS` in `app.js` — coordinates are `0–100` percentages on the pitch, `y=0` is the opponent's goal, `y=100` is your goal.
- **Set-piece spots**: edit `SET_PIECES` in `app.js`.
- **Theme colours**: edit CSS custom properties at the top of `app.css`.

## Privacy

Everything lives in your browser's localStorage. Sheet sync is read-only and goes browser → Google direct (no third-party server).
