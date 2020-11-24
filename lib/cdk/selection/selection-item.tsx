import { computed, defineComponent, Fragment, h, reactive, renderSlot, watch } from 'vue';
import { CdkSelectionDispatcher } from './selection-dispatcher';
import { SelectionItemState } from './types';

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
    label: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      required: true,
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const state = reactive<SelectionItemState>({ selected: false });

    const dispatcher = CdkSelectionDispatcher.instance();
    if (dispatcher) {
      dispatcher.subscribe(props.value, state);
      const data = computed(() => {
        return {
          label: props.label,
          value: props.value,
        };
      });
      watch(() => state.selected, (value) => {
        if (value) {
          dispatcher.select(data.value);
        } else {
          dispatcher.deselect(props.value);
        }
        ctx.emit('update:modelValue', value);
      });

      watch(() => props.modelValue, (value) => {
        state.selected = value;
      });
    }


    return () => (
      <Fragment key={props.value}>
        {renderSlot(ctx.slots, 'default')}
      </Fragment>
    );
  }
});
