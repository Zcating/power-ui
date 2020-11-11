import { computed, ref, Ref, watch } from 'vue';


/**
 * @description
 * This function provides a easier way to watch v-model.
 * 
 * @function vmodelRef
 */
export function vmodelRef<T>(propValue: Ref<T>, setter: (value: T) => void, modelChange?: (value: T) => void) {
  const vmodel = ref(propValue.value) as Ref<T>;
  watch(propValue, value => {
    vmodel.value = value;
    modelChange?.(value);
  });

  return computed<T>({
    get() {
      return vmodel.value;
    },
    set(newValue: any) {
      vmodel.value = newValue;
      setter(newValue);
    }
  });
}