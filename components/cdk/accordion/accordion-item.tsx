import { defineComponent, reactive, toRef, watch } from 'vue';
import { watchRef } from 'vue-cdk/hook';
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
  inheritAttrs: false,
  props: {
    expanded: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const state: AccordionItemState = reactive({
      expanded: watchRef(
        toRef(props, 'expanded'),
        (value) => ctx.emit('update:expanded', value))
    });

    const dispatcher = CdkAccordionDispatcher.instance();
    if (dispatcher) {
      dispatcher.subscribe(state);
    }

    return () => ctx.slots.default?.();
  }
});
