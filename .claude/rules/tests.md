---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
---

# Test Rules

## Location
- `packages/ui/src/components/{name}/{name}.test.tsx`
- `packages/table/src/**/{name}.test.tsx`

## Priority Hierarchy
1. Critical User Paths — renders, core interactions, context communication
2. Error Handling — missing provider, invalid props
3. Edge Cases — empty/conditional children, boundary values
4. Accessibility — ARIA roles, keyboard navigation

## Patterns
- vitest globals enabled (`describe`, `it`, `expect` without imports)
- `@testing-library/react` for render and queries
- `userEvent` over `fireEvent`
- Test behavior, not implementation details
