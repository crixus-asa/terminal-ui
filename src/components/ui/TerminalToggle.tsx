import { ComponentProps, ReactNode } from "react"

import { cn } from "../../utils"
import { Switch } from "./switch"

type TerminalToggleProps = ComponentProps<typeof Switch> & {
  label?: ReactNode
  hint?: ReactNode
}

// Switch's thumb already translates via `data-[state=checked]:translate-x-5`.
function TerminalToggle({ label, hint, className, id, ...props }: TerminalToggleProps) {
  return (
    <label className="flex items-center justify-between gap-3" htmlFor={id}>
      <span className="flex flex-col gap-0.5">
        {label && <span className="text-sm font-medium text-foreground">{label}</span>}
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </span>
      <Switch id={id} className={cn("shrink-0", className)} {...props} />
    </label>
  )
}

export { TerminalToggle }
