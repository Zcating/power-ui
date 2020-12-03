import { defineComponent, reactive, watch } from 'vue';
import { useDispatcher } from './selection-dispatcher';

/**
 * @description
 * 
 * @date 2020-09-24
 * @export
 * @component CdkSelectionItem
 */
export const CdkSelectionItem = defineComponent({
  name: 'cdk-selection-item',
  props: {
    value: {
      type: [String, Number],
      required: true,
    },

    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const state = reactive({ selected: props.modelValue });

    const dispatcher = useDispatcher();
    if (dispatcher) {
      dispatcher.subscribe(props.value, state);
      watch(() => props.modelValue, (value) => {
        if (value === state.selected) {
          return;
        }
        state.selected = value;
      });
      watch(() => state.selected, (value) => {
        if (value === props.modelValue) {
          return;
        }
        ctx.emit('update:modelValue', value);
      }, { immediate: true });
    }

    return () => ctx.slots.default?.();
  }
});
