import { clsx, type ClassValue } from "clsx"
import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);

  const day = date.getDate(); // 1–31
  const month = date.getMonth() + 1; // 0-based, so add 1
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
