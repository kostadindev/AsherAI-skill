# trialrun-skill

[![CI](https://github.com/kostadindev/trialrun-skill/actions/workflows/ci.yml/badge.svg)](https://github.com/kostadindev/trialrun-skill/actions/workflows/ci.yml)

A Claude skill for learning **AI literacy while you work with AI**. Claude does your work and coaches three
habits as you go:

1. **Check the output.** It says where each figure or fact came from and what to verify.
2. **Keep the decision.** When you hand over a judgement call, it gives the deciding facts and its
   recommendation, then ends with a `Your call:` line.
3. **Protect the data.** It notices personal details, credentials and confidential material in what you
   share, and tells you what to leave out next time.

At most one short note per reply (25 words or fewer), only when a habit is at stake. Ask "how am I doing?" for a
reflection with a `Habit to keep:` and a `Habit to build:`. It never repeats restricted data, and it **never
plants errors in real work**.

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

With the [trialrun-mcp](https://github.com/kostadindev/trialrun-mcp) gateway connected, Claude reads your files
through it, so every read is logged and restricted data is detected. The skill records each coaching moment in
the gateway's habit log, and your reflection draws on the gateway's report, which keeps labels only, never raw
values.

## Evaluation

Real `claude -p` sessions with the skill and the gateway, scored by code (`evals/agent/`). Each case runs three
times.

| Run | Runs fully passing | Checks passing |
|---|---|---|
| 8 tuning cases, round 1 | 3/24 | 192/219 |
| 8 tuning cases, round 3 | **24/24** | **219/219** |
| 5 held-out cases, first run | 12/15 | 114/117 |

The skill passed every held-out check; the three held-out failures were a gateway detection gap, since fixed.
Details, every check and every change to the checks: [`evals/agent/README.md`](evals/agent/README.md).

## Development

```bash
npm install
npm run check        # typecheck, unit tests for every evaluation check, plugin and skill validation (runs in CI)
npm run agent -- --gateway /abs/path/trialrun-mcp/dist/server.js   # live agent runs (manual; needs Claude Code)
```

| Path | What it holds |
|---|---|
| `plugins/trialrun/skills/trialrun/` | The skill: `SKILL.md` and `references/` |
| `.claude-plugin/`, `plugins/trialrun/.claude-plugin/` | Marketplace and plugin manifests |
| `evals/agent/` | Agent evaluation harness, cases, unit tests and results |
| `scripts/` | Plugin and skill validation |

## Limitations

- Coaching is judged by the model, so it can miss a moment or add one that isn't needed.
- Answers to technical questions can be long.
- Without the gateway, the skill sees only what's in the conversation.

Part of TrialRun, built for Cambridge EduX 2026.

## Licence

MIT
