import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { TabButton } from "../src/components/ui/TabButton"
import { TerminalCornerBrackets } from "../src/components/ui/TerminalCornerBrackets"
import { TerminalPanel } from "../src/components/ui/TerminalPanel"
import { TextInput } from "../src/components/ui/TextInput"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../src/components/ui/tabs"

describe("shared UI component semantics", () => {
  it("renders decorative corner brackets as hidden from assistive technology", () => {
    const markup = renderToStaticMarkup(<TerminalCornerBrackets color="red" />)

    expect(markup.match(/aria-hidden="true"/g)).toHaveLength(2)
    expect(markup.match(/border-color:red/g)).toHaveLength(2)
    expect(markup.match(/terminal-panel-corner--/g)).toHaveLength(2)
  })

  it("associates TextInput help and errors with the input", () => {
    const markup = renderToStaticMarkup(
      <TextInput id="email" label="Email" error="Enter a valid email address" />
    )
    const input = markup.match(/<input\b[^>]*>/)?.[0]
    const descriptionId = input?.match(/aria-describedby="([^"]+)"/)?.[1]

    expect(input).toContain('aria-invalid="true"')
    expect(descriptionId).toBeTruthy()
    expect(markup).toContain(`id="${descriptionId}"`)
    expect(markup).toContain("Enter a valid email address")
  })

  it("keeps toggle-style tab buttons as native pressed buttons", () => {
    const markup = renderToStaticMarkup(
      <TabButton isActive>Settings</TabButton>
    )

    expect(markup).toContain('data-slot="button"')
    expect(markup).toContain('aria-pressed="true"')
    expect(markup).not.toContain('role="tab"')
  })

  it("preserves Radix tab roles and selected state", () => {
    const markup = renderToStaticMarkup(
      <Tabs defaultValue="general">
        <TabsList aria-label="Settings sections">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="general">General settings</TabsContent>
      </Tabs>
    )

    expect(markup).toContain('role="tablist"')
    expect(markup).toContain('role="tab"')
    expect(markup).toContain('aria-selected="true"')
    expect(markup).toContain('role="tabpanel"')
  })

  it("renders a panel with two unclipped-corner brackets", () => {
    const markup = renderToStaticMarkup(
      <TerminalPanel title="System status">Online</TerminalPanel>
    )

    expect(markup).toContain('data-slot="terminal-panel"')
    expect(markup).toContain("clip-path:var(--clip-xl)")
    expect(markup.match(/terminal-panel-corner--/g)).toHaveLength(2)
  })
})
