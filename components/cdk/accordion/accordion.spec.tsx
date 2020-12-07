import { defineComponent, reactive } from 'vue';
import { CdkAccordion } from './accordion';
import { CdkAccordionItem } from './accordion-item';
import { AccordionItemState } from './types';

const WidgetBuilder = defineComponent(({ value }: { value: number }) => {
  const state: AccordionItemState = reactive({ selected: false });
  return () => (
    <CdkAccordionItem
      v-model={[state.selected, 'selected']}
      v-slots={{
        default: () => [
          <p>
            Item {value}：
            <button onClick={() => state.selected = !state.selected}>
              {state.selected ? 'close' : 'expanded'}
            </button>
          </p>,
          <p v-show={state.selected}>
            I only show if item {value} is expanded
          </p>
        ]
      }}
    />
  );
});

WidgetBuilder.props = { value: Number };

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
          {array.map((value) => <WidgetBuilder value={value} />)}
        </CdkAccordion>
      </>
    );
  }
});