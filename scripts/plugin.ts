/**
 * Structural checks for the plugin marketplace and the skill it ships, run in CI so a broken
 * manifest or a dangling reference never reaches users.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Limits from the Agent Skills spec: names are lowercase and hyphenated; descriptions drive triggering.
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_NAME = 64;
const MAX_DESCRIPTION = 1024;

interface PluginManifest { name?: string; version?: string; description?: string }
interface MarketplaceEntry extends PluginManifest { source?: string }
interface Marketplace { name?: string; plugins?: MarketplaceEntry[] }

function readJson<T>(path: string, errors: string[]): T | null {
  if (!existsSync(path)) { errors.push(`missing ${path}`); return null; }
  try { return JSON.parse(readFileSync(path, 'utf8')) as T; } catch (e) {
    errors.push(`${path} is not valid JSON: ${(e as Error).message}`);
    return null;
  }
}

/** Parses the YAML frontmatter fields this repo uses (single-line `key: value`). */
export function frontmatter(md: string): Record<string, string> | null {
  const m = md.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  return Object.fromEntries(m[1].split('\n').map((l) => l.match(/^([A-Za-z_-]+):\s*(.*)$/)).filter((x): x is RegExpMatchArray => !!x).map((x) => [x[1], x[2].trim()]));
}

function validateSkill(dir: string, errors: string[]): void {
  const path = join(dir, 'SKILL.md');
  if (!existsSync(path)) { errors.push(`missing ${path}`); return; }
  const md = readFileSync(path, 'utf8');
  const fm = frontmatter(md);
  if (!fm) { errors.push(`${path}: no frontmatter`); return; }
  if (!fm.name || !NAME_RE.test(fm.name) || fm.name.length > MAX_NAME) errors.push(`${path}: name "${fm.name ?? ''}" must be lowercase-hyphenated, ≤${MAX_NAME} chars`);
  if (!fm.description) errors.push(`${path}: description is required`);
  else if (fm.description.length > MAX_DESCRIPTION) errors.push(`${path}: description is ${fm.description.length} chars (max ${MAX_DESCRIPTION})`);
  for (const ref of new Set(md.match(/references\/[\w.-]+\.md/g) ?? [])) {
    if (!existsSync(join(dir, ref))) errors.push(`${path}: references missing file ${ref}`);
  }
}

export function validate(root: string): string[] {
  const errors: string[] = [];
  const market = readJson<Marketplace>(join(root, '.claude-plugin', 'marketplace.json'), errors);
  if (!market) return errors;
  if (!market.name) errors.push('marketplace.json: name is required');
  if (!market.plugins?.length) errors.push('marketplace.json: at least one plugin is required');
  for (const entry of market.plugins ?? []) {
    const src = join(root, entry.source ?? '');
    const manifest = readJson<PluginManifest>(join(src, '.claude-plugin', 'plugin.json'), errors);
    if (!manifest) continue;
    if (manifest.name !== entry.name) errors.push(`plugin name "${manifest.name}" doesn't match marketplace entry "${entry.name}"`);
    if (manifest.version !== entry.version) errors.push(`plugin ${entry.name}: version ${manifest.version} doesn't match marketplace ${entry.version}`);
    const skillsDir = join(src, 'skills');
    const skills = existsSync(skillsDir) ? readdirSync(skillsDir, { withFileTypes: true }).filter((d) => d.isDirectory()) : [];
    if (!skills.length) errors.push(`plugin ${entry.name}: no skills in ${skillsDir}`);
    for (const s of skills) validateSkill(join(skillsDir, s.name), errors);
  }
  return errors;
}
