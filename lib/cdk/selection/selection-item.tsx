import { computed, defineComponent, Fragment, reactive, renderSlot, watch } from 'vue';
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
    }
  },
  setup(props, ctx) {
    const state = reactive<SelectionItemState>({ selected: false });

    const dispatcher = CdkSelectionDispatcher.instance();
    if (dispatcher) {
      dispatcher.subscribe(props.value, state);
    }

    const data = computed(() => {
      return {
        label: props.label,
        value: props.value,
      };
    });
    watch(() => state.selected, (value) => {
      if (!dispatcher) {
        return;
      }

      if (value) {
        dispatcher.select(data.value);
      } else {
        dispatcher.deselect(props.value);
      }
    });

    return () => (
      <Fragment key={props.value}>
        {renderSlot(ctx.slots, 'default', state)}
      </Fragment>
    );
  }
});
