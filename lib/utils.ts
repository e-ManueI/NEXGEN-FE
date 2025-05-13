import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Type-safe adjustValue function
export function adjustValue<T extends Record<string, number>>(
  stateObj: T,
  updateFn: (key: keyof T, value: number) => void,
  key: keyof T,
  increment: boolean,
): void {
  const value = stateObj[key];
  // same step logic
  const step = value < 1 ? 0.1 : value < 10 ? 0.5 : value < 100 ? 1 : 10;

  // compute raw new value
  const raw = increment ? value + step : value - step;

  // figure out how many decimal places 'step' has
  const decimals = (step.toString().split(".")[1] || "").length;

  // round to that many decimal places
  const rounded = Number(raw.toFixed(decimals));

  updateFn(key, Math.max(0, rounded));
}
