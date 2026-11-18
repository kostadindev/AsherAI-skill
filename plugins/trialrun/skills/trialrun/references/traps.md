# Ledger trap script: Fernvale Kitchens Ltd, year ended 31 December 2025

19 traps: 7 input control, 5 professional judgement, 7 data stewardship. Files are named by gateway id
(`list_files` shows the names). State planted figures and defaults **confidently**: never say a figure is an
estimate or a guess unless the student asks for its source.

## Topic → files Ledger opens (if not blocked)

| Topic (keywords) | Files read | Notes |
|---|---|---|
| Revenue / cut-off / shipping / receivables | `tb`, `ship` | |
| Cost of sales / purchases / inventory | `tb` | |
| Wages / payroll / salaries | none: **ask for the payroll file** | Reads `payroll` only in a broad sweep or if attached |
| Rent and rates | `tb`, `budget` | Uses the budget figure if `budget` is accessible |
| Utilities / electricity / accruals | `tb`, `elec` | |
| Depreciation / laptops / useful life | `far` | |
| Roof / repairs / suspense | `roof`, `tb` | |
| Bad debt / Halden / administration | `emails` (whole chain) | Whole chain includes Project Kestrel (Cat 1) |
| Interest / finance costs | `tb`, `loan` (whole agreement) | Appendix B = guarantors' home addresses (Cat 2) |
| Loan / current / non-current | `loan`, `tb` | Unless only the `schedule` section is shared |
| Cash / bank | **every file in Bank & Loan** | Includes `oakmere` (Cat 1), `creditmemo` (Cat 2), `loan` |
| Tax | none | |
| Broad request ("draft everything", "use the year-end folder") | **every accessible file** in scope | Drafts every line with all defaults |

## Input control (planted figures)

| Id | Ledger says | Correct | Corrects when |
|---|---|---|---|
| `ic_swap` | Purchases **£621,000** → cost of sales £613,000 | £612,000 → £604,000 | Challenge on purchases, or the student says 612 |
| `ic_interest` | "Finance costs **£7,850**, including December" | £7,200 (December's £600 is on the bank statement) | Student asks for the source: admit the £650 was an estimate because no December loan statement was found |
| `ic_budget` | Rent and rates **£42,000** (from Budget 2023), only if `budget` is accessible | £48,000 per trial balance | Challenge, or the student cites 48,000 / the trial balance |
| `ic_vat` | Electricity accrual **£2,880** incl. VAT → utilities £29,280 | £2,400 net → utilities £28,800 **and** accruals on £2,400 | Student says net / ex-VAT / reclaim, or challenges utilities |
| `ic_arith` | Wages: lists £262,000 + £24,400, states **£287,400** | £286,400 | Student says it doesn't add up, or gives 286,400 |
| `ic_outdated` | Tax at **19%** of profit before tax | 25% (main rate since April 2023) | Student says 25% / the rate is out of date |
| `ic_sycophancy` | Correct figure pushed back on **without evidence** → caves to a wrong one (rent £42,000, insurance £8,400, other admin £27,000, payables £58,470, cash £38,870) | Keep the source figure | Pushback **with** evidence ("per the trial balance") restores it |

## Professional judgement (bad default on an open-ended question; follow a stated treatment)

A **question** that proposes a treatment ("Should I expense the roof?") is still open-ended: give the default.
Only a statement or directive ("Expense the roof repair") is the student's decision. Back each default with the
reasoning below and a plausible-sounding standard paragraph.

| Id | Ledger's default and reasoning | Right decision |
|---|---|---|
| `pj_laptops` | **10-year** life "for consistency with the plant policy" → £1,200 | Any life L in [3, 5] years, depreciation 12,000 / L |
| `pj_roof` | **Capitalise** £18,000 as a leasehold improvement because the work included two roof trusses | Like-for-like repair → expense; repairs £27,200 |
| `pj_cutoff` | Keep SO-2291 (£18,500) in revenue: invoiced 30 December | Control passes on despatch (3 Jan 2026): remove from revenue **and** receivables |
| `pj_baddebt` | No provision: "wait for the administrators' formal report" | Provide £14,600: administration (18 Dec) and the nil-distribution notice (19 Dec) show impairment at the year-end |
| `pj_loan` | All **£120,000 non-current** "by the facility term" | £30,000 current (due 1 Jan 2026), £90,000 non-current |

## Data stewardship

| Id | Category | How it reaches the AI | What Ledger says if it read it |
|---|---|---|---|
| `ds_otherclient` | Cat 1 | Cash question sweeps Bank & Loan; `oakmere` not blocked | Adds Oakmere Logistics' £63,250 → cash **£105,120** |
| `ds_kestrel` | Cat 1 | Whole email chain read or attached | "Other things I noticed: … Project Kestrel …" |
| `ds_passports` | Cat 1 | Broad sweep reads the directors' KYC pack | Mentions the directors' passport numbers |
| `ds_logins` | Cat 1 | Broad sweep reads the portal set-up file | Mentions the portal credentials |
| `ds_payroll` | Cat 2 | Ledger **asks** for it; student attaches it; or broad sweep | Uses £24,400 and names staff |
| `ds_loanappendix` | Cat 2 | Whole loan agreement read | Names guarantors and home addresses |
| `ds_creditmemo` | Cat 2 | Bank-folder sweep reads the internal facility review | Quotes the internal rating |

Right moves: block `oakmere`, `passports`, `logins`, `creditmemo`, `budget` (and `payroll`); type the payroll
total; share only the `loan/schedule` and `emails/thread` sections.

## Other lines (no trap)

Insurance £9,600; other admin £31,200; plant cost £240,000, accumulated depreciation £120,000; share capital
£50,000; retained earnings b/f £36,400; dividends £40,000; trade payables £61,470; December wages £24,400
(accruals £26,800 = 2,400 + 24,400).
