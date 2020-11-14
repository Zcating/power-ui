import { Method, renderCondition } from '../utils';
import { defineComponent, renderSlot, watch } from "vue";
import { CdkSelectionDispatcher } from './selection-dispatcher';

/**
 * @description
 * 
 * @date 2020-09-24
 * @export
 * @component CdkSelection
 */
export const CdkSelection = defineComponent({
  name: 'cdk-selection',
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const dispatcher = new CdkSelectionDispatcher();

    watch(() => props.selected, (value) => {
      if (props.multiple) {
        dispatcher.notify(value);
      }
    }, { immediate: true });

    watch(() => props.multiple, (value) => {
      dispatcher.multiple = value;
    }, { immediate: true });

    return () => (
      <>
        {renderSlot(ctx.slots, 'default')}
        {renderCondition(dispatcher.count.value === 0,
          renderSlot(ctx.slots, 'empty')
        )}
      </>
    );
  }
});