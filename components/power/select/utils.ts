import { inject, InjectionKey, provide } from 'vue';

const token = Symbol() as InjectionKey<Map<string | number, string>>;

export const provideDescMap = () => {
  const map = new Map();
  provide(token, map);
  return map;
};

export const useDescMap = () => inject(token, undefined);