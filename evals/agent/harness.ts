/**
 * Runs the agent cases through real `claude -p` sessions and scores them. `--set heldout` runs the held-out cases.
 *
 *   node evals/agent/harness.ts --gateway /abs/path/trialrun-mcp/dist/server.js [--reps 3] [--only id,id] [--jobs 4] [--out evals/agent/results/<name>]
 *
 * Requires the Claude Code CLI (`claude`) signed in. Each case gets a fresh temp workspace,
 * a fresh project with the skill installed, and the gateway connected over MCP.
 */
import { spawn } from 'node:child_process';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CASES, common, type Case, type Check, type Run } from './cases.ts';
import { HELDOUT } from './cases-heldout.ts';

const here = dirname(fileURLToPath(import.meta.url));
const SKILL = resolve(here, '../../plugins/trialrun/skills/trialrun');
const args = Object.fromEntries(process.argv.slice(2).reduce<[string, string][]>((a, v, i, arr) => (v.startsWith('--') ? [...a, [v.slice(2), arr[i + 1] ?? '']] : a), []));
const GATEWAY = args.gateway;
if (!GATEWAY || !existsSync(GATEWAY)) { console.error('Pass --gateway /abs/path/to/trialrun-mcp/dist/server.js'); process.exit(2); }
const REPS = Number(args.reps ?? 3);
const JOBS = Number(args.jobs ?? 4);
const ONLY = args.only ? args.only.split(',') : null;
const OUT = resolve(args.out ?? join(here, 'results', new Date().toISOString().replace(/[:.]/g, '-')));
mkdirSync(OUT, { recursive: true });

const DISALLOWED = 'Read,Bash,Grep,Glob,Write,Edit,MultiEdit,NotebookEdit,WebSearch,WebFetch,Task,Agent';

function claude(cwd: string, prompt: string, cont: boolean): Promise<string> {
  const a = ['-p', prompt, '--output-format', 'stream-json', '--verbose', '--mcp-config', 'mcp.json',
    '--allowedTools', 'mcp__trialrun__*,Skill', '--disallowedTools', DISALLOWED];
  if (cont) a.splice(1, 0, '--continue');
  return new Promise((res) => {
    const p = spawn('claude', a, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    p.stdout.on('data', (d) => { out += d; });
    p.stderr.on('data', () => {});
    const timer = setTimeout(() => p.kill('SIGKILL'), 240_000);
    p.on('close', () => { clearTimeout(timer); res(out); });
  });
}

function parse(stream: string) {
  let answer = '';
  const toolCalls: Run['toolCalls'] = [];
  for (const line of stream.split('\n')) {
    if (!line.trim()) continue;
    let ev: any;
    try { ev = JSON.parse(line); } catch { continue; }
    if (ev.type === 'assistant') for (const b of ev.message?.content ?? []) if (b.type === 'tool_use') toolCalls.push({ name: b.name, input: b.input ?? {} });
    if (ev.type === 'result') answer = String(ev.result ?? '');
  }
  return { answer, toolCalls };
}

async function runCase(c: Case, rep: number): Promise<{ id: string; rep: number; checks: Check[]; run: Run }> {
  const root = mkdtempSync(join(tmpdir(), `trialrun-${c.id}-`));
  const ws = join(root, 'work');
  const proj = join(root, 'proj');
  mkdirSync(ws); mkdirSync(join(proj, '.claude', 'skills'), { recursive: true });
  for (const [f, body] of Object.entries(c.files)) writeFileSync(join(ws, f), body);
  if (c.policy) writeFileSync(join(ws, '.trialrun.json'), JSON.stringify(c.policy, null, 2));
  cpSync(SKILL, join(proj, '.claude', 'skills', 'trialrun'), { recursive: true });
  writeFileSync(join(proj, 'mcp.json'), JSON.stringify({ mcpServers: { trialrun: { command: 'node', args: [GATEWAY], env: { TRIALRUN_WORKSPACE: ws } } } }));

  const run: Run = { answers: [], toolCalls: [], events: [], logRaw: '' };
  for (const [i, t] of c.turns.entries()) {
    const raw = await claude(proj, t, i > 0);
    writeFileSync(join(OUT, `${c.id}.r${rep}.t${i + 1}.jsonl`), raw);
    const p = parse(raw);
    run.answers.push(p.answer);
    run.toolCalls.push(...p.toolCalls);
  }
  const log = join(ws, '.trialrun-session.json');
  if (existsSync(log)) { run.logRaw = readFileSync(log, 'utf8'); run.events = JSON.parse(run.logRaw).events ?? []; }
  const checks = [...c.checks(run), ...common(c, run)];
  writeFileSync(join(OUT, `${c.id}.r${rep}.md`), `# ${c.title} (rep ${rep})\n\n${run.answers.map((a, i) => `## Turn ${i + 1}\n\n${a}`).join('\n\n')}\n\n## Checks\n\n${checks.map((k) => `- ${k.pass ? 'PASS' : 'FAIL'} ${k.name}${k.detail ? ` (${k.detail})` : ''}`).join('\n')}\n\n## Tool calls\n\n${run.toolCalls.map((t) => `- ${t.name} ${JSON.stringify(t.input).slice(0, 160)}`).join('\n')}\n`);
  return { id: c.id, rep, checks, run };
}

const SET = args.set === 'heldout' ? HELDOUT : CASES;
const jobs = SET.filter((c) => !ONLY || ONLY.includes(c.id)).flatMap((c) => Array.from({ length: REPS }, (_, r) => () => runCase(c, r + 1)));
const results: Awaited<ReturnType<typeof runCase>>[] = [];
let next = 0;
await Promise.all(Array.from({ length: JOBS }, async () => {
  while (next < jobs.length) {
    const j = jobs[next++];
    const r = await j();
    results.push(r);
    const failed = r.checks.filter((k) => !k.pass);
    console.log(`${failed.length ? 'FAIL' : 'pass'} ${r.id} rep ${r.rep}${failed.length ? `: ${failed.map((k) => k.name).join('; ')}` : ''}`);
  }
}));

// Summary: per case, share of reps where every check passed; per check, pass rate.
const ids = [...new Set(results.map((r) => r.id))];
const lines = ['| Case | Runs fully passing | Failing checks (count) |', '|---|---|---|'];
let totalPass = 0;
for (const id of ids) {
  const rs = results.filter((r) => r.id === id);
  const ok = rs.filter((r) => r.checks.every((k) => k.pass)).length;
  totalPass += ok;
  const fails = new Map<string, number>();
  for (const r of rs) for (const k of r.checks) if (!k.pass) fails.set(k.name, (fails.get(k.name) ?? 0) + 1);
  lines.push(`| ${id} | ${ok}/${rs.length} | ${[...fails].map(([k, n]) => `${k} (${n})`).join('; ') || '—'} |`);
}
const checksAll = results.flatMap((r) => r.checks);
const summary = `${lines.join('\n')}\n\nRuns fully passing: ${totalPass}/${results.length}. Checks passing: ${checksAll.filter((k) => k.pass).length}/${checksAll.length}.\n`;
writeFileSync(join(OUT, 'summary.md'), summary);
writeFileSync(join(OUT, 'results.json'), JSON.stringify(results.map((r) => ({ id: r.id, rep: r.rep, checks: r.checks })), null, 2));
console.log(`\n${summary}\nOutputs: ${OUT}`);
