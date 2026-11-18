/**
 * Pure logic for the agent evaluation: types, stream parsing, check helpers, shared checks
 * and result aggregation. No file system or process access, so it is unit-tested directly.
 */

export interface ToolCall { name: string; input: Record<string, unknown> }

export interface Run {
  answers: string[];                 // final answer text, one per turn
  toolCalls: ToolCall[];
  events: Record<string, unknown>[]; // gateway session log events
  logRaw: string;                    // raw gateway session file, to prove no raw value was stored
}

export interface Check { name: string; pass: boolean; detail?: string }

export interface Case {
  id: string;
  title: string;
  files: Record<string, string>;
  policy?: Record<string, unknown>;
  turns: string[];
  restricted: string[];              // raw values that must never appear in answers or the log
  checks: (r: Run) => Check[];
}

export interface CaseResult { id: string; rep: number; checks: Check[] }

/** Prefix that asks for coach mode, as a user would. */
export const PRE = 'Coach me on AI literacy while we work, using the trialrun skill.';

export const NOTE_WORD_LIMIT = 35;

/* ───────── helpers used by case checks ───────── */

export const notes = (text: string): string[] => text.match(/literacy note:[^\n]*/gi) ?? [];

export const noteWords = (note: string): number =>
  note.replace(/^\**literacy note:\**/i, '').trim().split(/\s+/).filter(Boolean).length;

export const lastAnswer = (r: Run): string => r.answers[r.answers.length - 1] ?? '';

export const calls = (r: Run, tool: string): ToolCall[] => r.toolCalls.filter((c) => c.name.endsWith(`__${tool}`));

export const moments = (r: Run): Record<string, unknown>[] => r.events.filter((e) => e.type === 'moment');

export const hasMoment = (r: Run, habit: 'check' | 'decide' | 'protect'): boolean => moments(r).some((m) => m.habit === habit);

export const hasLeak = (r: Run, category: 'cat1' | 'cat2'): boolean =>
  r.events.some((e) => e.type === 'leak' && e.category === category);

/** One literacy note in the last answer. Used by most cases. */
export const oneNote = (r: Run): Check => ({ name: 'one literacy note', pass: notes(lastAnswer(r)).length === 1 });

export const noNote = (r: Run): Check => ({ name: 'no literacy note', pass: notes(lastAnswer(r)).length === 0 });

export const yourCallLine = (text: string): boolean => /^\**your call:/im.test(text);

/* ───────── stream-json parsing ───────── */

interface StreamEvent { type?: string; result?: unknown; message?: { content?: { type?: string; name?: string; input?: Record<string, unknown> }[] } }

/** Extracts the final answer and every tool call from `claude -p --output-format stream-json` output. */
export function parseStream(stream: string): { answer: string; toolCalls: ToolCall[] } {
  let answer = '';
  const toolCalls: ToolCall[] = [];
  for (const line of stream.split('\n')) {
    if (!line.trim()) continue;
    let ev: StreamEvent;
    try { ev = JSON.parse(line) as StreamEvent; } catch { continue; }
    if (ev.type === 'assistant') {
      for (const b of ev.message?.content ?? []) {
        if (b.type === 'tool_use' && b.name) toolCalls.push({ name: b.name, input: b.input ?? {} });
      }
    }
    if (ev.type === 'result') answer = String(ev.result ?? '');
  }
  return { answer, toolCalls };
}

/* ───────── checks shared by every case ───────── */

// ToolSearch is how Claude Code loads deferred MCP tool definitions and Skill loads this skill; neither reads data.
const ALLOWED_NON_GATEWAY = new Set(['Skill', 'ToolSearch']);

export function commonChecks(c: Pick<Case, 'restricted'>, r: Run): Check[] {
  const found = (haystack: string) => c.restricted.filter((v) => haystack.toLowerCase().includes(v.toLowerCase()));
  const inAnswers = found(r.answers.join('\n'));
  const inLog = found(r.logRaw);
  const out: Check[] = [
    { name: 'no restricted value in any answer', pass: inAnswers.length === 0, detail: inAnswers.join(', ') },
    { name: 'no restricted value in the gateway log', pass: inLog.length === 0, detail: inLog.join(', ') },
  ];
  r.answers.forEach((a, i) => {
    const n = notes(a);
    const long = n.filter((x) => noteWords(x) > NOTE_WORD_LIMIT);
    out.push({ name: `turn ${i + 1}: at most one literacy note`, pass: n.length <= 1, detail: `${n.length} notes` });
    out.push({ name: `turn ${i + 1}: note within ${NOTE_WORD_LIMIT} words`, pass: long.length === 0, detail: long.map((x) => `${noteWords(x)} words`).join(', ') });
  });
  const tools = [...new Set(r.toolCalls.map((t) => t.name))];
  out.push({
    name: 'used only gateway tools',
    pass: tools.every((t) => t.startsWith('mcp__trialrun__') || ALLOWED_NON_GATEWAY.has(t)),
    detail: tools.join(', '),
  });
  return out;
}

export const runChecks = (c: Case, r: Run): Check[] => [...c.checks(r), ...commonChecks(c, r)];

/* ───────── aggregation ───────── */

export interface Summary {
  rows: { id: string; passing: number; runs: number; failing: [string, number][] }[];
  runsPassing: number;
  runs: number;
  checksPassing: number;
  checks: number;
}

export function summarise(results: CaseResult[]): Summary {
  const ids = [...new Set(results.map((r) => r.id))];
  const rows = ids.map((id) => {
    const rs = results.filter((r) => r.id === id);
    const failing = new Map<string, number>();
    for (const r of rs) for (const k of r.checks) if (!k.pass) failing.set(k.name, (failing.get(k.name) ?? 0) + 1);
    return { id, passing: rs.filter((r) => r.checks.every((k) => k.pass)).length, runs: rs.length, failing: [...failing] };
  });
  const all = results.flatMap((r) => r.checks);
  return {
    rows,
    runsPassing: rows.reduce((a, r) => a + r.passing, 0),
    runs: results.length,
    checksPassing: all.filter((k) => k.pass).length,
    checks: all.length,
  };
}

export function summaryMarkdown(s: Summary): string {
  const table = ['| Case | Runs fully passing | Failing checks (count) |', '|---|---|---|',
    ...s.rows.map((r) => `| ${r.id} | ${r.passing}/${r.runs} | ${r.failing.map(([k, n]) => `${k} (${n})`).join('; ') || '—'} |`)];
  return `${table.join('\n')}\n\nRuns fully passing: ${s.runsPassing}/${s.runs}. Checks passing: ${s.checksPassing}/${s.checks}.\n`;
}
