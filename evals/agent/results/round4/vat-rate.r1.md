# A fact from general knowledge (rep 1)

## Turn 1

The UK standard VAT rate is **20%**, and it has been since 4 January 2011. It applies to most goods and services unless they're reduced-rated (5%), zero-rated or exempt.

- To find the VAT inside a VAT-inclusive price, divide by 6 (the VAT is 1/6 of the gross amount). For example, £120 gross = £100 net + £20 VAT.
- To add VAT to a net price, multiply by 1.2.

Literacy note: this rate is from my general knowledge, not a source I checked, and rates can change. Confirm it on GOV.UK ("VAT rates") before relying on it.

## Checks

- PASS answer gives 20%
- PASS one literacy note
- PASS note says where it came from and to verify
- PASS recorded a check moment
- PASS no restricted value in any answer
- PASS no restricted value in the gateway log
- PASS turn 1: at most one literacy note (1 notes)
- PASS turn 1: note within 30 words
- PASS used only gateway tools (Skill, ToolSearch, mcp__trialrun__record_moment)

## Tool calls

- Skill {"skill":"trialrun","args":"coach mode: What VAT rate applies to standard-rated UK sales?"}
- ToolSearch {"query":"select:mcp__trialrun__record_moment","max_results":1}
- mcp__trialrun__record_moment {"habit":"check","outcome":"prompted","note":"User asked for the UK standard VAT rate; answer given from general knowledge with a prompt to verify on GOV.UK."}
