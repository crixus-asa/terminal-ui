import { ReactNode } from "react"

import { cn } from "../../utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

type SelectInputOption = {
  value: string
  label: ReactNode
  disabled?: boolean
}

type SelectInputProps = {
  label?: ReactNode
  hint?: ReactNode
  value?: string
  defaultValue?: string
  placeholder?: string
  options: SelectInputOption[]
  onValueChange?: (value: string) => void
  disabled?: boolean
  id?: string
  containerClassName?: string
  triggerClassName?: string
}

function SelectInput({
  label,
  hint,
  value,
  defaultValue,
  placeholder = "Select...",
  options,
  onValueChange,
  disabled,
  id,
  containerClassName,
  triggerClassName,
}: SelectInputProps) {
  const labelId = id ? `${id}-label` : undefined

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", containerClassName)}>
      {label && (
        <span id={labelId} className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      )}
      <Select value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id={id} className={cn("w-full", triggerClassName)} aria-labelledby={labelId}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  )
}

export { SelectInput }
export type { SelectInputOption }
