import { defineComponent, renderSlot, toRef, watch } from "vue";
import { AccordionDispatcher } from './accordion_dispatcher';

/**
 * @description
 * 
 * @date 2020-09-24
 * @export
 * @component CdkAccordion
 */
export const CdkAccordionContainer = defineComponent({
  props: {
    multi: {
      type: Boolean,
      default: false,
    },
    expanded: {
      type: Boolean,
      default: false
    }
  },
  name: 'cdk-accordion-container',
  setup(props, ctx) {
    const dispatcher = new AccordionDispatcher();

    watch(toRef(props, 'expanded'), (value) => {
      if (props.multi) {
        dispatcher.notify(value);
      }
    });
    
    return () => (
      <>      
        {renderSlot(ctx.slots, 'default')}
      </>
    );
  }
});