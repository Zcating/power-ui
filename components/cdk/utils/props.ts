import { PropType } from 'vue';

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



export const linkedProp = <T>(type: PropType<T>) => {
  const define: PropOptions = { type };
  const ret = (d?: DefaultProp<T>) => {
    define.default = d;
    return define;
  };

  ret.required = () => {
    define.required = true;
    return ret;
  };

  ret.validate = (fn: (value: unknown) => boolean) => {
    define.validator = fn;
    return ret;
  };

  return ret;
};



// const enum1 = <T extends string>() => linkedProp<T>(Enum<T>());

// enum1().validate(() => true)();

