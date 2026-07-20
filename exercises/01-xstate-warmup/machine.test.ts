import { describe, expect, it } from 'vitest';
import { createActor } from 'xstate';
import { gameRoundMachine } from './problem';

const startGame = (startingBlight = 0) => {
  const actor = createActor(gameRoundMachine, { input: { startingBlight } });
  actor.start();
  return actor;
};

/** Walks from spiritPhase to the invaderPhase's ravage step. */
const advanceToRavage = (actor: ReturnType<typeof startGame>) => {
  actor.send({ type: 'END_SPIRIT_PHASE' });
  actor.send({ type: 'END_FAST_POWERS' });
};

describe('the shape of a round', () => {
  it('begins in the spirit phase on round 1', () => {
    const actor = startGame();
    expect(actor.getSnapshot().value).toBe('spiritPhase');
    expect(actor.getSnapshot().context).toEqual({ round: 1, blightCount: 0 });
  });

  it('starts with the blight the island was dealt as input', () => {
    const actor = startGame(3);
    expect(actor.getSnapshot().context.blightCount).toBe(3);
  });

  it('moves spiritPhase → fastPowers → invaderPhase(ravage)', () => {
    const actor = startGame();
    actor.send({ type: 'END_SPIRIT_PHASE' });
    expect(actor.getSnapshot().value).toBe('fastPowers');
    actor.send({ type: 'END_FAST_POWERS' });
    expect(actor.getSnapshot().value).toEqual({ invaderPhase: 'ravage' });
  });

  it('steps through the invader phase: ravage → build → explore', () => {
    const actor = startGame();
    advanceToRavage(actor);
    actor.send({ type: 'RAVAGE' });
    expect(actor.getSnapshot().value).toEqual({ invaderPhase: 'build' });
    actor.send({ type: 'BUILD' });
    expect(actor.getSnapshot().value).toEqual({ invaderPhase: 'explore' });
  });

  it('exploring ends the invader phase, landing on slowPowers', () => {
    const actor = startGame();
    advanceToRavage(actor);
    actor.send({ type: 'RAVAGE' });
    actor.send({ type: 'BUILD' });
    actor.send({ type: 'EXPLORE' });
    expect(actor.getSnapshot().value).toBe('slowPowers');
  });
});

describe('blight', () => {
  it('ravaging adds one blight to the island', () => {
    const actor = startGame();
    advanceToRavage(actor);
    actor.send({ type: 'RAVAGE' });
    expect(actor.getSnapshot().context.blightCount).toBe(1);
  });

  it('the fifth blight destroys the island', () => {
    const actor = startGame(4);
    advanceToRavage(actor);
    actor.send({ type: 'RAVAGE' });
    const snapshot = actor.getSnapshot();
    expect(snapshot.value).toBe('gameOver');
    expect(snapshot.context.blightCount).toBe(5);
    expect(snapshot.status).toBe('done');
  });

  it('four blight is survivable — the round continues', () => {
    const actor = startGame(3);
    advanceToRavage(actor);
    actor.send({ type: 'RAVAGE' });
    expect(actor.getSnapshot().value).toEqual({ invaderPhase: 'build' });
    expect(actor.getSnapshot().context.blightCount).toBe(4);
  });
});

describe('time passes', () => {
  it('loops back to the spirit phase and increments the round', () => {
    const actor = startGame();
    advanceToRavage(actor);
    actor.send({ type: 'RAVAGE' });
    actor.send({ type: 'BUILD' });
    actor.send({ type: 'EXPLORE' });
    actor.send({ type: 'END_SLOW_POWERS' });
    expect(actor.getSnapshot().value).toBe('timePasses');
    actor.send({ type: 'TIME_PASSES' });
    expect(actor.getSnapshot().value).toBe('spiritPhase');
    expect(actor.getSnapshot().context.round).toBe(2);
  });
});

describe('statechart discipline', () => {
  it('ignores events that are out of phase (no ravaging during the spirit phase)', () => {
    const actor = startGame();
    actor.send({ type: 'RAVAGE' });
    expect(actor.getSnapshot().value).toBe('spiritPhase');
    expect(actor.getSnapshot().context.blightCount).toBe(0);
  });
});
