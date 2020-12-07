import { shallowRef, watch } from 'vue';
export const domRef = <T>(hook: (value: T) => void) => {
  const theRef = shallowRef<T | null>(null);
  watch(theRef, (value) => {
    if (!value) {
      return;
    }
    hook(value);
  });
  return theRef;
};
