# Spirit Island Narrator — Course Progress

> **Format change (session 1):** switched from test-gated exercises to a guided
> build-it-up walkthrough at the GitHub Pages site (`playground/index.html`) —
> each step adds one concept (states → events → context → actions → guards →
> nested states → agent/model config) with a live tappable demo. The vitest
> exercises remain in `exercises/` and the sandbox editor at
> `playground/practice.html` for optional practice, but they no longer gate
> progress.

| # | Exercise | Status | Takeaway |
|---|----------|--------|----------|
| 00 | Repo setup | ✅ done | The agent alpha pins `ai@^4` and Zod 3 — the installed `.d.ts` beats the docs, always. |
| 01 | XState v5 warm-up (one game round) | 🔨 attempting | — |
| 02 | Zod event schemas — the game's vocabulary | ⬜ | — |
| 03 | `createAgent` v2 — the narrator's voice | ⬜ | — |
| 04 | First narration via `agent.wrap` + server route — 📱 checkpoint | ⬜ | — |
| 05 | `agent.decide` — the agent plays the invaders | ⬜ | — |
| 06 | `agent.interact` — narrate every transition | ⬜ | — |
| 07 | Observations + insights — non-repeating prose — 📱 checkpoint | ⬜ | — |
| 08 | Feedback + reward — thumbs up/down | ⬜ | — |
| 09 | UI polish — moonlit lore-reader, streaming | ⬜ | — |
| 10 | Ship it — PWA, deploy, home screen — 📱 final checkpoint | ⬜ | — |

## Installed-package corrections to the pinned API facts (verified against `node_modules/@statelyai/agent@2.0.0-next.5/dist/index.d.ts`)

These override the course brief where they conflict:

1. **Feedback links to a *decision*, not an observation.**
   `AgentFeedbackInput` is `{ decisionId: string; reward: number; comment?; attributes? }`.
   There is no `observationId` on feedback — that field lives on *insights*
   (`AgentInsightInput = { observationId: string; attributes: Record<string, any> }`).
2. **No `defineEvents` export and no `agent.types`.** Events are a plain
   `{ [eventType: string]: SomeZodObject }` mapping passed to `createAgent({ events })`.
   To type the machine from the agent, use the exported `TypesFromAgent<typeof agent>`
   helper (also `EventFromAgent`, `ContextFromAgent`).
3. **No `createAgentMiddleware` export** in this build. Message history goes through
   `agent.addMessage` / `agent.getMessages`; text generation through the AI SDK with
   `agent.wrap(model)` (confirmed: `wrap(modelToWrap: LanguageModelV1): LanguageModelV1`).
4. **`agent.interact`'s callback must NOT return `state`.**
   `AgentInteractInput = Omit<AgentDecideInput, 'state'> & { state?: never }` — the
   state comes from the observation itself; you return `{ goal, … }` only.
5. **`createAgent` requires `model`** (it's the non-optional field; `id`, `description`,
   `context` are optional, `events` is required).
6. Confirmed as briefed: `decide({ state, goal, machine, allowedEvents, maxAttempts = 2, episodeId? })`,
   no `execute`; policies exported as `chainOfThoughtPolicy`, `toolPolicy`,
   `experimental_shortestPathPolicy`; `addFeedback` uses `reward`.
