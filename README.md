# FoU-avdrag Portal

A static web portal to assess R&D projects for Swedish employer contribution deductions under **Lag (2023:747) om särskilt avdrag vid beräkning av arbetsgivaravgifter** (the "lag om FoU-avdrag").

## What this does

- **Project Qualifier** — Run any project through the 3-gate assessment (commercial, systematic, new knowledge)
- **Savings Calculator** — See monthly and annual savings vs the normal 31.42% arbetsgivaravgifter
- **Documentation Templates** — Download audit-ready templates for Skatteverket

## Key law references

| Reference | What it covers |
|---|---|
| Lag (2023:747) §3–5 | Qualifying criteria (3 gates) |
| Lag (2023:747) §6 | Consultants also qualify |
| Lag (2023:747) §7 | Deductions cannot be carried forward |
| Prop. 2013/14:1 s.521–522 | Explicit exclusions (routine dev, maintenance) |

## How to run locally

Just open `index.html` in a browser. No build step, no dependencies.

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/fou-portal.git
cd fou-portal

# Open directly
open index.html
```

## Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to **Deploy from a branch → main → / (root)**
4. Your portal will be live at `https://YOUR_USERNAME.github.io/fou-portal/`

## File structure

```
fou-portal/
├── index.html          # Main app
├── css/
│   └── style.css       # All styles
├── js/
│   └── app.js          # Calculator, modal, template downloads
└── README.md
```

## Disclaimer

This tool is for guidance only. Consult a qualified Swedish tax advisor for your specific situation. Law and rates may change — always verify against current Skatteverket guidance.
