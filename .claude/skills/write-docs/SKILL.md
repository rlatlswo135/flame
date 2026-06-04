---
name: write-docs
description: Create a documentation page for a @flame/ui component in the docs app.
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Write Docs Skill

Create a documentation page for a flame/ui component. The user provides the component name.

## Steps

1. **Read the component source**
   - Read `packages/ui/src/components/{kebab-name}/{kebab-name}.tsx`
   - Read `packages/ui/src/components/{kebab-name}/context.ts`
   - Extract: exported types, props for each sub-component, compound component structure

2. **Read reference doc page**
   - Read `apps/docs/app/[locale]/docs/components/dialog/page.tsx` as the template
   - Read `apps/docs/app/[locale]/docs/components/dialog/dialog-demo.tsx` as demo template

3. **Create the demo component**
   - Create `apps/docs/app/[locale]/docs/components/{kebab-name}/{kebab-name}-demo.tsx`
   - Must be `'use client'`
   - Import the component from `@flame/ui`
   - Use `useTranslations('components.{kebab-name}.demo')` for all user-facing text
   - Style with Tailwind classes using flame CSS variables (`text-flame-text`, `bg-flame-bg`, etc.)
   - Include a meaningful interactive example showing the component's key features
   - Export named: `{PascalName}Demo`

4. **Create the page**
   - Create `apps/docs/app/[locale]/docs/components/{kebab-name}/page.tsx`
   - Async server component (no 'use client')
   - Use `getTranslations({ locale, namespace: 'components.{kebab-name}' })` for text
   - Define `demoCode` as a const string in the page file (template literal of example JSX)
   - Structure:
     - `<h1>` with `t('title')`
     - `<p>` with `t('description')`
     - `<ComponentDemo>` wrapping `{PascalName}Demo` + `<CodeBlock code={demoCode} />`
     - `<PropsTable>` for each sub-component (Root, Trigger, Content, etc.)
   - Props data defined as `PropDef[]` arrays in the page file
   - Import shared components from `@/src/components/`

5. **Update i18n translation files**
   - Add entries to both `apps/docs/messages/en.json` and `apps/docs/messages/ko.json`
   - Structure: `components.{kebab-name}.title`, `.description`, `.props.*`, `.demo.*`
   - **CRITICAL**: Never use opening HTML tags like `<section>` or `<dialog>` in translation values — next-intl treats them as ICU/React elements and throws a render error. Always use self-closing form: `<section />`, `<dialog />`, `<div />`

6. **Update sidebar**
   - Check `apps/docs/app/[locale]/_navigation/sidebar.tsx`
   - If the component is not in the `COMPONENTS` array, add it alphabetically

7. **Summary** — list created files, note any props that were ambiguous
