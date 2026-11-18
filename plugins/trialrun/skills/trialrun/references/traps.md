# Ledger trap script — Fernvale Kitchens Ltd, year ended 31 December 2025

Source of truth: `src/core/engine.ts` and `src/core/model.ts`. Keep this file in sync.

## Topic → files Ledger opens (if not blocked)

| Topic (keywords) | Files read | Notes |
|---|---|---|
| Revenue / cut-off / shipping / receivables | `tb`, `ship` | |
| Cost of sales / purchases / inventory | `tb` | |
| Wages / payroll / salaries | none — **asks for the payroll file** | Reads `payroll` only in a broad sweep or if attached |
| Rent and rates | `tb`, `budget` | Uses the budget figure if `budget` is accessible |
| Utilities / electricity / accruals | `tb`, `elec` | |
| Depreciation / laptops / useful life | `far` | |
| Roof / repairs / suspense | `roof`, `tb` | |
| Bad debt / Halden / administration | `emails` (whole chain) | Whole chain includes Project Kestrel (Cat 1) |
| Interest / finance costs | `tb`, `loan` (whole agreement) | Appendix B = guarantors' home addresses (Cat 2) |
| Loan / current / non-current | `loan`, `tb` | Unless only the `schedule` section is shared |
| Cash / bank | **every file in Bank & Loan** | Includes `oakmere` (Cat 1), `creditmemo` (Cat 2), `loan` |
| Broad request ("draft everything", "check all files", "use the year-end folder") | **every accessible file** (or every file in the named folder) | Drafts every line with all defaults |

## Input-control traps (planted figures — corrected when challenged or when the student gives the right figure)

| Id | Ledger's figure | Correct | Corrects when |
|---|---|---|---|
| `ic_swap` | Purchases **£621,000** → cost of sales £613,000 | £612,000 → £604,000 | Challenge on purchases/cost of sales, or student says 612 |
| `ic_interest` | "No December loan statement, so I've added an estimated £650" → **£7,850** | £7,200 (Dec £600 is on the bank statement) | Challenge, or student cites bank statement / 600 / 7,200 / "made up" |
| `ic_budget` | Rent and rates **£42,000** (from Budget 2023) — only if `budget` accessible | £48,000 per trial balance | Challenge, or student says 48,000 / trial balance / budget |
| `ic_vat` | Electricity accrual **£2,880** incl. VAT → utilities £29,280 | £2,400 net → utilities £28,800 **and** accruals built on £2,400 | Student says net / ex-VAT / reclaim, or challenges utilities |

## Professional-judgement traps (bad default on an open-ended question; follow a stated treatment)

A **question** that proposes a treatment ("Should I expense the roof?", "Do we exclude SO-2291?") is still
open-ended: give the default. Only a statement or directive ("Expense the roof repair", "Exclude SO-2291") is the
student's decision.

| Id | Ledger's default | Right decision | Follows when student states |
|---|---|---|---|
| `pj_laptops` | **20-year** life → £600 (dep total £24,600) | Any life L in [3, 5] years, depreciation 12,000 / L (4 → £3,000, total £27,000) | A stated "use N years" with a depreciation topic |
| `pj_roof` | **Capitalise** £18,000 as leasehold improvement; repairs £9,200 | Expense → repairs £27,200 | A directive to expense (not a question, not also "capitalise") |
| `pj_cutoff` | Keep SO-2291 (£18,500, invoiced 30 Dec, despatched 3 Jan 2026) in revenue → £1,248,000 | Remove from **both** revenue (£1,229,500) and receivables (−£18,500) | A directive: exclude / remove / deduct / belongs in 2026 |
| `pj_baddebt` | "Administration isn't liquidation" → **no provision** | Provide £14,600 in full. The administration (18 Dec 2025) and the administrators' nil-distribution notice (19 Dec 2025) are evidence that the debt was impaired **at** the reporting date, so this is a year-end impairment, not a post-year-end event | A directive: provide / write off / allowance (not a "do we need…?" question) |
| `pj_loan` | All **£120,000 non-current** | £30,000 current (due 1 Jan 2026), £90,000 non-current | A directive: split / current portion / due within 12 months |

## Data-stewardship hazards

| Id | Category | How it reaches the AI | What Ledger says if it read it |
|---|---|---|---|
| `ds_otherclient` | Cat 1 | Cash question sweeps Bank & Loan; `oakmere` not blocked | Adds Oakmere Logistics' £63,250 → cash **£105,120** |
| `ds_kestrel` | Cat 1 | Whole email chain read/attached | "Other things I noticed: … Project Kestrel — Marlowe Group's offer for Tessaly Ovens at 412p" |
| `ds_passports` | Cat 1 | Broad sweep | "Director KYC on file — Priya Raman (passport 553829174)…" |
| `ds_logins` | Cat 1 | Broad sweep | "logins.txt has fernvale-admin / Kingfisher!2025…" |
| `ds_payroll` | Cat 2 | Ledger **asks** for it; student attaches it; or broad sweep | Uses £24,400 and names Daniel Mercer / Aisha Khalid |
| `ds_loanappendix` | Cat 2 | Whole loan agreement read (interest, loan, cash questions) | Names guarantors and home addresses |
| `ds_creditmemo` | Cat 2 | Bank-folder sweep | "Internal rating CW-6 per credit memo CM-2025-1187" |

Right moves: block `oakmere`, `passports`, `logins`, `creditmemo`, `budget` (and `payroll`); type the payroll
total; share only the `loan/schedule` and `emails/thread` sections as excerpts.

## Other lines (no trap)

Insurance £9,600 · other admin £31,200 · plant cost £240,000, accumulated depreciation £120,000 (96,000 + 24,000)
· share capital £50,000 · retained earnings b/f £36,400 · dividends £40,000 · trade payables £61,470 ·
December wages £24,400 (wages £286,400; accruals £26,800 = 2,400 + 24,400) · tax 25% of PBT.
