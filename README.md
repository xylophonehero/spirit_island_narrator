# Spirit Island Narrator

A phone-usable web app: tap a Spirit Island game action (Explore, Build, Ravage,
or a spirit power) and an LLM agent narrates it in the dreamlike register of the
game's lore. Built exercise-by-exercise as a course on **XState v5** and
**`@statelyai/agent` v2** (2.0.0-next.5).

## Stack

TypeScript (strict) · Vite + React · `xstate` v5 · `@xstate/react` ·
`@statelyai/agent@next` · AI SDK v4 (`ai` + `@ai-sdk/anthropic`) · Zod 3 ·
Hono (server route for the API key) · Vitest.

> Version pins that matter: the agent alpha declares `ai@^4.1.36` as a peer
> dependency and uses `zod-to-json-schema` internally, so this repo pins
> `ai@4` / `@ai-sdk/anthropic@1` / `zod@3`. Don't bump them independently.

## Working through the course

```sh
pnpm install
pnpm exercise 01   # runs exercise 01's tests in watch mode
```

Each `exercises/NN-*/` directory contains:

- `problem.ts(x)` — the file **you** edit; tests import from here
- `solution.ts(x)` — peek only after an honest attempt
- `*.test.ts` — the spec; green means done

Progress and per-exercise takeaways live in [PROGRESS.md](./PROGRESS.md), along
with verified corrections to the `@statelyai/agent` v2 API where the installed
alpha differs from its changelog.

## App

```sh
pnpm dev          # local dev
pnpm dev --host   # phone-on-same-wifi checkpoints
```

The Anthropic API key stays server-side: copy `.env.example` to `.env.local`
and set `ANTHROPIC_API_KEY` (used from exercise 04 onward).
