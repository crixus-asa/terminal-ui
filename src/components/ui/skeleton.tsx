import { cn } from "../../utils"
import { ComponentProps } from "react"

function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("rounded-md skeleton-shimmer", className)}
      {...props}
    />
  )
}

export { Skeleton }
