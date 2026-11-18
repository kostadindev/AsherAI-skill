/**
 * Runs the agent cases through real `claude -p` sessions and scores them.
 *
 *   npm run agent -- --gateway /abs/path/trialrun-mcp/dist/server.js [--set tuning|heldout] [--reps 3] [--jobs 4] [--only id,id] [--model id] [--out dir]
 *
 * Needs a signed-in Claude Code CLI, so it runs manually, not in CI. Each run gets a fresh temp workspace,
 * a fresh project with the skill installed, and the gateway connected over MCP. Built-in file tools are
 * disabled so every read goes through the gateway. Exits non-zero if any check fails or any run errors.
 */
import { execFileSync, spawn } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CASES } from './cases.ts';
import { HELDOUT } from './cases-heldout.ts';
import {
  allPassed, parseOptions, parseStream, runChecks, summarise, summaryMarkdown,
  type Case, type CaseResult, type Check, type Options, type Run,
} from './lib.ts';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../..');
const SKILL = join(repoRoot, 'plugins/trialrun/skills/trialrun');
const DISALLOWED = 'Read,Bash,Grep,Glob,Write,Edit,MultiEdit,NotebookEdit,WebSearch,WebFetch,Task,Agent';
const TURN_TIMEOUT_MS = 240_000;

let opts: Options;
try {
  opts = parseOptions(process.argv.slice(2), { tuning: CASES.map((c) => c.id), heldout: HELDOUT.map((c) => c.id) });
  if (!existsSync(opts.gateway)) throw new Error(`gateway not found: ${opts.gateway}`);
} catch (e) {
  console.error((e as Error).message);
  process.exit(2);
}
const outDir = resolve(opts.out ?? join(here, 'results', new Date().toISOString().replace(/[:.]/g, '-')));
mkdirSync(outDir, { recursive: true });

/** Output of a command, or a marker when it can't be run (e.g. not a git checkout). */
function capture(cmd: string, args: string[], cwd?: string): string {
  try { return execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return 'unknown'; }
}
const gitRevision = (dir: string) => {
  const rev = capture('git', ['rev-parse', '--short', 'HEAD'], dir);
  const dirty = capture('git', ['status', '--porcelain'], dir);
  return rev === 'unknown' ? rev : `${rev}${dirty && dirty !== 'unknown' ? '-dirty' : ''}`;
};

interface TurnOutput { stdout: string; error?: string }

function claude(cwd: string, prompt: string, continueSession: boolean): Promise<TurnOutput> {
  const a = ['-p', prompt, '--output-format', 'stream-json', '--verbose', '--mcp-config', 'mcp.json',
    '--allowedTools', 'mcp__trialrun__*,Skill', '--disallowedTools', DISALLOWED];
  if (opts.model) a.push('--model', opts.model);
  if (continueSession) a.splice(1, 0, '--continue');
  return new Promise((done) => {
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    const p = spawn('claude', a, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    p.stdout.on('data', (d) => { stdout += d; });
    p.stderr.on('data', (d) => { stderr += d; });
    const timer = setTimeout(() => { timedOut = true; p.kill('SIGKILL'); }, TURN_TIMEOUT_MS);
    p.on('error', (e) => { clearTimeout(timer); done({ stdout, error: `could not start claude: ${e.message}` }); });
    p.on('close', (code) => {
      clearTimeout(timer);
      if (timedOut) done({ stdout, error: `timed out after ${TURN_TIMEOUT_MS / 1000}s` });
      else if (code !== 0) done({ stdout, error: `claude exited ${code}: ${stderr.trim().split('\n').slice(-1)[0] ?? ''}` });
      else done({ stdout });
    });
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

const models = new Set<string>();

async function runCase(c: Case, rep: number): Promise<CaseResult> {
  const root = mkdtempSync(join(tmpdir(), `trialrun-${c.id}-`));
  try {
    const ws = join(root, 'work');
    const proj = join(root, 'proj');
    mkdirSync(ws);
    mkdirSync(join(proj, '.claude', 'skills'), { recursive: true });
    for (const [f, body] of Object.entries(c.files)) writeFileSync(join(ws, f), body);
    if (c.policy) writeFileSync(join(ws, '.trialrun.json'), JSON.stringify(c.policy, null, 2));
    cpSync(SKILL, join(proj, '.claude', 'skills', 'trialrun'), { recursive: true });
    writeFileSync(join(proj, 'mcp.json'), JSON.stringify({ mcpServers: { trialrun: { command: 'node', args: [opts.gateway], env: { TRIALRUN_WORKSPACE: ws } } } }));

    const run: Run = { answers: [], shown: [], toolCalls: [], events: [], logRaw: '' };
    for (const [i, turn] of c.turns.entries()) {
      const out = await claude(proj, turn, i > 0);
      writeFileSync(join(outDir, `${c.id}.r${rep}.t${i + 1}.jsonl`), out.stdout); // local only; git-ignored
      if (out.error) return { id: c.id, rep, checks: [], error: `turn ${i + 1}: ${out.error}` };
      const parsed = parseStream(out.stdout);
      if (parsed.model) models.add(parsed.model);
      if (parsed.resultError || !parsed.answer) return { id: c.id, rep, checks: [], error: `turn ${i + 1}: session ended without a result` };
      run.answers.push(parsed.answer);
      run.shown.push(parsed.shown);
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
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

const cases = (opts.set === 'heldout' ? HELDOUT : CASES).filter((c) => !opts.only || opts.only.includes(c.id));
const queue = cases.flatMap((c) => Array.from({ length: opts.reps }, (_, r) => () => runCase(c, r + 1)));
const startedAt = new Date().toISOString();
const results: CaseResult[] = [];
let next = 0;
await Promise.all(Array.from({ length: opts.jobs }, async () => {
  while (next < queue.length) {
    const r = await queue[next++]();
    results.push(r);
    const failed = r.checks.filter((k) => !k.pass);
    const status = r.error ? `ERROR ${r.error}` : failed.length ? `FAIL: ${failed.map((k) => k.name).join('; ')}` : 'pass';
    console.log(`${r.id} rep ${r.rep}: ${status}`);
  }
}));

const summary = summarise(results);
const meta = {
  startedAt,
  set: opts.set,
  reps: opts.reps,
  models: [...models],
  claudeCli: capture('claude', ['--version']),
  skillRevision: gitRevision(repoRoot),
  gatewayRevision: gitRevision(dirname(resolve(opts.gateway))),
  node: process.version,
};
writeFileSync(join(outDir, 'summary.md'), `${summaryMarkdown(summary)}\nModel: ${meta.models.join(', ') || 'unknown'}. Claude Code ${meta.claudeCli}. Skill ${meta.skillRevision}, gateway ${meta.gatewayRevision}.\n`);
writeFileSync(join(outDir, 'results.json'), JSON.stringify({ meta, results }, null, 2));
console.log(`\n${summaryMarkdown(summary)}\nOutputs: ${outDir}`);
process.exit(allPassed(summary) ? 0 : 1);
