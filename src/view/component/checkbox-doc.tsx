import { Checkbox, CheckboxGroup } from 'power-ui/index';

import { defineComponent, shallowRef } from 'vue';

export const CheckboxDoc = defineComponent((_, ctx) => {
  const city = shallowRef(['广州']);
  return () => (
    <div>
      <p>
        <Checkbox>test</Checkbox>
      </p>
      <p>
        <CheckboxGroup v-model={city.value}>
          <Checkbox value="广州">广州</Checkbox>
          <Checkbox value="上海">上海</Checkbox>
          <Checkbox value="北京">北京</Checkbox>
          <Checkbox value="深圳">深圳</Checkbox>
        </CheckboxGroup>
      </p>
    </div>
  );
});
