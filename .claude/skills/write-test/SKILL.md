---
name: write-test
description: Write component tests for @flame/ui or @flame/table using vitest and React Testing Library.
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Write Test Skill

Write tests for a component. The user will specify which one.

## Steps

1. **Read the component source** — understand API, props, context, sub-components
2. **Read the storybook stories** — understand real usage patterns
3. **Check existing test files** — `Glob` for `**/*.test.{ts,tsx}` to follow established patterns
4. **Write tests** following the priority hierarchy in test rules
5. **Run tests** — `pnpm --filter {package} test` to verify
