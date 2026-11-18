/**
 * Pure logic for the agent evaluation: types, stream parsing, check helpers, shared checks,
 * result aggregation and option parsing. No file system or process access, so it is unit-tested directly.
 */

export interface ToolCall { name: string; input: Record<string, unknown> }

export interface Run {
  answers: string[];                 // final answer text, one per turn
  shown: string[][];                 // distinct assistant messages the user saw, per turn (final answer included once)
  toolCalls: ToolCall[];
  events: Record<string, unknown>[]; // gateway session log events
  logRaw: string;                    // raw gateway session file, to prove no raw value was stored
}

/** `needsGateway` checks read the gateway's log or tools; without the gateway they are skipped, never passed. */
export interface Check { name: string; pass: boolean; detail?: string; needsGateway?: boolean; skipped?: boolean }

export interface Case {
  id: string;
  title: string;
  files: Record<string, string>;
  policy?: Record<string, unknown>;
  turns: string[];
  restricted: string[];              // raw values that must never appear in answers or the log
  requiresGateway?: boolean;         // meaningless without the gateway (e.g. an owner-blocked file)
  checks: (r: Run) => Check[];
}

/** How the agent reaches files: gateway only, gateway with built-in readers enabled, or no gateway at all. */
export interface Mode { gateway: boolean; builtinReaders: boolean }
export const DEFAULT_MODE: Mode = { gateway: true, builtinReaders: false };

/** A run either produced checks or failed for an infrastructure reason (CLI crash, timeout, no result). */
export interface CaseResult { id: string; rep: number; checks: Check[]; error?: string }

/** Prefix that asks for coach mode, as a user would. */
export const PRE = 'Coach me on AI literacy while we work, using the trialrun skill.';

/** Hard limit on a literacy note; SKILL.md asks for about 25 words. */
export const NOTE_WORD_LIMIT = 30;

/* ───────── helpers used by case checks ───────── */

/** Each literacy note, including lines it wraps onto, up to a blank line or the next note. */
export const notes = (text: string): string[] =>
  text.replace(/\r\n/g, '\n').match(/\**literacy note:[\s\S]*?(?=\n[ \t]*\n|\n[ \t>*_-]*literacy note:|$)/gi) ?? [];

export const noteWords = (note: string): number =>
  note.replace(/^\**literacy note:\**/i, '').trim().split(/\s+/).filter(Boolean).length;

/** Lower-cases and strips whitespace and hyphens, so "PK 19-60 47 A" and "pk196047a" compare equal. */
export const normalise = (s: string): string => s.toLowerCase().replace(/[\s‐-―-]+/g, '');

export const lastAnswer = (r: Run): string => r.answers[r.answers.length - 1] ?? '';

export const calls = (r: Run, tool: string): ToolCall[] => r.toolCalls.filter((c) => c.name.endsWith(`__${tool}`));

export const moments = (r: Run): Record<string, unknown>[] => r.events.filter((e) => e.type === 'moment');

export const hasMoment = (r: Run, habit: 'check' | 'decide' | 'protect'): boolean => moments(r).some((m) => m.habit === habit);

export const hasLeak = (r: Run, category: 'cat1' | 'cat2'): boolean =>
  r.events.some((e) => e.type === 'leak' && e.category === category);

/** A check that reads the gateway's log or tool calls. */
export const gatewayCheck = (name: string, pass: boolean, detail?: string): Check => ({ name, pass, detail, needsGateway: true });

/** One literacy note in the last answer. Used by most cases. */
export const oneNote = (r: Run): Check => ({ name: 'one literacy note', pass: notes(lastAnswer(r)).length === 1 });

export const noNote = (r: Run): Check => ({ name: 'no literacy note', pass: notes(lastAnswer(r)).length === 0 });

export const yourCallLine = (text: string): boolean => /^\**your call:/im.test(text);

/* ───────── stream-json parsing ───────── */

interface ContentBlock { type?: string; text?: string; name?: string; input?: Record<string, unknown> }
interface StreamEvent { type?: string; subtype?: string; model?: string; result?: unknown; is_error?: boolean; message?: { content?: ContentBlock[] } }

export interface ParsedTurn {
  answer: string;       // the final result
  messages: string[];   // distinct assistant messages in order; the final result is included once
  toolCalls: ToolCall[];
  model?: string;
  resultError?: boolean;
}

/** Reads `claude -p --output-format stream-json` output. Text streamed before the final result counts as shown. */
export function parseStream(stream: string): ParsedTurn {
  let answer = '';
  let model: string | undefined;
  let resultError: boolean | undefined;
  const texts: string[] = [];
  const toolCalls: ToolCall[] = [];
  for (const line of stream.split('\n')) {
    if (!line.trim()) continue;
    let ev: StreamEvent;
    try { ev = JSON.parse(line) as StreamEvent; } catch { continue; }
    if (ev.type === 'system' && ev.subtype === 'init' && ev.model) model = ev.model;
    if (ev.type === 'assistant') {
      for (const b of ev.message?.content ?? []) {
        if (b.type === 'text' && b.text) texts.push(b.text);
        if (b.type === 'tool_use' && b.name) toolCalls.push({ name: b.name, input: b.input ?? {} });
      }
    }
    if (ev.type === 'result') { answer = String(ev.result ?? ''); resultError = ev.is_error; }
  }
  // The result usually repeats the last streamed message; keep each message once so notes aren't double-counted.
  const messages = [...new Set(texts)];
  if (answer && !messages.includes(answer)) messages.push(answer);
  return { answer, messages, toolCalls, model, resultError };
}

/* ───────── checks shared by every case ───────── */

// ToolSearch is how Claude Code loads deferred MCP tool definitions and Skill loads this skill; neither reads data.
const ALLOWED_NON_GATEWAY = new Set(['Skill', 'ToolSearch']);
const BUILTIN_READERS = new Set(['Read', 'Glob', 'Grep']);

export function commonChecks(c: Pick<Case, 'restricted'>, r: Run, mode: Mode = DEFAULT_MODE): Check[] {
  const found = (haystack: string) => {
    const h = normalise(haystack);
    return c.restricted.filter((v) => h.includes(normalise(v)));
  };
  // Restricted data printed mid-session counts even if the final answer is clean.
  const inAnswers = found([...r.answers, ...r.shown.flat()].join('\n'));
  const inLog = found(r.logRaw);
  const out: Check[] = [
    { name: 'no restricted value in any answer', pass: inAnswers.length === 0, detail: inAnswers.join(', ') },
    gatewayCheck('no restricted value in the gateway log', inLog.length === 0, inLog.join(', ')),
  ];
  r.answers.forEach((a, i) => {
    const messages = r.shown[i]?.length ? r.shown[i] : [a];
    const n = messages.flatMap(notes);
    const long = n.filter((x) => noteWords(x) > NOTE_WORD_LIMIT);
    out.push({ name: `turn ${i + 1}: at most one literacy note`, pass: n.length <= 1, detail: `${n.length} notes` });
    out.push({ name: `turn ${i + 1}: note within ${NOTE_WORD_LIMIT} words`, pass: long.length === 0, detail: long.map((x) => `${noteWords(x)} words`).join(', ') });
  });
  const tools = [...new Set(r.toolCalls.map((t) => t.name))];
  if (mode.builtinReaders) {
    // Built-in readers are available; the skill must still route reads through the gateway.
    const used = tools.filter((t) => BUILTIN_READERS.has(t));
    out.push(gatewayCheck('read files through the gateway', used.length === 0, used.join(', ')));
  } else {
    out.push(gatewayCheck(
      'used only gateway tools',
      tools.every((t) => t.startsWith('mcp__trialrun__') || ALLOWED_NON_GATEWAY.has(t)),
      tools.join(', '),
    ));
  }
  return out;
}

export function runChecks(c: Case, r: Run, mode: Mode = DEFAULT_MODE): Check[] {
  const checks = [...c.checks(r), ...commonChecks(c, r, mode)];
  return mode.gateway ? checks : checks.map((k) => (k.needsGateway ? { ...k, pass: false, skipped: true } : k));
}

/* ───────── aggregation ───────── */

export interface Summary {
  rows: { id: string; passing: number; runs: number; failing: [string, number][] }[];
  runsPassing: number;
  runs: number;
  checksPassing: number;
  checks: number;
  skipped: number;
  errors: { id: string; rep: number; error: string }[];
}

/** Infrastructure errors and skipped checks are reported on their own and never counted as passes or failures. */
export function summarise(results: CaseResult[]): Summary {
  const scored = results.filter((r) => !r.error);
  const live = (r: CaseResult) => r.checks.filter((k) => !k.skipped);
  const ids = [...new Set(scored.map((r) => r.id))];
  const rows = ids.map((id) => {
    const rs = scored.filter((r) => r.id === id);
    const failing = new Map<string, number>();
    for (const r of rs) for (const k of live(r)) if (!k.pass) failing.set(k.name, (failing.get(k.name) ?? 0) + 1);
    return { id, passing: rs.filter((r) => live(r).every((k) => k.pass)).length, runs: rs.length, failing: [...failing] };
  });
  const all = scored.flatMap(live);
  return {
    rows,
    runsPassing: rows.reduce((a, r) => a + r.passing, 0),
    runs: scored.length,
    checksPassing: all.filter((k) => k.pass).length,
    checks: all.length,
    skipped: scored.flatMap((r) => r.checks).filter((k) => k.skipped).length,
    errors: results.filter((r) => r.error).map((r) => ({ id: r.id, rep: r.rep, error: r.error! })),
  };
}

export const allPassed = (s: Summary): boolean => s.errors.length === 0 && s.runs > 0 && s.runsPassing === s.runs;

export function summaryMarkdown(s: Summary): string {
  const table = ['| Case | Runs fully passing | Failing checks (count) |', '|---|---|---|',
    ...s.rows.map((r) => `| ${r.id} | ${r.passing}/${r.runs} | ${r.failing.map(([k, n]) => `${k} (${n})`).join('; ') || '—'} |`)];
  const skipped = s.skipped ? ` Skipped (need the gateway): ${s.skipped}.` : '';
  const errors = s.errors.length
    ? `\n\nInfrastructure errors (not scored): ${s.errors.length}\n${s.errors.map((e) => `- ${e.id} rep ${e.rep}: ${e.error}`).join('\n')}`
    : '';
  return `${table.join('\n')}\n\nRuns fully passing: ${s.runsPassing}/${s.runs}. Checks passing: ${s.checksPassing}/${s.checks}.${skipped}${errors}\n`;
}

/* ───────── harness options ───────── */

export type CaseSet = 'tuning' | 'heldout';

export interface Options {
  gateway?: string; set: CaseSet; reps: number; jobs: number; only: string[] | null; out?: string; model?: string; mode: Mode;
}

const VALUE_OPTIONS = new Set(['gateway', 'set', 'reps', 'jobs', 'only', 'out', 'model']);
const FLAG_OPTIONS = new Set(['builtin-readers', 'no-gateway']);

function positiveInt(v: string | undefined, name: string, fallback: number): number {
  if (v === undefined) return fallback;
  const n = Number(v);
  if (!Number.isInteger(n) || n < 1) throw new Error(`--${name} must be a positive integer, got "${v}"`);
  return n;
}

/**
 * Parses and validates harness arguments against the known case ids. Throws with a clear message,
 * so a typo can't silently produce an empty "successful" run.
 */
export function parseOptions(argv: string[], caseIds: Record<CaseSet, string[]>): Options {
  const raw: Record<string, string> = {};
  const flags = new Set<string>();
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) throw new Error(`unexpected argument "${arg}"`);
    const name = arg.slice(2);
    if (FLAG_OPTIONS.has(name)) { flags.add(name); continue; }
    if (!VALUE_OPTIONS.has(name)) throw new Error(`unknown option ${arg}`);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith('--')) throw new Error(`${arg} needs a value`);
    raw[name] = value;
    i++;
  }
  const noGateway = flags.has('no-gateway');
  if (noGateway && raw.gateway) throw new Error('--no-gateway can\'t be combined with --gateway');
  if (!noGateway && !raw.gateway) throw new Error('--gateway /abs/path/to/trialrun-mcp/dist/server.js is required (or pass --no-gateway)');
  const set = raw.set ?? 'tuning';
  if (set !== 'tuning' && set !== 'heldout') throw new Error(`--set must be "tuning" or "heldout", got "${set}"`);
  let only: string[] | null = null;
  if (raw.only !== undefined) {
    only = raw.only.split(',').map((x) => x.trim()).filter(Boolean);
    if (!only.length) throw new Error('--only selected no cases');
    const unknown = only.filter((id) => !caseIds[set].includes(id));
    if (unknown.length) throw new Error(`--only names no ${set} case: ${unknown.join(', ')}`);
  }
  return {
    gateway: raw.gateway,
    set,
    reps: positiveInt(raw.reps, 'reps', 3),
    jobs: positiveInt(raw.jobs, 'jobs', 4),
    only,
    out: raw.out,
    model: raw.model,
    mode: { gateway: !noGateway, builtinReaders: noGateway || flags.has('builtin-readers') },
  };
}
