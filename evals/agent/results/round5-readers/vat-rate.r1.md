# A fact from general knowledge (rep 1)

## Turn 1

The UK standard rate of VAT is **20%**, and it has been since 4 January 2011. Most goods and services are taxed at this rate. The reduced rate is 5% (for example, domestic energy), and some items are zero-rated at 0% (for example, most food and children's clothing).

If a price already includes VAT, the VAT part is 1/6 of it. On £120 including VAT, that's £20 VAT on a net price of £100.

Literacy note: this rate is from my general knowledge, which can be out of date. Check GOV.UK's "VAT rates" page before relying on it.

## Checks

- PASS answer gives 20% (rate stated: 20%)
- PASS one literacy note
- PASS note says where it came from and to verify
- FAIL recorded a check moment
- PASS no restricted value in any answer
- PASS no restricted value in the gateway log
- PASS turn 1: at most one literacy note (1 notes)
- PASS turn 1: note within 30 words
- PASS read files through the gateway

## Tool calls

- Skill {"skill":"trialrun","args":"coach mode: What VAT rate applies to standard-rated UK sales?"}
- ToolSearch {"query":"select:mcp__trialrun__record_moment","max_results":1}
- mcp__trialrun__record_moment {"habit":"check","outcome":"prompted","note":"Asked for the UK standard VAT rate; answer given from general knowledge with a prompt to verify on GOV.UK before r
