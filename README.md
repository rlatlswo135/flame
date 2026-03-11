# flame

React 19 design system monorepo.

## Structure

```
packages/
  ui/          Core UI components (Dialog, Funnel, Select, MultiSelect)
  table/       Table component (built on @tanstack/react-table)
apps/
  storybook/   Interactive component playground
  docs/        Documentation site (Next.js)
configs/       Shared build & test configs (tsup, vitest)
```

## Getting Started

```bash
git clone https://github.com/rlatlswo135/flame.git
cd flame
pnpm install
pnpm build
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run all packages in watch mode |
| `pnpm build` | Build ui → table → docs |
| `pnpm lint` | Lint with biome |
| `pnpm commit` | Commitizen conventional commit |
| `pnpm @ui <cmd>` | Run command in @flame/ui |
| `pnpm @table <cmd>` | Run command in @flame/table |
| `pnpm @storybook <cmd>` | Run command in @flame/storybook |
| `pnpm @docs <cmd>` | Run command in @flame/docs |

## Tech Stack

- React 19, TypeScript 5
- pnpm workspace with catalog
- tsup (build), biome (lint), vitest (test)
- commitizen + husky (commit conventions)

## License

ISC
