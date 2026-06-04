---
paths:
  - "packages/ui/src/components/**"
  - "packages/ui/src/primitives/**"
---

# Component Code Order

One deterministic way. Never decide structure by file size or "statefulness" —
those are continuous/unstable criteria, not conventions.

## File Structure
- One compound component = **one file**: `{name}.tsx` holds the root, every
  sub-part, and the assembly block.
- Shared `Context` → `context.ts`.
- Shared cross-part prop types → `types.ts` only if actually reused across
  files; otherwise keep them in `{name}.tsx`.
- A standalone (non-compound) component or primitive is a single file
  (e.g. `primitives/client-only.tsx`).

### The only split exception
- A sub-part graduates to its own file/folder **only when it becomes a compound
  itself** (gains its own sub-parts) — a structural (discrete) trigger, never a
  line-count one.
- e.g. `Select.Options` growing `Option` / `Group` / `Separator` →
  `select/options/`.

## Intra-file Order (skeleton)
Top to bottom, always. The `"use client"` directive and imports precede this
list and are omitted (basic, non-negotiable order):

1. types (all part prop types)
2. module-level mutable globals (`let` — e.g. id counters)
3. Root component (provider / state)
4. sub-parts, in public-API order
5. module-level constants (`const`)
6. assembly block (`Root.Part = Part`)
7. exports

Note: `let` mutable globals sit near the top (right after types); `const`
constants sit near the bottom (after the parts, just before assembly).
`displayName` assignments belong to the assembly step (see below).

## Assembly
- Each part sets `displayName = "{Root}.{Part}"`.
- Attach parts as statics on the root in the assembly block
  (`Drawer.Trigger = Trigger`), never inline.
