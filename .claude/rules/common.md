---
paths:
  - "packages/**"
  - "apps/**"
---

# Common Rules

## TypeScript
- No `any` types — use precise types or `unknown`
- No default exports — named exports only
- Strict mode enabled

## Code Style
- Format: biome
- Naming: camelCase (variables/functions), PascalCase (components/types), kebab-case (files/directories)

## Dependencies
- No new dependencies without explicit permission
- Use pnpm workspace catalog for shared versions

## Commits
- commitizen + husky enforced
- Pre-push runs tests
