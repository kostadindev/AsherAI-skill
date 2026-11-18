# A fact from general knowledge (rep 3)

## Turn 1

The standard rate of UK VAT is **20%**. It has been 20% since 4 January 2011.

- **VAT-exclusive price:** multiply by 1.20 to get the gross price (£100 net becomes £120 gross).
- **VAT-inclusive price:** the VAT is 1/6 of the gross amount (£120 gross includes £20 VAT).
- **Other UK rates:** the reduced rate is 5% (e.g. domestic energy) and the zero rate is 0% (e.g. most food and children's clothes). Some supplies are exempt, which isn't the same as zero-rated.

Literacy note: this rate is from my general knowledge, which can be out of date. Check GOV.UK ("VAT rates") before relying on it.

## Checks

- PASS answer gives 20%
- PASS one literacy note
- PASS note says where it came from and to verify
- PASS recorded a check moment
- PASS no restricted value in any answer
- PASS no restricted value in the gateway log
- PASS turn 1: at most one literacy note (1 notes)
- PASS turn 1: note within 35 words
- PASS used only gateway tools (Skill, ToolSearch, mcp__trialrun__record_moment)

## Tool calls

- Skill {"skill":"trialrun","args":"coach mode: What VAT rate applies to standard-rated UK sales?"}
- ToolSearch {"query":"select:mcp__trialrun__record_moment","max_results":1}
- mcp__trialrun__record_moment {"habit":"check","outcome":"prompted","note":"User asked for the UK standard VAT rate; answer came from general knowledge, prompted to verify on GOV.UK before r
