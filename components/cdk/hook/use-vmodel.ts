import { computed, getCurrentInstance } from 'vue';

export function useVModel<T extends object, K extends keyof T>(this: void, state: T, name: K) {
  const instance = getCurrentInstance()!;
  return computed<T[K]>({
    get() {
      return state[name];
    },
    set(v) {
      instance.emit(`update:${name}`, v);
    }
  });
}