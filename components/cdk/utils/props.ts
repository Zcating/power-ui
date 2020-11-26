import { Prop } from 'vue';

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


export function defineList<T>(d?: T[], validator?: (val: any) => boolean): Prop<T[]> {
  return {
    type: List<T>(),
    default: d
  };
}

export function defineNumber(d?: number, validator?: (val: any) => boolean): Prop<number> {
  return {
    type: Number,
    default: d,
    validator
  };
}

export function defineString(d?: string, validator?: (val: any) => boolean) {
  return {
    type: String,
    default: d,
    validator
  };
}

export function defineEnum<T extends string>(d?: T, validator?: (val: any) => boolean): Prop<T> {
  return {
    type: Enum<T>(),
    default: d,
    validator
  };
}

export function defineMethod<T extends Function>(d?: T, validator?: (val: any) => boolean): Prop<T> {
  return {
    type: Model<T>(),
    default: d,
    validator
  };
} 