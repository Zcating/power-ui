import { defineComponent, reactive, watch } from 'vue';
import { CdkAccordion } from './accordion';
import { CdkAccordionItem } from './accordion-item';
import { AccordionItemState } from './types';

const WidgetBuilder = defineComponent({
  props: {
    value: Number
  },
  setup(props) {
    const state: AccordionItemState = reactive({ expanded: true });

    return () => (
      <CdkAccordionItem
        v-model={[state.expanded, 'expanded']}
        v-slots={{
          default: () => [
            <p>
              Item {props.value}：
              <button onClick={() => state.expanded = !state.expanded}>
                {state.expanded ? 'close' : 'expanded'}
              </button>
            </p>,
            <p v-show={state.expanded}>
              I only show if item {props.value} is expanded
            </p>
          ]
        }}
      />
    );
  }
});


export default defineComponent({
  name: 'cdk-selection-spec',
  setup() {
    const array = reactive([1, 2, 3, 4, 5]);
    const state = reactive({ multiple: false, selected: false });
    return () => (
      <>
        <div>
          accordion is {state.multiple ? 'multi' : 'single'}
        </div>
        <button
          onClick={() => state.multiple = !state.multiple}
          style="display: block;"
        >
          click me
        </button>
        <button
          onClick={() => state.selected = !state.selected}
        >
          {state.selected ? 'close' : 'open'}
        </button>

        <CdkAccordion multiple={state.multiple} expanded={state.selected}>
          {array.map((value, index) => <WidgetBuilder key={index} value={value} />)}
        </CdkAccordion>
      </>
    );
  }
});