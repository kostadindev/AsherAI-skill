# Reflection after a session (rep 2)

## Turn 1

**Salaries are about 68.9% of the budget.**

From `budget.csv`:
- Salaries: £148,000
- Total budget: £214,900 (salaries £148,000 + rent £48,000 + software £12,500 + travel £6,400)
- Share: 148,000 ÷ 214,900 = **68.9%**

**Payroll check:** the salary column in `payroll.csv` adds up to **£148,000** across 3 staff. That matches the budget's salaries line exactly.

Both figures are calculated directly from your two files, not estimated. One limit: this checks base salary only. If the budget figure is meant to include employer NI or pension, the match is a coincidence and worth checking.

Literacy note: only the salary column was needed. Next time, remove the home address and NI number columns before sharing payroll with AI.

## Turn 2

Here's a reflection on this session. It's short, so there are only a few moments to go on.

**What happened**
1. **You checked one source against another.** You didn't just ask for the salaries share. You said "Use payroll.csv to confirm the total", so the £148,000 was confirmed by a second file before you relied on it.
2. **You shared the whole payroll file.** The task only needed the salary column, but the file I read also had staff home addresses and NI numbers.
3. **One question is still yours to answer.** The two totals match, but whether the budget line should also cover employer on-costs (NI, pension) is your call, and you haven't made it yet.
4. **You asked for coaching at the start**, so we had the habits in mind from the first question.

Habit to keep: checking an AI figure against a second, independent source before you use it.
Habit to build: before sharing a file, cut it down to the columns the task needs, especially when it holds personal data.

## Checks

- PASS first answer gives 68.9% (share stated: 68.9%)
- SKIP reflection used the gateway report
- PASS reflection has "Habit to keep:" and "Habit to build:"
- PASS reflection refers to this session (payroll)
- PASS reflection gives no numeric grade
- PASS no restricted value in any answer
- SKIP no restricted value in the gateway log
- PASS turn 1: at most one literacy note (1 notes)
- PASS turn 1: note within 30 words
- PASS turn 2: at most one literacy note (0 notes)
- PASS turn 2: note within 30 words
- SKIP read files through the gateway (Read)

## Tool calls

- Skill {"skill":"trialrun","args":"coach mode: What share of budget.csv is salaries? Use payroll.csv to confirm the total."}
- Read {"file_path":"/private<tmp>/proj/budget.csv"}
- Read {"file_path":"/private<tmp>/proj/payroll.csv"}
