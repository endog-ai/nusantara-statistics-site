// NusaStat handover — how this entry is packed for the judge.
//
// The site itself is plain static files in app/ (one page, one stylesheet,
// three script modules, no network at all) plus a few screenshots in
// screenshots/. This script is only the packer: it gathers those two
// folders into the output directory and asks the vendored make.fun library
// to write dossier.json, the summary the judge reads — which screenshots,
// how big the first load is, and what the source looks like.
//
// The packing is organised as a checklist: every step has a name, does one
// small job, and says what it found, so a failed run points at the exact
// step that broke instead of dying silently halfway. Nothing here touches
// vendor/makefun-frontend.ts — the scorer insists dossier.json is byte for
// byte what its own copy of that library writes.
//
// Run it with:
//   MAKEFUN_OUTPUT_DIR=out node main.ts
// Outside the grader's container MAKEFUN_OUTPUT_DIR stands in for /output.
// Serve the site itself with `node serve.ts`, then open http://localhost:8080.

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// Where the entry lives, and where the packed copy goes.
const entryRoot = fileURLToPath(new URL('.', import.meta.url));
const packDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The scorer's own caps, from the kit's reference/gate.json. Only the text
// cap shapes the bytes; the rest refuse an entry the scorer would refuse:
// more than 4 screenshots or one over 256 KiB, more than 993 files and
// directories inside app/, or more than 16 MiB of app files (app/ counts
// beside /output's own 1000-entry cap, plus its screenshots/ and
// dossier.json).
const DOSSIER_LIMITS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

const SHOT_CEILING_BYTES = 262144;
const SHOT_CEILING_COUNT = 4;

type StepReport = { label: string; detail: string };
const reports: StepReport[] = [];

type Step = { label: string; run: () => string };

function countEntries(dir: string): number {
  let total = 0;
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    total += 1;
    if (statSync(path).isDirectory()) total += countEntries(path);
  }
  return total;
}

function dirBytes(dir: string): number {
  let total = 0;
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const info = statSync(path);
    total += info.isDirectory() ? dirBytes(path) : info.size;
  }
  return total;
}

const checklist: Step[] = [
  {
    label: 'open the packing folder',
    run: () => {
      mkdirSync(packDir, { recursive: true });
      return `created ${packDir}`;
    },
  },
  {
    label: 'gather the site files',
    run: () => {
      const source = join(entryRoot, 'app');
      const target = join(packDir, 'app');
      cpSync(source, target, { recursive: true });
      const files = countEntries(target);
      const bytes = dirBytes(target);
      if (!existsSync(join(target, 'index.html'))) throw new Error('app/index.html is missing after the copy');
      return `${files} entries, ${bytes} bytes, index.html present`;
    },
  },
  {
    label: 'gather the screenshots',
    run: () => {
      const source = join(entryRoot, 'screenshots');
      const target = join(packDir, 'screenshots');
      mkdirSync(target, { recursive: true });
      if (!existsSync(source)) throw new Error('screenshots/ is missing beside main.ts');
      cpSync(source, target, { recursive: true });
      const shots = readdirSync(target).filter((name) => !statSync(join(target, name)).isDirectory());
      if (shots.length === 0) throw new Error('no screenshots found to pack');
      if (shots.length > SHOT_CEILING_COUNT) throw new Error(`${shots.length} screenshots, over the cap of ${SHOT_CEILING_COUNT}`);
      const oversize = shots.filter((name) => statSync(join(target, name)).size > SHOT_CEILING_BYTES);
      if (oversize.length > 0) throw new Error(`screenshot over 256 KiB: ${oversize.join(', ')}`);
      return `${shots.length} shots, largest ${Math.max(...shots.map((name) => statSync(join(target, name)).size))} bytes`;
    },
  },
  {
    label: 'write the judge summary',
    run: () => {
      writeFileSync(join(packDir, 'dossier.json'), buildDossier(packDir, DOSSIER_LIMITS));
      const parsed = JSON.parse(readFileSync(join(packDir, 'dossier.json'), 'utf8'));
      if (!parsed || typeof parsed !== 'object') throw new Error('dossier.json did not parse back as an object');
      return `dossier.json written and parses, ${Object.keys(parsed).length} top-level keys`;
    },
  },
];

let failed: { label: string; cause: unknown } | null = null;
for (const step of checklist) {
  try {
    reports.push({ label: step.label, detail: step.run() });
  } catch (cause) {
    failed = { label: step.label, cause };
    break;
  }
}

console.log(`NusaStat pack — ${reports.length} of ${checklist.length} steps done:`);
for (const report of reports) console.log(`  ok  ${report.label} — ${report.detail}`);
if (failed) {
  console.error(`  FAIL  ${failed.label} — ${failed.cause instanceof Error ? failed.cause.message : String(failed.cause)}`);
  process.exit(1);
}
console.log(`Packed into ${packDir}: app/, screenshots/ and dossier.json are ready for the judge.`);
