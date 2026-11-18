import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { frontmatter, validate } from './plugin.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SKILL = 'plugins/trialrun/skills/trialrun/SKILL.md';
const PLUGIN = 'plugins/trialrun/.claude-plugin/plugin.json';
const MARKET = '.claude-plugin/marketplace.json';

const temps: string[] = [];
afterEach(() => { for (const d of temps.splice(0)) rmSync(d, { recursive: true, force: true }); });

/** Copies the repo's plugin files into a temp dir so a test can break one thing. */
function copy(): string {
  const dir = mkdtempSync(join(tmpdir(), 'trialrun-plugin-'));
  temps.push(dir);
  cpSync(join(root, '.claude-plugin'), join(dir, '.claude-plugin'), { recursive: true });
  cpSync(join(root, 'plugins'), join(dir, 'plugins'), { recursive: true });
  return dir;
}

const editJson = (dir: string, file: string, f: (j: Record<string, unknown>) => Record<string, unknown>) =>
  writeFileSync(join(dir, file), JSON.stringify(f(JSON.parse(readFileSync(join(dir, file), 'utf8')))));
const editText = (dir: string, file: string, f: (t: string) => string) =>
  writeFileSync(join(dir, file), f(readFileSync(join(dir, file), 'utf8')));

describe('validate', () => {
  it('accepts this repo', () => {
    expect(validate(root)).toEqual([]);
  });

  it('accepts CRLF line endings in SKILL.md', () => {
    const dir = copy();
    editText(dir, SKILL, (t) => t.replace(/\n/g, '\r\n'));
    expect(validate(dir)).toEqual([]);
  });

  it('reports a version mismatch between plugin.json and the marketplace', () => {
    const dir = copy();
    editJson(dir, PLUGIN, (j) => ({ ...j, version: '9.9.9' }));
    expect(validate(dir).join('\n')).toMatch(/version 9\.9\.9 doesn't match/);
  });

  it('requires name, version and description in plugin.json even when the marketplace omits them too', () => {
    const dir = copy();
    editJson(dir, PLUGIN, () => ({}));
    editJson(dir, MARKET, (j) => ({ ...j, plugins: [{ source: './plugins/trialrun' }] }));
    const out = validate(dir).join('\n');
    for (const field of ['name', 'version', 'description']) expect(out).toContain(`"${field}" must be a non-empty string`);
  });

  it('rejects fields of the wrong type and a non-semver version', () => {
    const dir = copy();
    editJson(dir, PLUGIN, (j) => ({ ...j, name: 42, version: 'latest' }));
    const out = validate(dir).join('\n');
    expect(out).toContain('"name" must be a non-empty string');
    expect(out).toContain('must be semver');
  });

  it('requires a non-empty plugins array', () => {
    const dir = copy();
    editJson(dir, MARKET, (j) => ({ ...j, plugins: [] }));
    expect(validate(dir).join('\n')).toContain('"plugins" must be a non-empty array');
  });

  it('reports a dangling reference in SKILL.md', () => {
    const dir = copy();
    editText(dir, SKILL, (t) => `${t}\nSee references/missing.md.\n`);
    expect(validate(dir).join('\n')).toMatch(/references missing file references\/missing\.md/);
  });

  it('reports an invalid skill name', () => {
    const dir = copy();
    editText(dir, SKILL, (t) => t.replace(/^name: .*$/m, 'name: Trial Run'));
    expect(validate(dir).join('\n')).toMatch(/must be lowercase-hyphenated/);
  });
});

describe('frontmatter', () => {
  it('reads single-line fields with LF or CRLF and rejects files without frontmatter', () => {
    expect(frontmatter('---\nname: a\ndescription: b c\n---\nbody')).toEqual({ name: 'a', description: 'b c' });
    expect(frontmatter('---\r\nname: a\r\n---\r\nbody')).toEqual({ name: 'a' });
    expect(frontmatter('no frontmatter')).toBeNull();
  });
});
