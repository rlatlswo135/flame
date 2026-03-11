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
    ├── dialog/
    │   ├── dialog.stories.tsx
    │   └── dialog.examples.tsx
    └── funnel/
        ├── funnel.stories.tsx
        └── funnel.examples.tsx
```

## Addons

- `@storybook/addon-docs` — auto-generated documentation
- `@storybook/addon-a11y` — accessibility checks
- `@storybook/addon-vitest` — in-browser testing
- `@vitest/browser-playwright` — browser-mode test runner
