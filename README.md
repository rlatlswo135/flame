# Flame: Headless Design Libraries

[📖 Documentation](https://flame-docs.pages.dev)

## Structure

```
packages/
  ui/          Headless UI components — Accordion, Dialog, Drawer, Funnel,
               Popover, Select, Tabs, Toast, Tooltip
apps/
  storybook/   Interactive component playground
  docs/        Documentation site (Astro + i18n)
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
| `pnpm build` | Build ui → docs |
| `pnpm test` | Run tests across packages |
| `pnpm lint` | Lint with biome |
| `pnpm commit` | Commitizen conventional commit |
| `pnpm @ui <cmd>` | Run command in @flame/ui |
| `pnpm @storybook <cmd>` | Run command in @flame/storybook |
| `pnpm @docs <cmd>` | Run command in @flame/docs |

## Tech Stack

- React 19, TypeScript 5
- pnpm workspace with catalog
- tsup (build), biome (lint), vitest (test)
- Astro (docs), Storybook (playground)
- commitizen + husky (commit conventions)

## License

ISC
