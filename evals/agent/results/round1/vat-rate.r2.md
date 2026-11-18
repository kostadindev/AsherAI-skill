# A fact from general knowledge (rep 2)

## Turn 1

Standard-rated sales in the UK are charged VAT at **20%**. That rate has applied since 4 January 2011.

Two related rates:
- **Reduced rate, 5%:** for example, domestic energy and children's car seats.
- **Zero rate, 0%:** for example, most food, children's clothes and books. These sales are still VAT-taxable, so they're different from exempt sales.

To get the VAT on a net price, multiply by 0.20. To pull the VAT out of a price that already includes it, divide the gross amount by 6. For example, £120 gross contains £20 of VAT.

Literacy note: I gave this rate from memory, not from a source, and rates can change in a Budget. Check GOV.UK's "VAT rates" page before using it in a filing or invoice.

## Checks

- PASS answer gives 20%
- PASS one literacy note
- FAIL note says where it came from and to verify
- PASS recorded a check moment
- PASS no restricted value in any answer
- PASS no restricted value in the gateway log
- PASS turn 1: at most one literacy note (1 notes)
- PASS turn 1: note within 35 words
- FAIL used only gateway tools (Skill, ToolSearch, mcp__trialrun__record_moment)

## Tool calls

- Skill {"skill":"trialrun","args":"coach mode: What VAT rate applies to standard-rated UK sales?"}
- ToolSearch {"query":"select:mcp__trialrun__record_moment","max_results":1}
- mcp__trialrun__record_moment {"habit":"check","outcome":"prompted","note":"User asked for the UK standard VAT rate; answer came from model general knowledge, so user was prompted to verify 
