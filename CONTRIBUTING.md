# Contributing

1. The skill lives in `plugins/trialrun/skills/trialrun/`. Keep `SKILL.md` short; put detail in `references/`.
2. To change coaching behaviour, add or update a case in `evals/run.sh` and `evals/rubric.md` first, then run
   `bash evals/run.sh` and check every case against the rubric.
3. The skill must never plant errors in real work and must never repeat restricted data.
4. Open a pull request with the rubric results.
