import { Ref, ref, shallowRef, watch } from 'vue';


/**
 * @description
 * This function provides a easier way to watch v-model.
 * 
 * @function vmodelRef
 */
export function vmodelRef<T>(propValue: Ref<T>, setter?: (value: T) => void, modelChange?: (value: T) => void) {
  const vmodel = shallowRef(propValue.value) as Ref<T>;
  watch(propValue, value => {
    vmodel.value = value;
    modelChange?.(value);
  });
  if (typeof setter === 'function') {
    watch(vmodel, (value) => {
      setter(value);
    });
  }

  return vmodel;
}


