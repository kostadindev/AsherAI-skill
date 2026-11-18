# Contributing

1. The skill lives in `plugins/trialrun/skills/trialrun/`. Keep `SKILL.md` short; put detail in `references/`.
2. To change coaching behaviour, add or update a case in `evals/agent/cases.ts` first, with a passing and a
   failing fixture in `evals/agent/cases.test.ts`. Then run the live cases (`npm run agent`, see
   `evals/agent/README.md`) and include the summary in your pull request.
3. Don't tune the skill against `cases-heldout.ts`. If a held-out case drives a fix, say so in the README and add
   fresh held-out cases.
4. The skill must never plant errors in real work and must never repeat restricted data.
5. `npm run check` must pass.
