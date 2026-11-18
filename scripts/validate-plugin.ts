import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validate } from './plugin.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = validate(root);
if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`);
  process.exit(1);
}
console.log('✓ plugin manifests and skill are valid');
