# A fact from general knowledge (rep 2)

## Turn 1

The UK standard rate of VAT is **20%**. It has been 20% since 4 January 2011.

- **Adding VAT to a net price:** multiply by 1.20. For example, £100 net becomes £120 gross.
- **Taking VAT out of a gross price:** divide by 6, which is the same as multiplying by 20/120. For example, £120 gross includes £20 of VAT.

Not everything is standard-rated. Some goods and services are charged at the reduced rate of 5%, some are zero-rated at 0%, and some are exempt.

Literacy note: this rate comes from my general knowledge, not a source you gave me. Check it on GOV.UK ("VAT rates") before relying on it.

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
- mcp__trialrun__record_moment {"habit":"check","outcome":"prompted","note":"Asked for the UK standard VAT rate; answer came from AI general knowledge and the user was prompted to confirm it 
