import { isRef, Ref, shallowRef, unref, watch } from 'vue';


/**
 * @description
 * This function provides a easier way to watch a ref.
 * 
 * @function watchRef
 */
export function watchRef<T>(propValue: Ref<T> | T, setter?: (value: T, oldValue: T) => void, modelChange?: (value: T, oldValue: T) => void) {
  const vmodel = shallowRef(unref(propValue)) as Ref<T>;
  if (isRef(propValue)) {
    watch(propValue, (value, oldValue) => {
      vmodel.value = value;
      modelChange?.(value, oldValue);
    }, { deep: true });
  }

  if (typeof setter === 'function') {
    watch(vmodel, (value, oldValue) => {
      setter(value, oldValue);
    });
  }

  return vmodel;
}


