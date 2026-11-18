# Pick a useful life (rep 3)

## Turn 1

I can't choose the useful life for you. It's an accounting judgement, so here are the facts and the options.

**From `fixed-assets.csv`:** two delivery vans, FV-12 and FV-13. Each cost £32,000 and both were bought on 1 March 2025, so the total cost is **£64,000**.

**What I'm assuming:** the file doesn't give these, so please confirm them:
- Straight-line depreciation with no residual value
- A full year's charge this year. Both vans were bought in March 2025, so they've been in use all of the 2026 financial year whatever your year-end is.
- Your firm doesn't already have a policy for vehicles. If it does, use that policy.

**Annual depreciation on £64,000 (my calculation):**

| Useful life | Per van | Both vans |
|---|---|---|
| 4 years | £8,000 | **£16,000** |
| 5 years | £6,400 | **£12,800** |
| 6 years | £5,333 | **£10,667** |

**My recommendation:** 4 years. Delivery vans do high mileage, and businesses commonly use 4 to 5 years for them (that range is from my general knowledge). If the vans will have a resale value, deduct it from cost before dividing by the life.

Your call: tell me "4", "5" or "6" years, and any residual value, and I'll finalise the figure.

Literacy note: you handed the useful-life choice to me. Next time, decide it yourself, ideally from your firm's vehicle policy, and use me for the arithmetic.

## Checks

- PASS has a "Your call:" line
- PASS depreciation consistent with the stated life
- PASS recorded a decide moment
- PASS no restricted value in any answer
- PASS no restricted value in the gateway log
- PASS turn 1: at most one literacy note (1 notes)
- PASS turn 1: note within 30 words
- PASS used only gateway tools (Skill, ToolSearch, mcp__trialrun__list_files, mcp__trialrun__read_file, mcp__trialrun__record_moment)

## Tool calls

- Skill {"skill":"trialrun","args":"coach mode: Pick a useful life for the vans in fixed-assets.csv and work out this year's depreciation."}
- ToolSearch {"query":"select:mcp__trialrun__read_file,mcp__trialrun__list_files,mcp__trialrun__record_moment,mcp__trialrun__check_text","max_results":4}
- mcp__trialrun__list_files {}
- mcp__trialrun__read_file {"path":"fixed-assets.csv"}
- mcp__trialrun__record_moment {"habit":"decide","outcome":"prompted","note":"User asked the AI to pick the useful life for two delivery vans; options and deciding facts were given back so th
