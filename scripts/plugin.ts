/**
 * Structural checks for the plugin marketplace and the skill it ships, run in CI so a broken
 * manifest or a dangling reference never reaches users.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseDocument } from 'yaml';

// Limits from the Agent Skills spec: names are lowercase and hyphenated; descriptions drive triggering.
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const VERSION_RE = /^\d+\.\d+\.\d+(-[\w.]+)?$/;
const MAX_NAME = 64;
const MAX_DESCRIPTION = 1024;

type Json = Record<string, unknown>;

function readJson(path: string, errors: string[]): Json | null {
  if (!existsSync(path)) { errors.push(`missing ${path}`); return null; }
  try {
    const v: unknown = JSON.parse(readFileSync(path, 'utf8'));
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) return v as Json;
    errors.push(`${path} must hold a JSON object`);
  } catch (e) {
    errors.push(`${path} is not valid JSON: ${(e as Error).message}`);
  }
  return null;
}

/** Records an error unless `obj[key]` is a non-empty string; returns the string or undefined. */
function requireString(obj: Json, key: string, where: string, errors: string[]): string | undefined {
  const v = obj[key];
  if (typeof v === 'string' && v.trim()) return v;
  errors.push(`${where}: "${key}" must be a non-empty string`);
  return undefined;
}

function checkName(name: string | undefined, where: string, errors: string[]): void {
  if (name !== undefined && (!NAME_RE.test(name) || name.length > MAX_NAME)) errors.push(`${where}: name "${name}" must be lowercase-hyphenated, ≤${MAX_NAME} chars`);
}

function checkVersion(version: string | undefined, where: string, errors: string[]): void {
  if (version !== undefined && !VERSION_RE.test(version)) errors.push(`${where}: version "${version}" must be semver (x.y.z)`);
}

/**
 * Parses SKILL.md frontmatter as YAML (LF or CRLF). Returns null when there is no frontmatter block and
 * throws on invalid YAML, e.g. an unquoted value containing ": ".
 */
export function frontmatter(md: string): Record<string, unknown> | null {
  const m = md.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const doc = parseDocument(m[1], { prettyErrors: false });
  if (doc.errors.length) throw new Error(doc.errors[0].message);
  const v: unknown = doc.toJS();
  if (typeof v !== 'object' || v === null || Array.isArray(v)) throw new Error('frontmatter must be a mapping');
  return v as Record<string, unknown>;
}

function validateSkill(dir: string, errors: string[]): void {
  const path = join(dir, 'SKILL.md');
  if (!existsSync(path)) { errors.push(`missing ${path}`); return; }
  const md = readFileSync(path, 'utf8');
  let fm: Record<string, unknown> | null;
  try { fm = frontmatter(md); } catch (e) {
    errors.push(`${path}: frontmatter is not valid YAML: ${(e as Error).message}`);
    return;
  }
  if (!fm) { errors.push(`${path}: no frontmatter`); return; }
  const name = typeof fm.name === 'string' ? fm.name : undefined;
  if (!name) errors.push(`${path}: name must be a non-empty string`);
  checkName(name, path, errors);
  const description = typeof fm.description === 'string' ? fm.description.trim() : '';
  if (!description) errors.push(`${path}: description must be a non-empty string`);
  else if (description.length > MAX_DESCRIPTION) errors.push(`${path}: description is ${description.length} chars (max ${MAX_DESCRIPTION})`);
  for (const ref of new Set(md.match(/references\/[\w.-]+\.md/g) ?? [])) {
    if (!existsSync(join(dir, ref))) errors.push(`${path}: references missing file ${ref}`);
  }
}

export function validate(root: string): string[] {
  const errors: string[] = [];
  const marketPath = join(root, '.claude-plugin', 'marketplace.json');
  const market = readJson(marketPath, errors);
  if (!market) return errors;
  checkName(requireString(market, 'name', marketPath, errors), marketPath, errors);
  const owner = market.owner;
  if (typeof owner !== 'object' || owner === null || typeof (owner as Json).name !== 'string') errors.push(`${marketPath}: "owner.name" must be a string`);
  const plugins = market.plugins;
  if (!Array.isArray(plugins) || !plugins.length) { errors.push(`${marketPath}: "plugins" must be a non-empty array`); return errors; }

  for (const [i, raw] of plugins.entries()) {
    const where = `${marketPath} plugins[${i}]`;
    if (typeof raw !== 'object' || raw === null) { errors.push(`${where} must be an object`); continue; }
    const entry = raw as Json;
    const name = requireString(entry, 'name', where, errors);
    const version = requireString(entry, 'version', where, errors);
    const source = requireString(entry, 'source', where, errors);
    requireString(entry, 'description', where, errors);
    checkName(name, where, errors);
    checkVersion(version, where, errors);
    if (!source) continue;

    const src = join(root, source);
    const manifestPath = join(src, '.claude-plugin', 'plugin.json');
    const manifest = readJson(manifestPath, errors);
    if (!manifest) continue;
    const mName = requireString(manifest, 'name', manifestPath, errors);
    const mVersion = requireString(manifest, 'version', manifestPath, errors);
    requireString(manifest, 'description', manifestPath, errors);
    checkVersion(mVersion, manifestPath, errors);
    if (mName && name && mName !== name) errors.push(`plugin name "${mName}" doesn't match marketplace entry "${name}"`);
    if (mVersion && version && mVersion !== version) errors.push(`plugin ${name}: version ${mVersion} doesn't match marketplace ${version}`);

    const skillsDir = join(src, 'skills');
    const skills = existsSync(skillsDir) ? readdirSync(skillsDir, { withFileTypes: true }).filter((d) => d.isDirectory()) : [];
    if (!skills.length) errors.push(`plugin ${name}: no skills in ${skillsDir}`);
    for (const s of skills) validateSkill(join(skillsDir, s.name), errors);
  }
  return errors;
}
