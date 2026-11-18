/**
 * Runs the agent cases through real `claude -p` sessions and scores them.
 *
 *   npm run agent -- --gateway /abs/path/trialrun-mcp/dist/server.js [--set heldout] [--reps 3] [--only id,id] [--jobs 4] [--out dir]
 *
 * Needs a signed-in Claude Code CLI, so it runs manually, not in CI. Each run gets a fresh temp workspace,
 * a fresh project with the skill installed, and the gateway connected over MCP. Built-in file tools are
 * disabled so every read goes through the gateway.
 */
import { spawn } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CASES } from './cases.ts';
import { HELDOUT } from './cases-heldout.ts';
import { parseStream, runChecks, summarise, summaryMarkdown, type Case, type CaseResult, type Check, type Run } from './lib.ts';

const here = dirname(fileURLToPath(import.meta.url));
const SKILL = resolve(here, '../../plugins/trialrun/skills/trialrun');
const DISALLOWED = 'Read,Bash,Grep,Glob,Write,Edit,MultiEdit,NotebookEdit,WebSearch,WebFetch,Task,Agent';
const TURN_TIMEOUT_MS = 240_000;

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) if (argv[i].startsWith('--')) out[argv[i].slice(2)] = argv[i + 1] ?? '';
  return out;
}

const args = parseArgs(process.argv.slice(2));
const gateway = args.gateway;
if (!gateway || !existsSync(gateway)) {
  console.error('Pass --gateway /abs/path/to/trialrun-mcp/dist/server.js');
  process.exit(2);
}
const reps = Number(args.reps ?? 3);
const jobs = Number(args.jobs ?? 4);
const only = args.only ? args.only.split(',') : null;
const outDir = resolve(args.out ?? join(here, 'results', new Date().toISOString().replace(/[:.]/g, '-')));
mkdirSync(outDir, { recursive: true });

function claude(cwd: string, prompt: string, continueSession: boolean): Promise<string> {
  const a = ['-p', prompt, '--output-format', 'stream-json', '--verbose', '--mcp-config', 'mcp.json',
    '--allowedTools', 'mcp__trialrun__*,Skill', '--disallowedTools', DISALLOWED];
  if (continueSession) a.splice(1, 0, '--continue');
  return new Promise((done) => {
    const p = spawn('claude', a, { cwd, stdio: ['ignore', 'pipe', 'ignore'] });
    let out = '';
    p.stdout.on('data', (d) => { out += d; });
    const timer = setTimeout(() => p.kill('SIGKILL'), TURN_TIMEOUT_MS);
    p.on('close', () => { clearTimeout(timer); done(out); });
  });
}

function transcript(c: Case, rep: number, run: Run, checks: Check[], root: string): string {
  const body = [
    `# ${c.title} (rep ${rep})`,
    ...run.answers.map((a, i) => `## Turn ${i + 1}\n\n${a}`),
    `## Checks\n\n${checks.map((k) => `- ${k.pass ? 'PASS' : 'FAIL'} ${k.name}${k.detail ? ` (${k.detail})` : ''}`).join('\n')}`,
    `## Tool calls\n\n${run.toolCalls.map((t) => `- ${t.name} ${JSON.stringify(t.input).slice(0, 160)}`).join('\n')}`,
  ].join('\n\n');
  // Published transcripts must not carry local paths.
  return `${body.split(root).join('<tmp>')}\n`;
}

async function runCase(c: Case, rep: number): Promise<CaseResult> {
  const root = mkdtempSync(join(tmpdir(), `trialrun-${c.id}-`));
  const ws = join(root, 'work');
  const proj = join(root, 'proj');
  mkdirSync(ws);
  mkdirSync(join(proj, '.claude', 'skills'), { recursive: true });
  for (const [f, body] of Object.entries(c.files)) writeFileSync(join(ws, f), body);
  if (c.policy) writeFileSync(join(ws, '.trialrun.json'), JSON.stringify(c.policy, null, 2));
  cpSync(SKILL, join(proj, '.claude', 'skills', 'trialrun'), { recursive: true });
  writeFileSync(join(proj, 'mcp.json'), JSON.stringify({ mcpServers: { trialrun: { command: 'node', args: [gateway], env: { TRIALRUN_WORKSPACE: ws } } } }));

  const run: Run = { answers: [], toolCalls: [], events: [], logRaw: '' };
  for (const [i, turn] of c.turns.entries()) {
    const raw = await claude(proj, turn, i > 0);
    writeFileSync(join(outDir, `${c.id}.r${rep}.t${i + 1}.jsonl`), raw); // local only; git-ignored
    const parsed = parseStream(raw);
    run.answers.push(parsed.answer);
    run.toolCalls.push(...parsed.toolCalls);
  }
  const log = join(ws, '.trialrun-session.json');
  if (existsSync(log)) {
    run.logRaw = readFileSync(log, 'utf8');
    run.events = (JSON.parse(run.logRaw) as { events?: Record<string, unknown>[] }).events ?? [];
  }
  const checks = runChecks(c, run);
  writeFileSync(join(outDir, `${c.id}.r${rep}.md`), transcript(c, rep, run, checks, root));
  return { id: c.id, rep, checks };
}

const set = args.set === 'heldout' ? HELDOUT : CASES;
const queue = set
  .filter((c) => !only || only.includes(c.id))
  .flatMap((c) => Array.from({ length: reps }, (_, r) => () => runCase(c, r + 1)));
const results: CaseResult[] = [];
let next = 0;
await Promise.all(Array.from({ length: jobs }, async () => {
  while (next < queue.length) {
    const r = await queue[next++]();
    results.push(r);
    const failed = r.checks.filter((k) => !k.pass);
    console.log(`${failed.length ? 'FAIL' : 'pass'} ${r.id} rep ${r.rep}${failed.length ? `: ${failed.map((k) => k.name).join('; ')}` : ''}`);
  }
}));

const summary = summaryMarkdown(summarise(results));
writeFileSync(join(outDir, 'summary.md'), summary);
writeFileSync(join(outDir, 'results.json'), JSON.stringify(results, null, 2));
console.log(`\n${summary}\nOutputs: ${outDir}`);
