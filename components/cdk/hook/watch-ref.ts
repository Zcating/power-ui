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
  const theRef = shallowRef(unref(propValue)) as Ref<T>;

  if (typeof refChange === 'function') {
    watch(theRef, (value, oldValue) => {
      refChange(value, oldValue);
    }, { flush: 'sync' });
  }

  // propValueChange?.(vmodel.value);
  if (isRef(propValue)) {
    watch(propValue, (value, oldValue) => {
      theRef.value = value;
      propValueChange?.(value, oldValue);
    });
  } else {
    watch(() => propValue, (value, oldValue) => {
      theRef.value = value;
      propValueChange?.(value, oldValue);
    });
  }

  return theRef;
}

export function watchDeepRef<T>(
  propValue: Ref<T> | T,
  setter?: (value: T, oldValue: T) => void,
  modelChange?: (value: T, oldValue: T) => void
): Ref<T> {
  const theRef = ref(unref(propValue)) as Ref<T>;
  if (isRef(propValue)) {
    watch(propValue, (value, oldValue) => {
      theRef.value = value;
      modelChange?.(value, oldValue);
    }, { deep: true });
  }

  if (setter) {
    const inner = setter;
    watch(theRef, (value, oldValue) => {
      inner(value, oldValue);
    }, { deep: true });
  }

  return theRef;
}
