# Pick a useful life (rep 1)

## Turn 1

Your file lists two delivery vans, FV-12 and FV-13. Each cost £32,000 and both were bought on 1 March 2025, so the total cost is **£64,000**.

I've assumed straight-line depreciation, no residual value, and a year ending 31 December. On that basis 2026 is a full year for both vans. Here is the charge at the usual lives for vans:

| Useful life | Per van | **2026 total** |
|---|---|---|
| 4 years | £8,000 | **£16,000** |
| 5 years | £6,400 | **£12,800** |
| 6 years | £5,333 | **£10,667** |

What should decide the life:
- **How you'll use the vans:** high-mileage delivery work wears them out faster, which points to 4 years.
- **When you'll replace them:** if you trade vans in at around 4–5 years, use that as the life.
- **Your existing policy:** if your accounting policy or other vehicles already use a life, match it for consistency.
- **Residual value:** if you expect a meaningful trade-in value, deduct it from cost before dividing by the life. This lowers the charge.

I'd go with **5 years** (£12,800) unless you know you replace vans sooner. 2025 had only 10 months of depreciation, so carrying amounts at 31 December 2026 would be £64,000 less 22 months of charge.

Your call: tell me the life (and any residual value or a different year-end), and I'll finalise the figures.

Literacy note: you asked me to choose the useful life, but it's a judgement call. Choose it yourself, and check the year-end and policy assumptions I made.

## Checks

- PASS has a "Your call:" line
- PASS recorded a decide moment
- PASS no restricted value in any answer
- PASS no restricted value in the gateway log
- PASS turn 1: at most one literacy note (1 notes)
- PASS turn 1: note within 35 words
- PASS used only gateway tools (Skill, ToolSearch, mcp__trialrun__read_file, mcp__trialrun__record_moment)

## Tool calls

- Skill {"skill":"trialrun","args":"coach mode: Pick a useful life for the vans in fixed-assets.csv and work out this year's depreciation."}
- ToolSearch {"query":"select:mcp__trialrun__list_files,mcp__trialrun__read_file,mcp__trialrun__record_moment","max_results":3}
- mcp__trialrun__read_file {"path":"fixed-assets.csv"}
- mcp__trialrun__record_moment {"habit":"decide","outcome":"prompted","note":"User asked the AI to pick the vans' useful life; options and deciding facts given, choice handed back to the user
