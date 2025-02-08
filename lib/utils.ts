import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toPlainObject<T extends object>(data: T): T {
  if (data == null || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.reduce((acc, item, index) => {
      acc[index] = toPlainObject(item);
      return acc;
    }, {} as T);
  }

  return Object.entries(data).reduce((acc, [key, value]) => {
    (acc as Record<string, unknown>)[key] = value && typeof value === 'object' ? toPlainObject(value) : value;
    return acc;
  }, {} as T);
}

