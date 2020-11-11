import { defineComponent, inject, reactive, renderSlot } from "vue";
import { AccordionDispatcher } from './accordion_dispatcher';
import { AccordionItemSlotProps } from './accordion_type';

/**
 * @description
 * 
 * @date 2020-09-24
 * @export
 * @component CdkAccordionItem
 */
export const CdkAccordionItem = defineComponent({
  name: 'cdk-accordion-item',

  setup(props, ctx) {
    const state = reactive<AccordionItemSlotProps>({expanded: false});
    const dispatcher = inject(AccordionDispatcher.key)!;
    dispatcher.subscribe((value: boolean) => {
      state.expanded = value;
    });

    return () => (
      <>
        {renderSlot(ctx.slots, 'default', state)}
      </>
    );
  }
});
