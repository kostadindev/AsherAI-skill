# A fact from general knowledge (rep 3)

## Turn 1

UK sales that are standard-rated carry **20% VAT**. That rate has applied since 4 January 2011.

For comparison, the reduced rate is 5% (for example, domestic energy) and the zero rate is 0% (for example, most food and children's clothes). Some goods and services are exempt or outside the scope of VAT altogether.

Literacy note: this rate is from my general knowledge, not a source, and rates can change. Check GOV.UK's "VAT rates" page before relying on it.

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
- mcp__trialrun__record_moment {"habit":"check","outcome":"prompted","note":"Asked for the UK standard VAT rate; answer given from general knowledge with a prompt to verify on GOV.UK."}
