export function Method<T>(): () => T {
  return Function as unknown as () => T;
}

export function List<T>(): () => T[] {
  return Array as () => T[];
}

export function Model<T>(): () => T {
  return Object as () => T;
}

export function Enum<T extends string>(): () => T {
  return String as unknown as () => T;
}

