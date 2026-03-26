---
paths:
  - "packages/ui/**"
  - "packages/table/**"
---

# UI Component Rules

## File Structure
- `components/{kebab-name}/index.tsx` + `context.ts`
- Re-export from `src/index.ts`

## Patterns
- Compound Component: Root + sub-components as static properties (`Dialog.Trigger`)
- Context: `createContext<T | null>(null)` → consume via `useCtx` hook
- Children: use `FnChildren<T>` or `ElementFnChildren<T>` from `@/src/types` for render props
- Props type: `{Component}Props` pattern
- Sub-components: assign `displayName`
- React 19 APIs: `use`, Context `value` prop
