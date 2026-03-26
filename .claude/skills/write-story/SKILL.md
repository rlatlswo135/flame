---
name: write-story
description: Write Storybook stories for a @flame/ui component following project conventions.
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Write Story Skill

Write Storybook stories for a component. The user will specify which one.

## Steps

1. **Read the component source**
   - `packages/ui/src/components/{kebab-name}/index.tsx` — props, sub-components, API
   - `packages/ui/src/components/{kebab-name}/context.ts` — context shape (if exists)

2. **Read existing story references** for pattern consistency
   - `Glob` for `apps/storybook/stories/ui/**/*.stories.tsx`
   - Read at least one reference story (prefer `dialog.stories.tsx` or `popover.stories.tsx`)

3. **Create story files**
   - `apps/storybook/stories/ui/{kebab-name}/{kebab-name}.stories.tsx`
   - `apps/storybook/stories/ui/{kebab-name}/{kebab-name}.examples.tsx` (if stateful examples needed)

4. **Story file conventions**
   - Import component from `@flame/ui`
   - Use `import type { Meta, StoryObj } from "@storybook/react-vite"`
   - `type Story = StoryObj<typeof meta>`
   - `meta` with `title: "ui/{ComponentName}"`, `component`, `parameters.docs.description.component`
   - `argTypes` for each boolean/enum prop with `control`, `description`, `table.type.summary`, `table.defaultValue.summary`
   - `render` function in meta for default rendering
   - `satisfies Meta<typeof Component>`
   - `export default meta` at the bottom
   - Default story: `export const Default: Story = {}`
   - Each variant story: `args` + `parameters.docs.description.story` + `parameters.docs.source.code` (clean JSX string)

5. **Summary** — list created files and stories
