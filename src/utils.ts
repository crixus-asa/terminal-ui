import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidUrl(value: string) {
  if (!value.trim()) return false
  try { new URL(value); return true } catch { return false }
}
