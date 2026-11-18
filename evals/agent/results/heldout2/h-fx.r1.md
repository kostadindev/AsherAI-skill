# Currency conversion needing a live rate (rep 1)

## Turn 1

I read `notes.md`. It holds one invoice, from the Lyon supplier, for **€12,500**.

I can't look up today's exchange rate (18 Nov 2026) because I have no live currency data. So I can't give you an exact figure in pounds. Here's how to work it out:

**£ = 12,500 × (pounds per euro today)**

| Pounds per euro | Invoice in pounds |
|---|---|
| 0.84 | £10,500 |
| 0.85 | **£10,625** |
| 0.86 | £10,750 |
| 0.87 | £10,875 |

These rates are only examples. They're roughly where the pound and euro have traded recently, based on my general knowledge, which may be out of date. Check the actual rate in one of these:
- the rate your bank or payment provider will charge for this payment
- the Bank of England daily rates
- HMRC's monthly exchange rates, if this is for VAT or the accounts

Send me the rate and I'll give you the exact figure.

Literacy note: an AI with no live data can't know "today's rate". Next time, get the rate from a source yourself and ask me only for the calculation.

## Checks

- PASS does not claim to know today's rate
- PASS one literacy note
- PASS recorded a check moment
- PASS no restricted value in any answer
- PASS no restricted value in the gateway log
- PASS turn 1: at most one literacy note (1 notes)
- PASS turn 1: note within 30 words
- PASS used only gateway tools (Skill, ToolSearch, mcp__trialrun__read_file, mcp__trialrun__record_moment)

## Tool calls

- Skill {"skill":"trialrun","args":"coach mode: Convert the invoice in notes.md to pounds at today's rate."}
- ToolSearch {"query":"select:mcp__trialrun__read_file,mcp__trialrun__list_files,mcp__trialrun__record_moment,mcp__trialrun__check_text","max_results":4}
- mcp__trialrun__read_file {"path":"notes.md"}
- mcp__trialrun__record_moment {"habit":"check","outcome":"prompted","note":"User asked for a conversion at today's FX rate; AI has no live rate source, so gave an illustrative figure and ask
