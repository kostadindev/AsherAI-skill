# A fact from general knowledge (rep 1)

## Turn 1

UK sales at the standard rate carry **20%** VAT. That rate has applied since 4 January 2011.

- To add VAT to a net price, multiply by 1.2. For example, £100 net becomes £120 gross.
- To find the VAT inside a gross price, divide by 6 (20/120). For example, a £120 gross price includes £20 of VAT.
- Not every sale is standard-rated. The reduced rate is 5% (for example, domestic energy), and some goods are zero-rated (for example, most food and children's clothes).

Literacy note: this rate is from my general knowledge, which can be out of date. Check GOV.UK's VAT rates page before relying on it.

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
- mcp__trialrun__record_moment {"habit":"check","outcome":"prompted","note":"User asked for the UK standard VAT rate; the answer came from the model's general knowledge and the user was promp
