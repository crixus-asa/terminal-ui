# @crix/terminal-ui

A small React UI library for dark, information-dense interfaces with a modern-terminal visual identity: crisp borders, selective clipped corners, compact metadata, and restrained accents.

## Compatibility

- React 19
- Tailwind CSS 4
- TypeScript declarations are emitted with the package build.
- Radix UI, Lucide, `class-variance-authority`, `clsx`, `tailwind-merge`, `react-hook-form`, and Sonner are peer dependencies.

## Install

The package is intended to be consumed from a versioned Git tag:

```sh
npm install git+https://github.com/crixus-asa/terminal-ui.git#v0.1.0
```

In this workspace, the package is installed as a local workspace dependency.

## Use

Import the package stylesheet once. It includes the package theme and generated component utilities, but intentionally does not include Tailwind's global preflight.

```tsx
import "@crix/terminal-ui/terminal.css"
import { Button } from "@crix/terminal-ui/components/ui/button"
import { TerminalPanel } from "@crix/terminal-ui/components/ui/TerminalPanel"

export function Example() {
  return (
    <TerminalPanel eyebrow="SYSTEM / STATUS" title="Ready">
      <p>Package components can be composed with local product content.</p>
      <Button>Continue</Button>
    </TerminalPanel>
  )
}
```

The package root also re-exports the components. Keep the stylesheet import explicit:

```tsx
import "@crix/terminal-ui/terminal.css"
import { Button, TerminalPanel } from "@crix/terminal-ui"
```

Component subpath imports are useful for tree-shaking; import the stylesheet explicitly when using subpaths. Apps should load their own Tailwind v4 preflight once.

## Theme tokens

The default theme is dark and terminal-inspired. Override semantic tokens in a stylesheet loaded after `terminal.css`; avoid copying component CSS into the consuming app.

```css
:root {
  --terminal-color-canvas: #07101f;
  --terminal-color-surface-1: #101c2d;
  --terminal-color-surface-2: #14243a;
  --terminal-color-border: rgb(143 185 229 / 28%);
  --terminal-color-text: #eff7ff;
  --terminal-color-text-muted: #a7b6ca;
  --terminal-color-accent: #79a9ff;
  --terminal-color-highlight: #8beaff;
  --terminal-color-success: #72e6ad;
  --terminal-color-warning: #ffd985;
  --terminal-color-danger: #ff6b6b;
}
```

`--terminal-color-*` variables are the supported palette contract. The older `--surface-*`, `--accent-neon-*`, `--comp-*`, and Tailwind semantic variables remain as compatibility aliases. Use `.terminal-theme` on a host element to opt into the package's font, foreground, background, and focus treatment; the package does not style `body` or apply global resets.

The palette roles are canvas, surface levels 1–3, border and strong border, text/muted/subtle text, primary accent, highlight, secondary accent, focus, and success/warning/danger/info. `--terminal-font-ui`, `--terminal-font-heading`, and `--terminal-font-mono` are overridable font stacks; `--terminal-space-unit` and the three `--terminal-control-height-*` tokens establish the compact spacing and control-size base.

## Geometry and states

- Major `TerminalPanel` and dialog surfaces clip the top-left and bottom-right corners and bracket the top-right and bottom-left.
- `TerminalCornerBrackets` provides the same decorative accents for app-owned surfaces; position the host element relatively and pass `color` only when a semantic token is not appropriate.
- Buttons use a top-left clipped corner. Inputs, textareas, selects, and compact data cells use simpler rectangular geometry.
- Semantic status and danger colors are separate from the primary accent. Pair color with text, icons, or another non-color cue.
- Disabled, invalid, focus-visible, and reduced-motion states should remain explicit when adding components.
- Use the Radix `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent` exports for tab interfaces. `TabButton` is a pressed toggle button, not a complete tablist.

## Build, tests, and visual catalog

```sh
npm run build
npm test
```

To inspect the static visual catalog from the workspace root:

```sh
npm run build --workspace @crix/terminal-ui
npm run dev -- --open /packages/terminal-ui/catalog.html
```

The catalog is a visual reference; component behavior is covered by tests and should still be validated in consuming applications.

## Contributions and releases

Keep reusable controls and patterns in `src/components/ui`; keep application features, product terminology, and product-specific layout rules in the consuming application. Add public exports in `src/index.ts`, keep component subpath exports buildable, update this guide when the public API changes, and run the package build and tests before tagging a release. Consumers should update both their dependency tag and any workspace/submodule reference together.
