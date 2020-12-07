import { inject, InjectionKey, provide, readonly, Ref, shallowRef } from 'vue';

const token = Symbol() as InjectionKey<Ref<{ label: string }[]>>;
export const getItems = () => {
  const itemsRef = shallowRef<{ label: string }[]>([]);
  provide(token, itemsRef);
  return readonly({ value: itemsRef });
};

export const setItem = (item: { label: string }) => {
  const items = inject(token, null);
  if (!items) {
    throw Error('Item must have parent node.');
  }
  items.value = [...items.value, item];
};
