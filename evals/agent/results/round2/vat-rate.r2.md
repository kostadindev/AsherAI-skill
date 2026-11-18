# A fact from general knowledge (rep 2)

## Turn 1

Standard-rated UK sales are charged VAT at **20%**. That rate has applied since 4 January 2011.

- **Adding VAT to a net price:** net × 1.20. For example, £1,000 becomes £1,200, of which £200 is VAT.
- **Finding the VAT in a gross price:** gross × 1/6. For example, £1,200 includes £200 of VAT.

The other UK rates are 5% (reduced) and 0% (zero-rated). Some items are exempt. Check that what you're selling really is standard-rated.

Literacy note: this 20% comes from my general knowledge, not a source, and it may be out of date. Check GOV.UK ("VAT rates") before relying on it.

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
- mcp__trialrun__record_moment {"habit":"check","outcome":"prompted","note":"User asked for the UK standard VAT rate; answered from general knowledge and prompted them to confirm it on GOV.UK
