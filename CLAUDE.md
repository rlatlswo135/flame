## Project Overview
flame is a React 19 design system monorepo.
- `packages/ui`: Core UI component library
- `packages/table`: Table component
- `apps/docs`: Documentation site (Next.js)
- `apps/storybook`: Storybook
- `configs`: Shared build & test configs (tsup, vitest)

## Tech Stack
- React 19, TypeScript 5, pnpm workspace (catalog)
- Build: tsup / Lint: biome / Test: vitest / Commit: commitizen + husky

## Multi-Agent Workflow

After code writing tasks, follow this pipeline:

1. Run **Reviewer** + **Convention Guard** agents in parallel
2. Report combined results to the user
3. Include fix suggestions for any Must Fix items

When the user requests a standalone review, run both agents in parallel.
