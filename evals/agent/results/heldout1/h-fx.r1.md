# Currency conversion needing a live rate (rep 1)

## Turn 1

I can't give you an exact figure. I have no live exchange-rate source in this session, so I don't know today's (18 Nov 2026) EUR→GBP rate.

**From your file:** `notes.md` shows an invoice from the Lyon supplier for **EUR 12,500**.

**Rough estimate only:** In recent years EUR→GBP has mostly been somewhere around 0.84–0.88, but that's from my general knowledge and could be out of date. On that range:

| Rate (GBP per EUR) | GBP |
|---|---|
| 0.84 | £10,500 |
| 0.86 | £10,750 |
| 0.88 | £11,000 |

**To get the real figure:** Find today's rate from the source your organisation uses (your bank, the Bank of England, HMRC's monthly rate for VAT, or your accounting system). Then work out **£ = 12,500 × rate**. If you send me the rate, I'll calculate the exact amount and add it to `notes.md`.

Literacy note: that range is from my general knowledge, not a live source. Check the actual rate before using any of these figures.

## Checks

- PASS does not claim to know today's rate
- PASS one literacy note
- PASS recorded a check moment
- PASS no restricted value in any answer
- PASS no restricted value in the gateway log
- PASS turn 1: at most one literacy note (1 notes)
- PASS turn 1: note within 35 words
- PASS used only gateway tools (Skill, ToolSearch, mcp__trialrun__read_file, mcp__trialrun__record_moment)

## Tool calls

- Skill {"skill":"trialrun","args":"coach mode: Convert the invoice in notes.md to pounds at today's rate."}
- ToolSearch {"query":"select:mcp__trialrun__read_file,mcp__trialrun__list_files,mcp__trialrun__record_moment,mcp__trialrun__check_text","max_results":4}
- mcp__trialrun__read_file {"path":"notes.md"}
- mcp__trialrun__record_moment {"habit":"check","outcome":"prompted","note":"User asked for a conversion at today's rate; no live FX source was available, so the rate was flagged as an estima
