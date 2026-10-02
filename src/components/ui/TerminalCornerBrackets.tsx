import type { CSSProperties } from "react"

import { cn } from "../../utils"

type TerminalCornerBracketsProps = {
  className?: string
  color?: string
}

function TerminalCornerBrackets({
  className,
  color = "var(--comp-panel-corner)",
}: TerminalCornerBracketsProps) {
  const style: CSSProperties = { borderColor: color }

  return (
    <>
      <span
        aria-hidden="true"
        className={cn("terminal-panel-corner terminal-panel-corner--top-right", className)}
        style={style}
      />
      <span
        aria-hidden="true"
        className={cn("terminal-panel-corner terminal-panel-corner--bottom-left", className)}
        style={style}
      />
    </>
  )
}

export { TerminalCornerBrackets }
