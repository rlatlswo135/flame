---
name: create-component
description: Scaffold a new compound component for @flame/ui with context, types, index, and storybook files.
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Create Component Skill

Scaffold a new component. The user will provide the component name.

## Steps

1. **Read reference first**
   - Read `packages/ui/src/components/dialog/index.tsx` and `context.ts`
   - Read `packages/ui/src/types.ts` and `packages/ui/src/hooks/use-ctx.ts`

2. **Create component files**
   - `packages/ui/src/components/{kebab-name}/context.ts`
   - `packages/ui/src/components/{kebab-name}/index.tsx`

3. **Register in barrel export**
   - Add to `packages/ui/src/index.ts`

4. **Summary** — list all created files and note any decisions. Suggest running `write-story` skill for storybook.
