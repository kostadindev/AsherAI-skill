# A fact from general knowledge (rep 1)

## Turn 1

The standard rate of UK VAT is **20%**. It has been 20% since 4 January 2011.

- **VAT-exclusive price:** VAT = net × 20%, and the gross price = net × 1.2.
- **VAT-inclusive price:** VAT = gross × 1/6, because 20/120 = 1/6.

Some goods and services aren't charged at 20%. Domestic energy and children's car seats are charged at the reduced rate of 5%. Most food, books and children's clothes are zero-rated at 0%. Some supplies, like insurance and certain financial services, are exempt.

Literacy note: this rate comes from my general knowledge, not a source I checked. Check it on GOV.UK ("VAT rates") before using it in real work.

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
- mcp__trialrun__record_moment {"habit":"check","outcome":"prompted","note":"Asked for the UK standard VAT rate; answer came from the assistant's general knowledge, so the user was told to ch
