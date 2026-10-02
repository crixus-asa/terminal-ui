import type { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "../../utils"

type TabButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary"
  isActive?: boolean
  children?: ReactNode
}

function TabButton({ className, variant = "primary", isActive = false, type = "button", ...props }: TabButtonProps) {
  return (
    <button
      type={type}
      data-slot="button"
      aria-pressed={isActive}
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        "clip-btn inline-flex min-h-[var(--terminal-control-height-md)] min-w-0 flex-1 items-center justify-center gap-1.5 border px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors duration-150 outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
        isActive
          ? "border-primary/50 bg-primary/20 text-primary"
          : "border-transparent bg-transparent text-muted-foreground hover:text-foreground",
        variant === "secondary" && !isActive && "text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export { TabButton }
