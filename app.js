// FoU-avdrag Portal — app.js
// All logic: modal, project assessment, calculator, template downloads

const NORMAL_RATE = 0.3142;
const DEDUCTION_RATE = 0.20;
const MAX_MONTHLY_DEDUCTION_BASE = 15_000_000; // 3 MSEK deduction = 15 MSEK salary base

// ── MODAL ───────────────────────────────────────────
const overlay   = document.getElementById('modalOverlay');
const openBtn   = document.getElementById('openAddProject');
const closeBtn  = document.getElementById('closeModal');

openBtn.addEventListener('click', () => overlay.classList.add('open'));
closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });

// ── PROJECT ASSESSMENT ───────────────────────────────
document.getElementById('assessProject').addEventListener('click', addProject);

function addProject() {
  const name    = document.getElementById('projName').value.trim();
  const desc    = document.getElementById('projDesc').value.trim();
  const g1      = document.getElementById('g1').checked;
  const g2      = document.getElementById('g2').checked;
  const g3      = document.getElementById('g3').checked;
  const people  = parseInt(document.getElementById('projPeople').value) || 0;
  const salary  = parseInt(document.getElementById('projSalary').value) || 0;

  if (!name) { alert('Please enter a project name.'); return; }

  const gatesPassed = [g1, g2, g3].filter(Boolean).length;
  let status, statusClass, saving;

  if (gatesPassed === 3) {
    statusClass = 'qualified';
    status = '● Likely qualifies';
    const monthlySaving = people * salary * DEDUCTION_RATE;
    saving = `~${formatKr(monthlySaving)} kr/mo saved`;
  } else if (gatesPassed === 2) {
    statusClass = 'maybe';
    status = '⚠ Borderline';
    saving = 'Review needed';
  } else {
    statusClass = 'disqualified';
    status = '✗ Does not qualify';
    saving = '0 kr';
  }

  // Show result in modal
  const resultEl = document.getElementById('modalResult');
  resultEl.className = `modal-result show ${statusClass}`;
  if (gatesPassed === 3) {
    resultEl.textContent = `✓ Project looks qualifying! Estimated savings: ${saving} for ${people} person(s).`;
  } else if (gatesPassed === 2) {
    resultEl.textContent = `⚠ Borderline — only ${gatesPassed}/3 gates passed. Consider consulting a tax advisor.`;
  } else {
    resultEl.textContent = `✗ Project does not appear to qualify under Lag (2023:747). Routine development is excluded (Prop. 2013/14:1 s.521–522).`;
  }

  // Add card to list
  const list = document.getElementById('projectsList');
  const id   = 'proj_' + Date.now();
  const card = document.createElement('div');
  card.className = 'project-card';
  card.dataset.id = id;
  card.innerHTML = `
    <div class="project-card-header">
      <div>
        <span class="project-status ${statusClass}">${status}</span>
        <h3 class="project-name">${escapeHtml(name)}</h3>
        <p class="project-desc">${escapeHtml(desc) || '<em>No description</em>'}</p>
      </div>
      <div class="project-meta-right">
        <div class="people-count">${people} ${people === 1 ? 'person' : 'people'}</div>
        <div class="monthly-saving">${saving}</div>
      </div>
    </div>
    <div class="gate-checks">
      <span class="check ${g1 ? 'pass' : 'fail'}">${g1 ? '✓' : '✗'} Commercial</span>
      <span class="check ${g2 ? 'pass' : 'fail'}">${g2 ? '✓' : '✗'} Systematic</span>
      <span class="check ${g3 ? 'pass' : 'fail'}">${g3 ? '✓' : '✗'} New knowledge</span>
    </div>
  `;
  list.insertBefore(card, list.firstChild);

  // Auto-close after short delay
  setTimeout(() => {
    overlay.classList.remove('open');
    resetModal();
  }, 2000);
}

function resetModal() {
  document.getElementById('projName').value = '';
  document.getElementById('projDesc').value = '';
  document.getElementById('g1').checked = false;
  document.getElementById('g2').checked = false;
  document.getElementById('g3').checked = false;
  document.getElementById('projPeople').value = 1;
  document.getElementById('projSalary').value = 60000;
  const resultEl = document.getElementById('modalResult');
  resultEl.className = 'modal-result';
  resultEl.textContent = '';
}

// ── CALCULATOR ──────────────────────────────────────
document.getElementById('calcBtn').addEventListener('click', calculate);

function calculate() {
  const people = parseInt(document.getElementById('calcPeople').value) || 0;
  const salary = parseInt(document.getElementById('calcSalary').value) || 0;
  const pct    = Math.min(100, Math.max(50, parseInt(document.getElementById('calcPct').value) || 100)) / 100;

  const totalSalary      = people * salary;
  const qualifyingSalary = totalSalary * pct;

  const normalContrib    = totalSalary * NORMAL_RATE;
  const cappedBase       = Math.min(qualifyingSalary, MAX_MONTHLY_DEDUCTION_BASE);
  const deduction        = cappedBase * DEDUCTION_RATE;
  const effectiveContrib = normalContrib - deduction;
  const annualSave       = deduction * 12;

  document.getElementById('rNormal').textContent    = `${formatKr(normalContrib)} kr`;
  document.getElementById('rDeduction').textContent = `–${formatKr(deduction)} kr`;
  document.getElementById('rEffective').textContent = `${formatKr(effectiveContrib)} kr`;
  document.getElementById('rMonthlySave').textContent = `${formatKr(deduction)} kr`;
  document.getElementById('rAnnualSave').textContent  = `${formatKr(annualSave)} kr`;

  const noteEl = document.getElementById('calcNote');
  if (qualifyingSalary > MAX_MONTHLY_DEDUCTION_BASE) {
    noteEl.textContent = `Note: Max deduction base is 15 MSEK/month (= 3 MSEK deduction cap per §4 lag om FoU-avdrag). Your qualifying salary exceeds this; figures are capped.`;
  } else {
    noteEl.textContent = `Based on 31.42% normal arbetsgivaravgifter. Unused deductions cannot be carried forward — claim monthly on AGI.`;
  }
}

// Run on load with defaults
calculate();

// ── TEMPLATES ──────────────────────────────────────
const TEMPLATES = {
  'project-description': {
    filename: 'FoU_Project_Description_Template.txt',
    content: `FoU-AVDRAG — PROJECT DESCRIPTION TEMPLATE
==========================================
Law: Lag (2023:747) om särskilt avdrag vid beräkning av arbetsgivaravgifter
Reference: Prop. 2013/14:1 s.521–522 (exclusions), §3–5 (qualifying criteria)

INSTRUCTIONS: Complete one form per qualifying project per calendar year.
Keep this on file for potential Skatteverket audit. There is no filing deadline
for the documentation itself, but deductions are claimed monthly on AGI.

──────────────────────────────────────────
SECTION 1 — PROJECT IDENTIFICATION
──────────────────────────────────────────
Project name:          ___________________________________
Internal project ID:   ___________________________________
Project period:        From: ____________  To: ____________
Project lead/contact:  ___________________________________

──────────────────────────────────────────
SECTION 2 — COMMERCIAL PURPOSE (Gate 1)
§3 lag om FoU-avdrag: conducted within näringsverksamhet
──────────────────────────────────────────
Describe the business context and commercial purpose of this R&D:

[e.g. "This project is conducted within [Company AB]'s commercial software
product business. The output will be integrated into [Product Name], which
is sold to enterprise customers."]

___________________________________________
___________________________________________
___________________________________________

──────────────────────────────────────────
SECTION 3 — SYSTEMATIC & QUALIFIED WORK (Gate 2)
§4 lag om FoU-avdrag: systematic research or development using scientific methods
Exclusion: routine maintenance, bug fixing, iterative product updates
──────────────────────────────────────────
Describe the systematic methodology used:

[e.g. "The team follows a hypothesis-driven development process: (1) problem
formulation, (2) literature review, (3) experimental implementation,
(4) evaluation against measurable benchmarks, (5) iteration."]

___________________________________________
___________________________________________

What makes this work non-routine?

___________________________________________
___________________________________________

──────────────────────────────────────────
SECTION 4 — NEW KNOWLEDGE OR SUBSTANTIALLY NEW PRODUCT (Gate 3)
§4 lag om FoU-avdrag: creates new knowledge, or a substantially new/improved product
Decisive foundation: work must use research results as a decisive basis
──────────────────────────────────────────
What new knowledge or substantially new product does this project create?

[e.g. "The project produces a novel prediction algorithm that does not exist
in the prior art. Published research on transformer architectures forms the
decisive foundation; we extend this to a new domain (real-time fraud detection)
with novel training methodology."]

___________________________________________
___________________________________________

Link to external research or knowledge base used as decisive foundation:

___________________________________________

──────────────────────────────────────────
SECTION 5 — SIGN-OFF
──────────────────────────────────────────
Prepared by:   ___________________  Date: _________
Reviewed by:   ___________________  Date: _________
Approved by:   ___________________  Date: _________

This document is prepared for potential audit by Skatteverket.
`,
  },

  'time-log': {
    filename: 'FoU_Monthly_Time_Log_Template.txt',
    content: `FoU-AVDRAG — MONTHLY TIME LOG (PER PERSON)
============================================
Law: Lag (2023:747) §5 — employee must spend ≥50% of actual working time on R&D
Reference: Prop. 2013/14:1 s.521–522

INSTRUCTIONS: Complete one log per person per calendar month.
Actual hours must be logged — estimates are insufficient for audit purposes.

──────────────────────────────────────────
EMPLOYEE / CONSULTANT DETAILS
──────────────────────────────────────────
Full name:             ___________________________________
Personal ID (personnr): __________________________________
Role/title:            ___________________________________
Employment type:       [ ] Employee  [ ] Consultant (§6 applies to consultants)
Month / Year:          ___________________________________
Project name:          ___________________________________

──────────────────────────────────────────
WEEKLY TIME LOG
──────────────────────────────────────────
Week | R&D Hours | Other Hours | Total Hours | R&D %
-----|-----------|-------------|-------------|------
  1  |           |             |             |
  2  |           |             |             |
  3  |           |             |             |
  4  |           |             |             |
  5  |           |             |             |
-----|-----------|-------------|-------------|------
TOT  |           |             |             |

MONTHLY SUMMARY
──────────────────────────────────────────
Total working hours this month:        ______
Hours spent on qualifying R&D:         ______
R&D as % of total hours:               ______%

Qualifies for deduction this month?    [ ] YES (≥50%)  [ ] NO (<50%)

──────────────────────────────────────────
QUALIFYING SALARY THIS MONTH (kr)
──────────────────────────────────────────
Gross salary paid this month:          _______ kr
(Include: salary, holiday pay portion, benefits subject to social contributions)
(Exclude: car benefits, housing benefits not linked to R&D work)

Deduction base (salary × R&D%):        _______ kr
Deduction amount (base × 20%):         _______ kr

──────────────────────────────────────────
SIGN-OFF
──────────────────────────────────────────
Employee/consultant signature: ___________________  Date: _________
Manager approval:              ___________________  Date: _________

Retain this record for minimum 7 years (Skatteförfarandelagen 39:3).
`,
  },

  'people-register': {
    filename: 'FoU_Qualifying_People_Register.txt',
    content: `FoU-AVDRAG — QUALIFYING PEOPLE REGISTER
=========================================
Law: Lag (2023:747) §5 (employees), §6 (consultants)
Note: Both employees and consultants (hired via legal entity) may qualify.

INSTRUCTIONS: Maintain this register for each month deductions are claimed.
Update when people join or leave qualifying projects.

──────────────────────────────────────────
COMPANY DETAILS
──────────────────────────────────────────
Company name:          ___________________________________
Organisation number:   ___________________________________
Reporting month:       ___________________________________
Prepared by:           ___________________________________

──────────────────────────────────────────
QUALIFYING EMPLOYEES (§5)
──────────────────────────────────────────
# | Name | Personal ID | Role | Project | Salary (kr) | R&D% | Deduction Base | Deduction Amount
--|------|-------------|------|---------|-------------|------|----------------|------------------
1 |      |             |      |         |             |      |                |
2 |      |             |      |         |             |      |                |
3 |      |             |      |         |             |      |                |
4 |      |             |      |         |             |      |                |
5 |      |             |      |         |             |      |                |

EMPLOYEE SUBTOTAL DEDUCTION:   _______ kr

──────────────────────────────────────────
QUALIFYING CONSULTANTS (§6)
──────────────────────────────────────────
Note: Consultant must be a natural person (not via their own AB for their own work).
The legal entity paying the consultant claims the deduction.

# | Name | Personal ID | Role | Project | Invoiced Cost (kr) | R&D% | Deduction Base | Deduction Amount
--|------|-------------|------|---------|-------------------|------|----------------|------------------
1 |      |             |      |         |                   |      |                |
2 |      |             |      |         |                   |      |                |
3 |      |             |      |         |                   |      |                |

CONSULTANT SUBTOTAL DEDUCTION:  _______ kr

──────────────────────────────────────────
MONTHLY TOTALS
──────────────────────────────────────────
Total deduction base this month:        _______ kr
Total deduction (20% of base):          _______ kr
Cap check (max 3 MSEK deduction):       [ ] Under cap  [ ] Capped at 3 MSEK

Deduction entered on AGI (date):        ___________________________________
AGI reference number:                   ___________________________________

──────────────────────────────────────────
SIGN-OFF
──────────────────────────────────────────
CFO / Finance lead:    ___________________  Date: _________
`,
  },

  'agi-summary': {
    filename: 'FoU_AGI_Monthly_Claim_Summary.txt',
    content: `FoU-AVDRAG — AGI MONTHLY CLAIM SUMMARY
========================================
Law: Lag (2023:747) om särskilt avdrag vid beräkning av arbetsgivaravgifter
IMPORTANT: Unused deductions CANNOT be carried forward (§7 lag om FoU-avdrag).
Claim each month on the arbetsgivardeklaration (AGI) for that month.

──────────────────────────────────────────
CLAIM DETAILS
──────────────────────────────────────────
Company name:          ___________________________________
Organisation number:   ___________________________________
Claim month:           ___________________________________
AGI submission date:   ___________________________________

──────────────────────────────────────────
DEDUCTION CALCULATION
──────────────────────────────────────────
Step 1: Total qualifying salary paid this month
  (sum of deduction bases from People Register)      _______ kr

Step 2: Apply 20% deduction
  Deduction = Step 1 × 20%                           _______ kr

Step 3: Cap check
  Max deduction per month = 3 000 000 kr
  Max qualifying salary   = 15 000 000 kr
  Is Step 2 > 3 000 000?  [ ] No (use Step 2)  [ ] Yes (cap at 3 000 000 kr)

Step 4: Final deduction claimed this month            _______ kr

──────────────────────────────────────────
NORMAL CONTRIBUTIONS CALCULATION
──────────────────────────────────────────
Total gross salaries paid (all employees):            _______ kr
Normal arbetsgivaravgifter (× 31.42%):                _______ kr
Minus FoU deduction (Step 4 above):                   _______ kr
Net arbetsgivaravgifter payable:                       _______ kr

Effective contribution rate on qualifying staff:
  (Net payable ÷ qualifying salaries) =               _______%
  (Should be approx. 11.42% if fully qualifying)

──────────────────────────────────────────
YEAR-TO-DATE TRACKER
──────────────────────────────────────────
Month     | Qualifying Salary | Deduction Claimed | Cumulative
----------|-------------------|-------------------|----------
January   |                   |                   |
February  |                   |                   |
March     |                   |                   |
April     |                   |                   |
May       |                   |                   |
June      |                   |                   |
July      |                   |                   |
August    |                   |                   |
September |                   |                   |
October   |                   |                   |
November  |                   |                   |
December  |                   |                   |
----------|-------------------|-------------------|----------
ANNUAL    |                   |                   |

──────────────────────────────────────────
CHECKLIST BEFORE SUBMISSION
──────────────────────────────────────────
[ ] Monthly time logs completed for all qualifying persons
[ ] Project description on file for each qualifying project
[ ] People Register updated for this month
[ ] Deduction base does not include non-qualifying roles
[ ] Consultants verified as natural persons under §6
[ ] Deduction amount entered correctly in AGI system
[ ] AGI submitted on time (12th of following month for electronic)

──────────────────────────────────────────
SIGN-OFF
──────────────────────────────────────────
Prepared by:   ___________________  Date: _________
Approved by:   ___________________  Date: _________
`,
  },
};

function downloadTemplate(key) {
  const t = TEMPLATES[key];
  if (!t) return;
  const blob = new Blob([t.content], { type: 'text/plain;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = t.filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── UTILS ───────────────────────────────────────────
function formatKr(n) {
  return Math.round(n).toLocaleString('sv-SE');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── SMOOTH NAV ──────────────────────────────────────
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});
