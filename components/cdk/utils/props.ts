import { ComponentPropsOptions, Prop, PropType } from 'vue';

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

type DefaultProp<T> = T | (() => T);

interface PropOptions<T = any> {
  type?: PropType<T>;
  required?: boolean;
  default?: DefaultProp<T>;
  validator?(value: unknown): boolean;
}

const linkedProp = <T>(define: PropOptions<T>) => {
  const that = {
    required() {
      define.required = true;
      return that;
    },
    validate(fn: (value: unknown) => boolean) {
      define.validator = fn;
      return that;
    },
    gen() {
      return define;
    }
  };
  return that;
};


export const defineProp = {
  string(d?: DefaultProp<String>) {
    const define = {
      type: String,
      default: d,
    };
    return linkedProp(define);
  },

  enum<T extends string>(d?: DefaultProp<T>) {
    const define = {
      type: Enum<T>(),
      default: d
    };
    return linkedProp(define);

  },

  method<T extends Function>(d?: DefaultProp<T>) {
    const define = {
      type: Method<T>(),
      default: d
    };
    return linkedProp(define);
  },

  model<T extends Object>(d?: T) {
    const define = {
      type: Model<T>(),
      default: d
    };
    return linkedProp(define);
  }
};
