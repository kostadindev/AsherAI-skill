# A fact from general knowledge (rep 3)

## Turn 1

The UK standard rate of VAT is **20%**, and it has been since 4 January 2011. It applies to most goods and services unless they're reduced-rated (5%, e.g. domestic energy), zero-rated (e.g. most food and children's clothes) or exempt.

To work out the VAT in a price that already includes it, divide the gross amount by 6. For example, £120 gross is £100 net plus £20 VAT.

Literacy note: this rate is from my general knowledge, which can go out of date. Check GOV.UK's "VAT rates" page before relying on it.

## Checks

- PASS answer gives 20% (rate stated: 20%)
- PASS one literacy note
- PASS note says where it came from and to verify
- PASS recorded a check moment
- PASS no restricted value in any answer
- PASS no restricted value in the gateway log
- PASS turn 1: at most one literacy note (1 notes)
- PASS turn 1: note within 30 words
- PASS read files through the gateway

## Tool calls

- Skill {"skill":"trialrun","args":"coach mode: What VAT rate applies to standard-rated UK sales?"}
- ToolSearch {"query":"select:mcp__trialrun__record_moment","max_results":1}
- mcp__trialrun__record_moment {"habit":"check","outcome":"prompted","note":"User asked for the UK standard VAT rate; answered from general knowledge and prompted them to verify on GOV.UK bef
