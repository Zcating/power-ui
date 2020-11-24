import { Checkbox, CheckboxGroup } from '../../../lib';
import { defineComponent, ref } from 'vue';

export const CheckboxDoc = defineComponent({
  setup(_, ctx) {
    const city = ref('广州');
    return () => (
      <div>
        <p>
          <Checkbox>test</Checkbox>
        </p>
        <p>
          <CheckboxGroup v-model={city.value}>
            <Checkbox value="广州">官洲</Checkbox>
            <Checkbox value="上海">上海</Checkbox>
            <Checkbox value="北京">北京</Checkbox>
            <Checkbox value="深圳">深圳</Checkbox>
          </CheckboxGroup>
        </p>
      </div>
    );
  },
});