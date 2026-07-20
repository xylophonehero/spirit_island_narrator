/**
 * Exercise 01 — Solution.
 *
 * Peek only after your attempt. The debrief lives in PROGRESS.md.
 */
import { assign, setup } from 'xstate';

export const gameRoundMachine = setup({
  types: {
    context: {} as { round: number; blightCount: number },
    events: {} as
      | { type: 'END_SPIRIT_PHASE' }
      | { type: 'END_FAST_POWERS' }
      | { type: 'RAVAGE' }
      | { type: 'BUILD' }
      | { type: 'EXPLORE' }
      | { type: 'END_SLOW_POWERS' }
      | { type: 'TIME_PASSES' },
    input: {} as { startingBlight: number },
  },
  actions: {
    addBlight: assign({
      blightCount: ({ context }) => context.blightCount + 1,
    }),
    nextRound: assign({
      round: ({ context }) => context.round + 1,
    }),
  },
  guards: {
    islandWouldBeDestroyed: ({ context }) => context.blightCount >= 4,
  },
}).createMachine({
  id: 'gameRound',
  context: ({ input }) => ({
    round: 1,
    blightCount: input.startingBlight,
  }),
  initial: 'spiritPhase',
  states: {
    spiritPhase: {
      on: { END_SPIRIT_PHASE: { target: 'fastPowers' } },
    },
    fastPowers: {
      on: { END_FAST_POWERS: { target: 'invaderPhase' } },
    },
    invaderPhase: {
      initial: 'ravage',
      states: {
        ravage: {
          on: {
            RAVAGE: [
              {
                guard: 'islandWouldBeDestroyed',
                target: '#gameRound.gameOver',
                actions: 'addBlight',
              },
              { target: 'build', actions: 'addBlight' },
            ],
          },
        },
        build: {
          on: { BUILD: { target: 'explore' } },
        },
        explore: {
          on: { EXPLORE: { target: '#gameRound.slowPowers' } },
        },
      },
    },
    slowPowers: {
      on: { END_SLOW_POWERS: { target: 'timePasses' } },
    },
    timePasses: {
      on: { TIME_PASSES: { target: 'spiritPhase', actions: 'nextRound' } },
    },
    gameOver: {
      type: 'final',
    },
  },
});
