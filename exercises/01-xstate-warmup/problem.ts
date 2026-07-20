/**
 * Exercise 01 — Model one Spirit Island round as a state machine.
 *
 * Why the app needs this: the agent narrates *transitions*. Before an LLM can
 * say anything, the game itself must be a machine whose states and events are
 * legible — to you, to the compiler, and (later) to the agent.
 *
 * The round structure, straight from the rulebook:
 *
 *   spiritPhase → fastPowers → invaderPhase → slowPowers → timePasses → (next round)
 *                              └─ ravage → build → explore ─┘
 *
 * Run the tests:  pnpm exercise 01
 *
 * Your job — make every test green by:
 *
 * 1. Typing the machine in `setup({ types: { … } })`:
 *      context: { round: number; blightCount: number }
 *      events:  END_SPIRIT_PHASE | END_FAST_POWERS | RAVAGE | BUILD | EXPLORE
 *               | END_SLOW_POWERS | TIME_PASSES   (no payloads yet)
 *      input:   { startingBlight: number }
 *
 * 2. Implementing two named actions with `assign`:
 *      'addBlight'  — RAVAGE puts one blight on the island
 *      'nextRound'  — TIME_PASSES increments the round
 *
 * 3. Implementing one named guard:
 *      'islandWouldBeDestroyed' — true when the *next* blight would be the
 *      fifth (i.e. blightCount is already 4 or more)
 *
 * 4. Wiring the states:
 *      - initial context comes from input (round starts at 1)
 *      - invaderPhase is a NESTED state: ravage → build → explore
 *      - EXPLORE leaves the invaderPhase entirely, landing on slowPowers
 *      - RAVAGE first checks the guard: if the island would be destroyed,
 *        go to a top-level final state 'gameOver' (still adding the blight —
 *        the island falls as it burns). Otherwise add blight and move to build.
 *      - TIME_PASSES loops back to spiritPhase for the next round
 *
 * Hints live at the bottom of this file. Don't scroll until you're stuck.
 */
import { setup } from 'xstate';

export const gameRoundMachine = setup({
  types: {
    // TODO: context, events, input
  },
  actions: {
    // TODO: 'addBlight', 'nextRound'
  },
  guards: {
    // TODO: 'islandWouldBeDestroyed'
  },
}).createMachine({
  id: 'gameRound',
  // TODO: context: ({ input }) => …
  initial: 'spiritPhase',
  states: {
    spiritPhase: {
      // TODO
    },
    // TODO: fastPowers, invaderPhase (nested!), slowPowers, timePasses, gameOver
  },
});

/**
 * ────────────────────────────────────────────────────────────────────────
 * Hints (stuck? read one at a time)
 *
 * Hint 1: `setup({ types: { context: {} as …, events: {} as …, input: {} as … } })`
 *         — the `{} as Type` pattern is how XState v5 takes type-only params.
 *
 * Hint 2: `assign({ blightCount: ({ context }) => context.blightCount + 1 })`
 *         — import `assign` from 'xstate'. Reference actions by NAME in the
 *         machine config: `actions: 'addBlight'`.
 *
 * Hint 3: A guarded transition is an array — first match wins:
 *         RAVAGE: [
 *           { guard: 'islandWouldBeDestroyed', target: …, actions: … },
 *           { target: …, actions: … },
 *         ]
 *         Targeting a state OUTSIDE the nested parent needs an id ref:
 *         `target: '#gameRound.gameOver'`.
 * ────────────────────────────────────────────────────────────────────────
 */
