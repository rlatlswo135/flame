---
paths:
  - "packages/ui/**"
  - "packages/table/**"
---

# UI Component Rules

## File Structure
- `components/{kebab-name}/index.tsx` + `context.ts`
- Named exports only, re-export from `src/index.ts`

## Patterns
- Compound Component: Root + sub-components as static properties (`Dialog.Trigger`)
- Context: `createContext<T | null>(null)` → consume via `useCtx` hook
- Children: use `FnChildren<T>` or `ElementFnChildren<T>` from `@/src/types` for render props
- React 19 APIs: `use`, Context `value` prop

## Naming
- Components/Types: PascalCase, Props follow `{Component}Props`
- Hooks: camelCase with `use` prefix
- Directories/files: kebab-case

## Constraints
- No default exports
- No `any` types
- No new dependencies without permission
