import { CdkSelection, CdkSelectionItem } from '../cdk/selection';
import { List } from '../cdk/utils';
import { defineComponent } from 'vue';
import { Checkbox } from './checkbox';

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
  setup(props, ctx) {

    // onselect

    return () => (
      <CdkSelection
        multiple={true}
        selected={false}
      >
        {props.dataSource.map((data) => (
          <CdkSelectionItem
            value={data.value}
            label={data.label}
            v-slots={{
              default: (state: { selected: boolean }) => (
                <Checkbox v-model={state.selected}>{data.label}</Checkbox>
              )
            }}
          />
        ))}
      </CdkSelection>
    );
  }
});