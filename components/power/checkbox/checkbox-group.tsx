import { CdkSelection, ItemData, OptionItemData } from 'vue-cdk/selection';
import { List } from 'vue-cdk/utils';
import { defineComponent, watch } from 'vue';

export const CheckboxGroup = defineComponent({
  props: {
    dataSource: {
      type: List<{ label: string, value: string | number }>(),
      default: [],
    },
    modelValue: {
      type: List<string | number>(),
      default: []
    },
    selectAll: {
      type: Boolean,
      default: false
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
        selected={props.selectAll}
        onSelected={handleSelected}
        initValue={props.modelValue}
      >
        {ctx.slots.default?.()}
      </CdkSelection>
    );
  }
});