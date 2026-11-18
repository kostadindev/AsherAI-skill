import { cpSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { frontmatter, validate } from './plugin.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SKILL = 'plugins/trialrun/skills/trialrun/SKILL.md';

/** Copies the repo's plugin files into a temp dir so a test can break one thing. */
function copy(): string {
  const dir = mkdtempSync(join(tmpdir(), 'trialrun-plugin-'));
  cpSync(join(root, '.claude-plugin'), join(dir, '.claude-plugin'), { recursive: true });
  cpSync(join(root, 'plugins'), join(dir, 'plugins'), { recursive: true });
  return dir;
}

describe('validate', () => {
  it('accepts this repo', () => {
    expect(validate(root)).toEqual([]);
  });

  it('reports a version mismatch between plugin.json and the marketplace', () => {
    const dir = copy();
    const p = join(dir, 'plugins/trialrun/.claude-plugin/plugin.json');
    writeFileSync(p, JSON.stringify({ ...JSON.parse(readFileSync(p, 'utf8')), version: '9.9.9' }));
    expect(validate(dir).join('\n')).toMatch(/version 9\.9\.9 doesn't match/);
  });

  it('reports a dangling reference in SKILL.md', () => {
    const dir = copy();
    const p = join(dir, SKILL);
    writeFileSync(p, `${readFileSync(p, 'utf8')}\nSee references/missing.md.\n`);
    expect(validate(dir).join('\n')).toMatch(/references missing file references\/missing\.md/);
  });

  it('reports an invalid skill name', () => {
    const dir = copy();
    const p = join(dir, SKILL);
    writeFileSync(p, readFileSync(p, 'utf8').replace(/^name: .*$/m, 'name: Trial Run'));
    expect(validate(dir).join('\n')).toMatch(/must be lowercase-hyphenated/);
  });
});

describe('frontmatter', () => {
  it('reads single-line fields and rejects files without frontmatter', () => {
    expect(frontmatter('---\nname: a\ndescription: b c\n---\nbody')).toEqual({ name: 'a', description: 'b c' });
    expect(frontmatter('no frontmatter')).toBeNull();
  });
});
