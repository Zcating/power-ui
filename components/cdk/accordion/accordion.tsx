import { defineComponent, renderSlot, watch } from 'vue';
import { CdkAccordionDispatcher } from './accordion-dispatcher';

/**
 * @description
 * 
 * @date 2020-09-24
 * @export
 * @component CdkAccordion
 */
export const CdkAccordion = defineComponent({
  name: 'cdk-accordion',
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    expanded: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const dispatcher = new CdkAccordionDispatcher();

    watch(() => props.expanded, (value) => {
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
      </>
    );
  }
});