import { ComponentProps, ReactNode, useId } from "react"

import { cn } from "../../utils"
import { Input } from "./input"

type TextInputProps = ComponentProps<typeof Input> & {
  label?: ReactNode
  hint?: ReactNode
  error?: string
  containerClassName?: string
}

function TextInput({
  label,
  hint,
  error,
  id,
  containerClassName,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}: TextInputProps) {
  const descriptionId = useId()
  const describedBy = [ariaDescribedBy, error || hint ? descriptionId : undefined]
    .filter(Boolean)
    .join(" ") || undefined

  return (
    <label className={cn("flex min-w-0 flex-col gap-1.5", containerClassName)} htmlFor={id}>
      {label && (
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      )}
      <Input
        id={id}
        aria-describedby={describedBy}
        aria-invalid={error ? true : ariaInvalid}
        className={className}
        {...props}
      />
      {error ? (
        <span id={descriptionId} className="text-xs text-destructive">{error}</span>
      ) : hint ? (
        <span id={descriptionId} className="text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  )
}

export { TextInput }
