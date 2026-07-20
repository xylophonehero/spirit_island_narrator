#!/usr/bin/env node
// Runs the tests for one exercise in watch mode: `pnpm exercise 03`
import { spawn } from 'node:child_process';
import { readdirSync } from 'node:fs';

const arg = process.argv[2];

if (!arg) {
  console.error('Usage: pnpm exercise <number>   e.g. `pnpm exercise 01`');
  process.exit(1);
}

const num = arg.padStart(2, '0');
const dir = readdirSync('exercises').find((d) => d.startsWith(`${num}-`));

if (!dir) {
  console.error(`No exercise starting with "${num}-" found in exercises/`);
  process.exit(1);
}

console.log(`\n▶ Exercise ${dir} — edit problem.ts(x) until the tests go green.\n`);

const child = spawn('pnpm', ['vitest', `exercises/${dir}`], {
  stdio: 'inherit',
  shell: false,
});

child.on('exit', (code) => process.exit(code ?? 0));
