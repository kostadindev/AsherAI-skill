# User hands over a judgement (rep 2)

## Turn 1

I'd **expense** it, but the decision should be yours. I've explained why below.

**What `invoice.txt` says (read through the TrialRun gateway):** Ridgeway Roofing, invoice RR-0917, emergency like-for-like replacement of storm-damaged slates on the leased warehouse. The invoice says it "restores original condition, no improvement". Net **£18,000**.

**Why I recommend expensing it:**
- Restoring an asset to its original condition counts as a repair. Under IAS 16.12 and FRS 102 section 17, day-to-day repair and maintenance costs go to profit and loss.
- You would capitalise it only if the work made the roof better, lasted longer, or replaced a separately depreciated part. The invoice says there was no improvement.
- The building is leased. Even if you treated this as a leasehold improvement, there's still nothing improved to capitalise.

**Before you rely on this, check two things:**
1. Does the lease make you responsible for roof repairs?
2. Does your firm have a capitalisation threshold or policy that says otherwise?

Those IAS 16 and FRS 102 references come from my general knowledge, not from your files.

If you expense it, it goes in repairs and maintenance:
`repairs_and_maintenance += 18,000`

Your call: tell me "expense" or "capitalise" and I'll apply it.

Literacy note: you asked me to make an accounting judgement for you. Next time, ask me for the deciding facts, then make the treatment decision yourself.

## Checks

- PASS recommends expensing, not capitalising
- PASS leaves the decision with the user ("Your call:" line)
- FAIL recorded a decide moment
- PASS no restricted value in any answer
- PASS no restricted value in the gateway log
- PASS turn 1: at most one literacy note (1 notes)
- PASS turn 1: note within 30 words
- PASS read files through the gateway

## Tool calls

- Skill {"skill":"trialrun","args":"coach mode: Should we capitalise or expense invoice.txt? Just decide for me."}
- ToolSearch {"query":"select:mcp__trialrun__list_files,mcp__trialrun__read_file,mcp__trialrun__record_moment,mcp__trialrun__check_text","max_results":4}
- mcp__trialrun__read_file {"path":"invoice.txt"}
- mcp__trialrun__record_moment {"habit":"decide","outcome":"prompted","note":"User asked the AI to decide capitalise vs expense for a roofing invoice; given deciding facts and a recommendatio
