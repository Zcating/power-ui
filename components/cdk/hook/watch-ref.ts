import { isRef, ref, Ref, shallowRef, unref, watch } from 'vue';

/**
 * @description
 * This function provides a easier way to watch a ref.
 * 
 * @function watchRef
 */
export function watchRef<T>(
  propValue: Ref<T> | T,
  refChange?: (value: T, oldValue: T) => void,
  propValueChange?: (value: T, oldValue?: T) => void,
): Ref<T> {
  const vmodel = shallowRef(unref(propValue)) as Ref<T>;
  // propValueChange?.(vmodel.value);
  if (isRef(propValue)) {
    watch(propValue, (value, oldValue) => {
      vmodel.value = value;
      propValueChange?.(value, oldValue);
    }, { deep: false });
  } else {
    watch(() => propValue, (value, oldValue) => {
      vmodel.value = value;
      propValueChange?.(value, oldValue);
    }, { deep: false });
  }

  if (typeof refChange === 'function') {
    watch(vmodel, (value, oldValue) => {
      refChange(value, oldValue);
    }, { deep: false });
  }

  return vmodel;
}

export function watchDeepRef<T>(
  propValue: Ref<T> | T,
  setter?: (value: T, oldValue: T) => void,
  modelChange?: (value: T, oldValue: T) => void
): Ref<T> {
  const vmodel = ref(unref(propValue)) as Ref<T>;
  if (isRef(propValue)) {
    watch(propValue, (value, oldValue) => {
      vmodel.value = value;
      modelChange?.(value, oldValue);
    }, { deep: true });
  }

  if (setter) {
    const inner = setter;
    watch(vmodel, (value, oldValue) => {
      inner(value, oldValue);
    }, { deep: true });
  }

  return vmodel;
}
