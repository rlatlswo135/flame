---
paths:
  - "apps/storybook/**"
---

# Storybook Rules

## File Structure
- Location: `stories/ui/{kebab-name}/`
- Split into `{name}.stories.tsx` (Meta + Stories) and `{name}.examples.tsx` (example components)

## Stories
- Import component from `@flame/ui`
- `Meta` with title `ui/{ComponentName}`
- Default story + at least one variant
- `export default meta` at the bottom

## Examples
- Stateful example components live in `{name}.examples.tsx`
- Stories import and render them
