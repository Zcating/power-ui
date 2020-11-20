import { CdkSelection, CdkSelectionItem } from '../cdk/selection';
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
          />
        ))}
      </CdkSelection>
    );
  }
});