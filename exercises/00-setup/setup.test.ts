/**
 * Exercise 00 — Setup sanity check.
 *
 * Nothing to solve here. If this file is green, the whole pinned stack is
 * installed and importable, and the versions match what the course assumes.
 * Run it with: pnpm exercise 00
 */
import { describe, expect, it } from 'vitest';
import { createMachine, setup } from 'xstate';
import { createAgent, fromDecision } from '@statelyai/agent';
import { generateText } from 'ai';
import { z } from 'zod';
import pkg from '../../package.json';

describe('the pinned stack', () => {
  it('has xstate v5 with setup()', () => {
    expect(typeof setup).toBe('function');
    expect(typeof createMachine).toBe('function');
  });

  it('has @statelyai/agent v2 (next)', () => {
    expect(typeof createAgent).toBe('function');
    expect(typeof fromDecision).toBe('function');
    expect(pkg.dependencies['@statelyai/agent']).toMatch(/^2\.0\.0-next/);
  });

  it('has the AI SDK v4 line (the peer range the agent alpha demands)', () => {
    expect(typeof generateText).toBe('function');
    expect(pkg.dependencies.ai).toMatch(/^\^?4\./);
  });

  it('has zod v3 (zod-to-json-schema inside the agent needs it)', () => {
    expect(z.object({ fear: z.number() }).parse({ fear: 3 })).toEqual({ fear: 3 });
    expect(pkg.dependencies.zod).toMatch(/^\^?3\./);
  });
});
