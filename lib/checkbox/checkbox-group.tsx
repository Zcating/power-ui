import { CdkSelection, ItemData, OptionItemData } from '../cdk/selection';
import { List } from '../cdk/utils';
import { defineComponent } from 'vue';

export const CheckboxGroup = defineComponent({
  props: {
    dataSource: {
      type: List<{ label: string, value: string | number }>(),
      default: [],
    },
    modelValue: {
      type: List<string | number>(),
      default: []
    }
  },
  emits: {
    'update:modelValue': (value: (string | number)[]) => true
  },
  setup(props, ctx) {
    // multiple will always return array.
    const handleSelected = (items: OptionItemData) => {
      ctx.emit('update:modelValue', (items as ItemData[]).map(item => item.value));
    };

    // onselect
    return () => (
      <CdkSelection
        multiple={true}
        selected={false}
        onSelected={handleSelected}
        initValue={props.modelValue}
      >
        {ctx.slots.default?.()}
      </CdkSelection>
    );
  }
});