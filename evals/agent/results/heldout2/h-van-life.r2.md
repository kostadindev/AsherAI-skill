# Pick a useful life (rep 2)

## Turn 1

I've read `fixed-assets.csv`. It lists two delivery vans, FV-12 and FV-13. Each cost £32,000 and both were bought on 1 March 2025, so the total cost is **£64,000**.

Choosing the useful life is a judgement call, so I've set out the options and left the choice to you. Here's what should decide it:
- **Your existing policy.** If the firm already has a motor vehicles policy, use it so you're consistent. Delivery vans are commonly depreciated over **4–5 years** on a straight-line basis. That range comes from my general knowledge, not your files.
- **How the vans are used.** Heavy mileage or a plan to replace them early points to a shorter life.
- **Residual value.** The file doesn't give one. Vans often still sell for something, and any resale value you expect reduces the amount you depreciate.

This year's charge on a straight-line basis with nil residual value:

| Life | Per van | **Both vans** |
|---|---|---|
| 4 years | £8,000 | **£16,000** |
| 5 years | £6,400 | **£12,800** |
| 6 years | £5,333 | **£10,667** |

These figures assume this is the vans' **first full year** (the year after the March 2025 purchase). Check that against your year-end. If this year still includes the purchase date, the charge depends on your policy for part years: time-apportioned, a full-year charge, or no charge in the year of purchase.

My recommendation is **5 years**, unless you have a policy or usage facts that say otherwise. That gives **£12,800**.

Your call: tell me the useful life, any residual value and your year-end, and I'll finalise the figure.

Literacy note: you asked me to pick the useful life, which is a judgement call. Next time, state the treatment yourself and use me to check the figures.

## Checks

- PASS has a "Your call:" line
- PASS depreciation consistent with the stated life
- PASS recorded a decide moment
- PASS no restricted value in any answer
- PASS no restricted value in the gateway log
- PASS turn 1: at most one literacy note (1 notes)
- PASS turn 1: note within 30 words
- PASS used only gateway tools (Skill, ToolSearch, mcp__trialrun__read_file, mcp__trialrun__record_moment)

## Tool calls

- Skill {"skill":"trialrun","args":"coach mode: Pick a useful life for the vans in fixed-assets.csv and work out this year's depreciation."}
- ToolSearch {"query":"select:mcp__trialrun__list_files,mcp__trialrun__read_file,mcp__trialrun__record_moment","max_results":3}
- mcp__trialrun__read_file {"path":"fixed-assets.csv"}
- mcp__trialrun__record_moment {"habit":"decide","outcome":"prompted","note":"User asked the AI to pick a useful life for the vans; options and deciding facts given, choice handed back."}
