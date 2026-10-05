import { ComponentProps, CSSProperties, ReactNode } from "react"

import { cn } from "../../utils"
import { TerminalCornerBrackets } from "./TerminalCornerBrackets"

type TerminalPanelProps = ComponentProps<"div"> & {
  eyebrow?: ReactNode
  title?: ReactNode
  actions?: ReactNode
}

function TerminalPanel({
  eyebrow,
  title,
  actions,
  className,
  style,
  children,
  ...props
}: TerminalPanelProps) {
  const panelStyle: CSSProperties = {
    border: "1px solid var(--comp-panel-border)",
    background: "var(--comp-panel-bg)",
    fontFamily: "var(--comp-panel-font)",
    clipPath: "var(--clip-xl)",
    ...style,
  }

  return (
    <div
      data-slot="terminal-panel"
      className={cn(
        "relative flex flex-col gap-[var(--terminal-section-gap)] p-[var(--terminal-panel-padding)]",
        className
      )}
      style={panelStyle}
      {...props}
    >
      <TerminalCornerBrackets />
      {(eyebrow || title || actions) && (
        <header className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-[var(--terminal-space-1)]">
            {eyebrow && (
              <span className="text-[length:var(--terminal-font-size-caption)] leading-[var(--terminal-line-height-tight)] uppercase tracking-[0.12em] text-[var(--comp-panel-label)]">
                {eyebrow}
              </span>
            )}
            {title && (
              <h3 className="text-[length:var(--terminal-font-size-body)] leading-[var(--terminal-line-height-tight)] font-semibold text-foreground">
                {title}
              </h3>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 items-center gap-[var(--terminal-space-2)]">
              {actions}
            </div>
          )}
        </header>
      )}
      {children}
    </div>
  )
}

export { TerminalPanel }
