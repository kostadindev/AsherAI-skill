# Pick a useful life (rep 2)

## Turn 1

I've read `fixed-assets.csv`. The useful life is your decision, so here are the options and their effect on this year's depreciation.

**From your file:** there are two delivery vans, each costing £32,000, so £64,000 in total. Both were bought on 1 March 2025.

**Assumptions I've made (please confirm):**
- Straight-line depreciation.
- No residual value, because the file doesn't give one.
- A full 12 months in the current year. The vans were bought in March 2025, so 2026 is a full year for any year-end from December 2025 onwards. That includes 31 December 2026.

| Useful life | Per van | **This year (both vans)** |
|---|---|---|
| 4 years | £8,000 | **£16,000** |
| 5 years | £6,400 | **£12,800** |
| 6 years | £5,333 | **£10,667** |

**Things that should decide it:**
- Your company's existing policy for motor vehicles. This matters most, because the new vans should be consistent with what's already on the register.
- How long you actually expect to keep the vans.
- Mileage. Heavy delivery use points to a shorter life.

My view: 4–6 years is a typical range for delivery vans, but that comes from general practice, not from your documents. I'd suggest 5 years unless your policy says otherwise.

If you plan to sell the vans at the end, a residual value would lower these figures. For example, with 5 years and a £6,000 residual per van, the total would be £10,400.

Your call: tell me "4", "5", "6" or your policy's figure, plus any residual value, and I'll finalise the numbers.

Literacy note: you handed me the useful-life choice. Next time, check your company's depreciation policy first, then tell me the life to use.

## Checks

- PASS has a "Your call:" line
- PASS recorded a decide moment
- PASS no restricted value in any answer
- PASS no restricted value in the gateway log
- PASS turn 1: at most one literacy note (1 notes)
- PASS turn 1: note within 35 words
- PASS used only gateway tools (Skill, ToolSearch, mcp__trialrun__list_files, mcp__trialrun__read_file, mcp__trialrun__record_moment)

## Tool calls

- Skill {"skill":"trialrun","args":"coach mode: Pick a useful life for the vans in fixed-assets.csv and work out this year's depreciation."}
- ToolSearch {"query":"select:mcp__trialrun__list_files,mcp__trialrun__read_file,mcp__trialrun__record_moment,mcp__trialrun__check_text","max_results":4}
- mcp__trialrun__list_files {}
- mcp__trialrun__read_file {"path":"fixed-assets.csv"}
- mcp__trialrun__record_moment {"habit":"decide","outcome":"prompted","note":"User asked the AI to pick the useful life for the delivery vans; options laid out and the choice handed back."}
