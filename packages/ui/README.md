# flame-ui

[![npm](https://img.shields.io/npm/v/flame-ui.svg)](https://www.npmjs.com/package/flame-ui)
[![license](https://img.shields.io/npm/l/flame-ui.svg)](./LICENSE)

A **headless** React 19 component library for building accessible UIs. Fully functional, zero default styles — you bring the markup and the styling, flame brings the behavior, accessibility, and state.

- 🎨 **Headless** — ships zero styles. You provide the markup; flame handles behavior and state. Components forward your `className`/props and expose state through `data-*` attributes (`data-selected`, `data-expanded`, …), so you can style with Tailwind, plain CSS, or anything else.
- 🧩 **Compound components** — compose with dot notation (`Dialog.Trigger`, `Dialog.Content`, …) and render-prop children for full control over rendering.
- ♿ **ARIA built in** — roles and state attributes out of the box (`aria-expanded`, `aria-selected`, `aria-haspopup`, `aria-live`, …). Focus management for overlays is handled via Floating UI and the native `<dialog>`.
- 🌐 **Web standards** — built on the native `<dialog>` top layer and [Floating UI](https://floating-ui.com) for positioning.
- 🔠 **Typed** — written in TypeScript, type definitions bundled.

📖 **[Documentation](https://flame-docs.pages.dev)** &nbsp;·&nbsp; 💻 **[GitHub](https://github.com/rlatlswo135/flame)**

## Installation

```bash
npm install flame-ui
# or
pnpm add flame-ui
# or
yarn add flame-ui
```

### Peer dependencies

```bash
npm install react react-dom @floating-ui/react
```

| Package | Version |
|---------|---------|
| `react` | `^19.0.0` |
| `react-dom` | `^19.0.0` |
| `@floating-ui/react` | `^0.27.19` (used by Popover, Select, Tooltip) |

## Quick start

```tsx
import { Dialog } from "flame-ui";

function Example() {
  return (
    <Dialog closeOutside>
      <Dialog.Trigger>
        <button>Open</button>
      </Dialog.Trigger>

      <Dialog.Content>
        <h2>Hello flame</h2>
        <p>Headless modal built on the native &lt;dialog&gt; element.</p>
        <Dialog.Closer>
          <button>Close</button>
        </Dialog.Closer>
      </Dialog.Content>
    </Dialog>
  );
}
```

Components ship no styles — every element forwards your `className` and native props, so style them however you like.

## Components

| Component | Description |
|-----------|-------------|
| `Accordion` | Expandable content sections, single or multi expand |
| `Dialog` | Modal dialog built on the native `<dialog>` element |
| `Drawer` | Slide-in side panel overlay |
| `Funnel` | Step-based navigation wizard |
| `Popover` | Floating, position-aware popups |
| `Select` | Dropdown select input |
| `Tabs` | Accessible tab list with active-state tracking (you render the panels) |
| `Toast` | Imperative toast notifications (`Toaster` + `toast()`) |
| `Tooltip` | Contextual hover and focus tooltips |

See the **[documentation](https://flame-docs.pages.dev)** for the full API reference, props, and live demos.

## Contributing

The library lives in the [flame monorepo](https://github.com/rlatlswo135/flame). To work on it locally:

```bash
pnpm dev    # watch mode
pnpm build  # production build
pnpm test   # run tests
```

## License

[MIT](./LICENSE) © [rlatlswo135](https://github.com/rlatlswo135)
