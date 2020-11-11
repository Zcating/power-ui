import { Ref, UnwrapRef, isRef, customRef, watch, WatchSource } from "vue";


type MapSources<T> = {
  [K in keyof T]: T[K] extends WatchSource<infer V> ? V : T[K] extends object ? T[K] : never;
};

export type ArraySource = Readonly<Array<WatchSource<unknown> | object>>;

export function watchRef<T extends ArraySource, V>(arg: T, fn: (arg: MapSources<T>) => V): Ref<V>;

export function watchRef<T extends Ref<any>, V>(arg: T, fn?: (arg: UnwrapRef<T>) => V): Ref<V>;

export function watchRef<T extends any, V>(arg: T, fn: (arg: any) => V = (args) => args): Ref<V> {
  let watchSource: any;
  if (Array.isArray(arg)) {
    watchSource = () => arg;
  } else if (isRef(arg)) {
    watchSource = arg;
  } else {
    throw Error('');
  }
  return customRef((track, trigger) => {
    let value: V;
    watch(watchSource, (source) => {
      value = fn(source);
    }, { immediate: true });

    return {
      get() {
        track();
        return value;
      },
      set(newValue: V) {
        value = newValue;
        trigger();
      }
    }
  });
}
