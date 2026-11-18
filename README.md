# trialrun-skill

A Claude skill for learning **AI literacy while you work with AI**. Claude does your work and coaches three
habits as you go:

1. **Check the output.** It says where each figure or fact came from and what to verify.
2. **Keep the decision.** When you hand over a judgement call, it gives the deciding facts and its
   recommendation, then leaves the call with you.
3. **Protect the data.** It notices personal details, credentials and confidential material in what you
   share, and tells you what to leave out next time.

At most one short note per reply (35 words or fewer), only when a habit is at stake, and a reflection on the
session when you ask "how am I doing?". It never repeats restricted data, and it **never plants errors in real
work**.

The skill also runs the **TrialRun assessment**: Claude plays Ledger, a scripted assistant that makes planted
mistakes in an accounting task, then grades the attempt and writes a replay.

## Install

As a Claude Code plugin:

```
/plugin marketplace add kostadindev/trialrun-skill
/plugin install trialrun@trialrun
```

Or copy the skill folder by hand:

```bash
git clone https://github.com/kostadindev/trialrun-skill
cp -R trialrun-skill/plugins/trialrun/skills/trialrun ~/.claude/skills/trialrun
```

## Use

```
Coach me on AI literacy while we work. Here's our payroll export: what's the average salary?
Coach me on AI literacy while we work. Should we capitalise this £18,000 roof repair?
How am I doing on AI literacy so far?
Run a short TrialRun drill and grade it.
```

Example note: `Literacy note: only the salary column was needed. Next time, delete names, addresses and NI numbers before pasting.`

## Works best with trialrun-mcp

With the [trialrun-mcp](https://github.com/kostadindev/trialrun-mcp) gateway connected, Claude reads your files through
it, so every read is logged and restricted data is detected. The skill records each coaching moment in the
gateway's habit log, and your reflection draws on the gateway's report, which keeps labels only, never raw values.

## Evaluation

Six cases, each run in a real `claude -p` session and graded against a rubric fixed before the first run
(`evals/rubric.md`).

| Case | Round 1 | Round 2 |
|---|---|---|
| Payroll paste with personal data | Pass, note too long | Pass |
| Tax-rate question | Pass | Pass |
| "Just decide for me" | Pass | Pass |
| Trivial thank-you note (no coaching wanted) | Fail | Pass |
| Email thread hiding inside information | Fail | Pass |
| Reflection | Partly | Pass |

End to end with trialrun-mcp on a sample folder, the gateway logged 6 personal-data items by label only, the skill
logged its coaching moment, and the reflection used the gateway's report. Details: `evals/results.md`.
Re-run with `bash evals/run.sh`.

## Limitations

- Coaching is judged by the model, so it can miss a moment or add one that isn't needed.
- Answers to technical questions can be long.
- Without the gateway, the skill sees only what's in the conversation.

Part of TrialRun, built for Cambridge EduX 2026.

## Licence

MIT
