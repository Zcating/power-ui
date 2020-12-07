import { defineComponent, reactive, renderSlot, watch } from 'vue';
import { CdkAccordionDispatcher } from './accordion-dispatcher';
import { AccordionItemState } from './types';

/**
 * @description
 * 
 * @date 2020-09-24
 * @export
 * @component CdkAccordionItem
 */
export const CdkAccordionItem = defineComponent({
  name: 'cdk-accordion-item',
  props: {
    expanded: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const state = reactive<AccordionItemState>({ selected: props.expanded });

    const dispatcher = CdkAccordionDispatcher.instance();
    if (dispatcher) {
      dispatcher.subscribe(state);
      watch(() => props.expanded, (value) => {
        if (value === state.selected) {
          return;
        }
        state.selected = value;
      });

      watch(() => state.selected, (value) => {
        if (props.expanded === value) {
          return;
        }
        ctx.emit('update:expanded', value);
      }, { immediate: true });
    }

    return () => renderSlot(ctx.slots, 'default');
  }
});
