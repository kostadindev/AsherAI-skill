# Scenario pack template

A TrialRun scenario pack is a TypeScript module set, laid out like the platform's core (and the scenario in
[trialrun-mcp](https://github.com/kostadindev/trialrun-mcp), `src/scenario/`):

```
scenario.ts   SCENARIO meta, FOLDERS, FILES (VFile[] with sections, restricted levels, markers)
model.ts      WORKINGS (input fields), statement lines, computeStatements(), keyWorkbook(), TRAPS
engine.ts     topic regexes, fact extraction (stated treatments / challenges), topic handlers
grader.ts     trapCorrect() per trap, criterion scoring (usually reused unchanged)
```

## 1. Brief (fill in)

- **Role and task:** e.g. "Junior auditor: prepare a cash-flow statement for X for the year ended …"
- **Time limit:** 5 to 60 minutes; size the number of lines to the time.
- **Learner level:** which course / module; what they already know.
- **Criteria:** keep the four (Input Control, Professional Judgement, Data Stewardship, Accuracy) so cohorts compare.

## 2. Files (`FILES`)

For each file: `id`, `name` (realistic, unlabelled), `folder`, `kind`, `role` (`needed` / `not-needed` / `cat1` /
`cat2`), teacher note `why`, and `sections[]`. Put restricted content in its own section with
`restricted: 'cat1' | 'cat2'` and 2–4 **unique** `markers` (fake ID numbers, codenames, names, addresses).

Checklist:
- [ ] Every needed figure is derivable from `needed` files without opening restricted sections.
- [ ] At least one needed file **contains** a restricted section (so "attach the whole file" leaks).
- [ ] Restricted files sit in the **same folders** as needed files (so broad sweeps leak).
- [ ] At least one not-needed file holds a plausible wrong figure (budget, prior year, draft).
- [ ] No marker string occurs in any non-restricted section.

## 3. Traps (`TRAPS`)

| Type | How many | Design rule |
|---|---|---|
| Input control | 4–7 | A specific wrong figure the AI enters (transposition, invented estimate, wrong source, gross vs net, arithmetic slip, outdated rate) or caving on a correct figure when pushed without evidence. Corrected on an evidence-backed challenge. |
| Judgement | 5 | A bad default on an open-ended question, with an unambiguous right answer in the documents. Followed when the student states a treatment. |
| Stewardship | 4–7 | Cat 1 and Cat 2 hazards across all four routes: AI opens it, data hidden inside a needed file, AI asks for it, AI repeats it. |

For each: `id`, `criterion`, `short`, `title`, `aiDoes`, `right`, `nextTime` (one actionable sentence).

## 4. Answer key (`keyWorkbook`)

Correct value for every input field; accept ranges for genuine estimates by enumerating variants (e.g. useful
life 3/4/5) and grading against the closest variant.

## 5. Validation (must pass before use)

1. Perfect workbook → 100% on all criteria; balance sheet balances.
2. "Draft everything and insert all" → every trap fires; stewardship Zero.
3. Careful persona (blocks restricted files, states treatments, challenges figures, uses excerpts) → 100%.
4. Each single-trap persona changes exactly one trap outcome.
5. Lecturer dashboard shows each trap with a distinct short label.
