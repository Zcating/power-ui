import { defineComponent, reactive } from "vue";
import { CdkAccordion } from './accordion';
import { AccordionItemSlotProps } from './accordion_type';

const widgetFactory = (value: number) => (state: AccordionItemSlotProps) => [
  <p>
    Item {value} :
      <button onClick={() => state.expanded = !state.expanded}>
      {state.expanded ? 'close' : 'expanded'}
    </button>
  </p>,
  <p v-show={state.expanded}>
    I only show if item {value} is expanded
  </p>
]

export default defineComponent({
  name: 'cdk-accordion-spec',
  setup() {
    const array = reactive([1, 2, 3, 4, 5]);
    const accordion = new CdkAccordion(array.map(widgetFactory));
    return () => (
      <>
        <div>
          accordion is {accordion.multi ? 'multi' : 'single'}
        </div>
        <button
          onClick={() => accordion.multi = !accordion.multi}
          style="display: block;"
        >
          click me
        </button>
        <button
          onClick={() => accordion.expanded ? accordion.closeAll() : accordion.openAll()}
        >
          {accordion.expanded ? 'close' : 'open'}
        </button>

        <accordion.element />
      </>
    );
  }
})