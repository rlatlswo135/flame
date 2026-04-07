---
name: write-docs
description: Create a documentation page for a @flame/ui component in the docs app.
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Write Docs Skill

Create a documentation page for a flame/ui component. The user provides the component name.

## Steps

1. **Read the component source**
   - Read `packages/ui/src/components/{kebab-name}/{kebab-name}.tsx`
   - Read `packages/ui/src/components/{kebab-name}/context.ts`
   - Extract: exported types, props for each sub-component, compound component structure

2. **Read reference doc page**
   - Read `apps/docs/app/docs/components/dialog/page.tsx` as the template
   - Read `apps/docs/app/docs/components/dialog/dialog-demo.tsx` as demo template

3. **Create the demo component**
   - Create `apps/docs/app/docs/components/{kebab-name}/{kebab-name}-demo.tsx`
   - Must be `'use client'`
   - Import the component from `@flame/ui`
   - Style with Tailwind classes using flame CSS variables (`var(--flame-accent)`, etc.)
   - Include a meaningful interactive example showing the component's key features
   - Export named: `{PascalName}Demo`
   - Export `const demoCode: string` — template literal of the demo JSX for the code block

4. **Create the page**
   - Create `apps/docs/app/docs/components/{kebab-name}/page.tsx`
   - Server component (no 'use client')
   - Structure:
     - `<h1>` with component name
     - `<p>` with brief description
     - `<ComponentDemo>` wrapping `{PascalName}Demo` + code string
     - `<PropsTable>` for each sub-component (Root, Trigger, Content, etc.)
   - Props data defined as arrays in the page file
   - Import shared components from `@/app/components/`

5. **Update sidebar**
   - Check `apps/docs/app/components/sidebar.tsx`
   - If the component is not in the `COMPONENTS` array, add it alphabetically

6. **Summary** — list created files, note any props that were ambiguous
