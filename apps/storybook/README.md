# @flame/storybook

Interactive component playground and documentation for the flame design system.

## Getting Started

```bash
pnpm dev  # starts storybook on http://localhost:6006
```

## Structure

```
stories/
└── ui/
    ├── accordion/
    ├── dialog/
    ├── drawer/
    ├── funnel/
    ├── popover/
    ├── select/
    ├── tabs/
    ├── toast/
    └── tooltip/
```

Each component directory contains a `*.stories.tsx` (Storybook stories) and a
`*.examples.tsx` (reusable example components referenced by the stories).

## Addons

- `@storybook/addon-docs` — auto-generated documentation
- `@storybook/addon-a11y` — accessibility checks
- `@storybook/addon-vitest` — in-browser testing (Vitest)
- `@chromatic-com/storybook` — visual regression / Chromatic publishing

Tests run in browser mode via Vitest + Playwright (`@vitest/browser-playwright`),
configured in `vite.config.ts`.
