import { isRef, Ref, shallowRef, unref, watch } from 'vue';

type WatchCallback<T> = (value: T, oldValue: T) => void;
interface WatchRefOptions<T> {
  setter: WatchCallback<T>;
  modelChange: WatchCallback<T>;
  deep: boolean;
}

/**
 * @description
 * This function provides a easier way to watch a ref.
 * 
 * @function watchRef
 */
export function watchRef<T>(propValue: Ref<T> | T, option: WatchRefOptions<T>): Ref<T>;
export function watchRef<T>(
  propValue: Ref<T> | T,
  setter?: (value: T, oldValue: T) => void,
  deep?: boolean,
): Ref<T>;
export function watchRef<T>(
  propValue: Ref<T> | T,
  setter?: (value: T, oldValue: T) => void,
  modelChange?: (value: T, oldValue: T) => void,
  deep?: boolean,
): Ref<T>;
export function watchRef<T>(propValue: Ref<T> | T, ...param: any[]): Ref<T> {
  let modelChange: WatchCallback<T> | undefined = undefined;
  let setter: WatchCallback<T> | undefined = undefined;
  let deep = false;
  if (typeof param[0] === 'function') {
    setter = param[0];
    if (typeof param[1] === 'function') {
      modelChange = param[1];
      deep = !!param[2];
    } else {
      deep = !!param[1];
    }



  } else if (param[0] && typeof param[0] === 'object') {
    const options = param[0];
    setter = options.setter;
    modelChange = options.modelChange;
    deep = options.deep;
  }

  const vmodel = shallowRef(unref(propValue)) as Ref<T>;
  if (isRef(propValue)) {
    watch(propValue, (value, oldValue) => {
      vmodel.value = value;
      modelChange?.(value, oldValue);
    }, { deep });
  }

  if (setter) {
    const inner = setter;
    watch(vmodel, (value, oldValue) => {
      inner(value, oldValue);
    }, { deep });
  }

  return vmodel;
}


