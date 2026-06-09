# FoU-avdrag Portal

Build description (new nav item, new dark section)
Paste anything — Jira epics, TG GO notes, bullet points, emails. The AI writes formal Gate 1, Gate 2 and Gate 3 text in Swedish, ready for your tracker and Word document. Each gate has a Copy button. There's also a "→ Copy to Assess project" button that pre-fills the existing assessment flow.
Export row to tracker (appears after any AI analysis)
After either the Assess or Build flow produces a result, an "↓ Export row to tracker" button appears. It downloads a .csv file with one pre-filled row — FoU Code, name, gate scores, descriptions — that you open in Excel and paste straight into Tab 1 of the tracker.

A single-file web portal for assessing R&D projects against Swedish employer contribution deduction criteria under **Lag (2023:747) om särskilt avdrag vid beräkning av arbetsgivaravgifter** — the "lag om FoU-avdrag".

Cut employer social contributions from **31.42% → 11.42%** for qualifying R&D staff. That's roughly 10 000 kr saved per person per month at a 60 000 kr salary.

---

## What's in the portal

### ✦ AI-powered project assessment
Paste your project description and the portal analyses it against all three qualifying gates using Claude AI. It returns a detailed per-gate breakdown with specific quotes from your own text — explaining exactly why each gate passes or fails, and flagging any exclusion risks.

### ☑ Three-gate qualifier
Work through the three legal criteria manually after reading the AI analysis. You stay in control of the final decision.

### 📂 Project list
All assessed projects are collected in a portfolio view with gate checks, estimated monthly savings, and export options.

### 💰 Savings calculator
Enter headcount, salary, and R&D time percentage. The calculator applies the 20% deduction, checks the 3 MSEK monthly cap, and shows your monthly and annual saving.

### ✅ Documentation checklist
An interactive audit-readiness checklist covering all four areas Skatteverket expects: per-project documentation, per-person time tracking, monthly AGI filing, and long-term audit readiness. Each group has a live progress bar.

### 📥 Skatteverket templates
Download four pre-filled text templates: project description, monthly time log, qualifying people register, and AGI monthly claim summary — all with the correct law references.

### 📄 PDF export
Export a formatted report of all your assessed projects, ready to attach to Skatteverket correspondence. Opens a print view — use File → Print → Save as PDF in your browser.

---

## Key law references

| Reference | What it covers |
|---|---|
| Lag (2023:747) §3–5 | Qualifying criteria — the three gates |
| Lag (2023:747) §5 | Time threshold: ≥50% of working time AND ≥15 hours/month |
| Lag (2023:747) §6 | Consultants (natural persons) also qualify |
| Lag (2023:747) §7 | Deductions cannot be carried forward — claim every month |
| Prop. 2013/14:1 s.521–522 | Explicit exclusions: routine dev, maintenance, support |

---

## The three qualifying gates

A project must pass **all three** to qualify:

1. **Commercial purpose (§3)** — conducted within a commercial business (*näringsverksamhet*) with a profit motive
2. **Systematic & qualified (§4)** — follows a defined methodology using scientific or engineering methods; not routine iteration or maintenance
3. **New knowledge or substantially new product (§4)** — creates new knowledge or a substantially improved product/process; prior research must form the decisive foundation

---

## How to use

### Option A — GitHub Pages (recommended)

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to **Deploy from a branch → main → / (root)**
4. Visit `https://YOUR_USERNAME.github.io/fou-portal/`

### Option B — Run locally

No build step or dependencies. Just open the file:

```bash
git clone https://github.com/YOUR_USERNAME/fou-portal.git
cd fou-portal
open index.html
```

---

## File structure

Everything is in a single self-contained file:

```
fou-portal/
├── index.html    ← the entire portal (HTML + CSS + JS, all inline)
└── README.md
```

The portal uses no frameworks, no bundler, and no backend. The only external resources are Google Fonts and the Anthropic API (for AI analysis).

---

## AI analysis — how it works

The AI assessment calls the Anthropic API directly from the browser. It sends your project description along with the full legal context of Lag (2023:747) and receives a structured JSON response with:

- An overall verdict (qualifies / borderline / does not qualify)
- A plain-language summary
- A per-gate breakdown with a direct quote from your text for each gate
- A specific watch-out if any exclusion risk is detected

The gate checkboxes in Step 2 are **not** auto-filled — you read the analysis and make the decision yourself.

---

## Important rules to remember

- **Both time conditions must be met in the same month** — ≥50% of working time AND ≥15 hours. A person working 20 total hours at 100% R&D fails. A person working 160 hours at 40% R&D also fails.
- **No carry-forward** — unused deductions are lost. Claim every month on your AGI (arbetsgivardeklaration).
- **Consultants count** — natural persons hired as consultants qualify under §6. The hiring entity claims the deduction.
- **Group companies** — within a *koncern*, the parent claims first; surplus passes to subsidiaries.
- **Retain records for 7 years** — Skatteförfarandelagen 39:3.

---

## Disclaimer

This tool is for internal planning and guidance only. Consult a qualified Swedish tax advisor (*skattekonsult*) before filing claims with Skatteverket. Law and rates may change — always verify against current Skatteverket guidance at [skatteverket.se](https://www.skatteverket.se).lt a qualified Swedish tax advisor for your specific situation. Law and rates may change — always verify against current Skatteverket guidance.
