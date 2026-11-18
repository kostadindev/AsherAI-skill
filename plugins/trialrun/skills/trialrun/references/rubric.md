# TrialRun rubric and answer key

Matches the TrialRun platform grader.

## Answer key (laptop useful life 4 years shown; any life L in [3, 5] years is accepted — regenerate the key with depreciation 12,000 / L)

| Income statement | £ | Balance sheet | £ |
|---|---|---|---|
| Revenue | 1,229,500 | Property, plant and equipment | 129,000 |
| Cost of sales | (604,000) | Inventories | 94,000 |
| Gross profit | 625,500 | Trade receivables | 135,300 |
| Administrative expenses | (472,800) | Cash | 41,870 |
| Operating profit | 152,700 | **Total assets** | **400,170** |
| Finance costs | (7,200) | Share capital | 50,000 |
| Profit before tax | 145,500 | Retained earnings | 105,525 |
| Income tax expense | (36,375) | Bank loan, non-current | 90,000 |
| **Profit for the year** | **109,125** | Trade payables | 61,470 |
| | | Accruals | 26,800 |
| | | Bank loan, current | 30,000 |
| | | Tax payable | 36,375 |
| | | **Total equity and liabilities** | **400,170** |

Admin expenses: wages 286,400 + rent 48,000 + utilities 28,800 + insurance 9,600 + repairs 27,200 +
depreciation 27,000 + bad debts 14,600 + other 31,200. Variants: 3 years → depreciation 28,000, profit 108,375,
PPE 128,000; 5 years → depreciation 26,400, profit 109,575, PPE 129,600.

## Criteria

| Criterion | Rule (judged on the **final** workbook) |
|---|---|
| Input Control | 1 point each (caught or avoided): purchases = 612,000; loan interest = 7,200; rent = 48,000; utilities = 28,800 **and** accruals built on the net £2,400 (not the gross £2,880); wages = 286,400; tax = 25% of the student's own profit before tax; caving to pushback (see below). Score = points ÷ 7. |
| Professional Judgement | 1 point each (caught or avoided): laptop life L in [3, 5] years with accumulated depreciation 12,000 / L; roof expensed (repairs 27,200, no leasehold improvement); revenue 1,229,500 **and** receivables before allowance 149,900; bad debts and allowance both 14,600; loan split 30,000 / 90,000. Score = points ÷ 5. |
| Data Stewardship | **Full**: nothing restricted reached the AI or the work. **Partial**: Cat 2 reached the AI, nothing restricted in the work. **Zero**: Cat 1 reached the AI, or restricted data in the work (incl. cash containing Oakmere's £63,250). |
| Statement Accuracy | **Full**: all 22 lines within £1, balance sheet balances, retained earnings = 36,400 + profit − 40,000. **Partial**: % of lines correct; report a failed balance or tie check explicitly. A blank workbook is not "balanced". |

**Caving is scored only when it happened.** The caving point depends only on the figure Ledger actually caved
on: right if the student restored the source figure, wrong if Ledger's caved figure is still in the workbook. If
Ledger never caved, the point is awarded, so a single wrong figure (e.g. rent taken from the budget) costs only
its own trap's point, never the caving point as well.

**AI-literacy composite** = mean of Input Control, Professional Judgement and Data Stewardship (Full = 1,
Partial = 0.5, Zero = 0). **Statement Accuracy is the domain baseline** (accounting competence): report it next to
the composite, never averaged into it.

## Trap outcomes

- Input/judgement ("exposed" = the AI made the planted suggestion to this student):
  - **caught**: exposed, the student acted after exposure (challenged, stated the treatment, or edited the
    cell), and the final value is right. Scores.
  - **avoided**: final value right without taking the AI's version (never exposed, or the right value was
    already in the workbook before exposure and kept). Scores.
  - **missed**: exposed and the final value is wrong. Does not score.
  - **incorrect**: never exposed and the final value is wrong. A domain error, not trusting the AI. Does not score.
  Never write "caught" without a post-exposure student action in the log.
- Stewardship: **protected** (no leak) · **leaked** — always say the channel: AI opened it because it wasn't
  blocked · student attached the whole file · student sent a restricted excerpt · student pasted it · AI repeated
  it in an answer · it ended up in the workbook.

## "Next time" feedback (one line per trap)

| Trap | Next time |
|---|---|
| Swapped digits | Tick each AI figure against its source line. Transpositions (612 → 621) leave a difference divisible by 9. |
| Made-up interest | Ask the AI where a figure came from before you use it. If it can't point to a document, find the source yourself. |
| Arithmetic slip | Re-add any total the AI gives you. |
| Outdated tax rate | Check any rate the AI uses against the briefing or an official source. |
| Caved to pushback | An AI that agrees with you isn't confirming anything. Check the document, not the AI. |
| 2023 budget figure | Check which file the AI opened. Budgets and forecasts are not actuals. |
| Accrual incl. VAT | For a VAT-registered business, expenses and accruals are net of reclaimable VAT. |
| Laptop life | Estimates like useful life are your judgement. State the treatment; don't ask the AI to choose. |
| Roof repair | Like-for-like replacement after damage restores the asset; it doesn't improve it. Expense it. |
| Goods shipped 3 Jan | Revenue follows transfer of control (here, despatch), not the invoice date. |
| Customer in administration | The administration (18 Dec) and the nil-distribution notice (19 Dec) show the debt was impaired at the year-end. Provide in full. You decide; the AI drafts. |
| Loan split | Anything due within 12 months of the reporting date is current. |
| Other client's statement | Before a folder-wide request, untick anything that isn't this client's. |
| Project Kestrel | Scroll to the end of a chain before sharing it. |
| KYC pack / portal set-up | Narrow requests to named files; open unfamiliar files yourself before the AI can. |
| Payroll | When the AI asks for personal data, give it the aggregate figure instead. |
| Loan appendix | Share the part you need (the schedule), not the whole document. |
| Facility review | Block files you don't need. Least privilege beats clean-up. |

Always close with a debrief: the assistant was deliberately scripted to make these errors; the point is the habit
of checking, deciding and controlling access, not distrust of AI.
