import { Checkbox, CheckboxGroup } from 'power-ui/index';

import { computed, defineComponent, ref, shallowRef } from 'vue';

export const CheckboxDoc = defineComponent((_, ctx) => {
  const cities = ['广州', '上海', '北京', '深圳'];
  const city = shallowRef(['广州']);


  const city2 = shallowRef(['广州']);
  const selectAll = ref(false);
  const indeterminateRef = computed(() => {
    const length = city2.value.length;
    return 0 < length && length < 4;
  });

  return () => (
    <div>
      <p>
        <Checkbox>test</Checkbox>
      </p>
      <p>
        <CheckboxGroup v-model={city.value}>
          {cities.map((value) => (
            <Checkbox value={value}>{value}</Checkbox>
          ))}
        </CheckboxGroup>
      </p>
      <p>
        <Checkbox indeterminate={indeterminateRef.value} v-model={selectAll.value}>全选</Checkbox>
        <CheckboxGroup v-model={city.value} onChange={() => {

        }}>
          {cities.map((value) => (
            <Checkbox value={value}>{value}</Checkbox>
          ))}
        </CheckboxGroup>
      </p>
    </div>
  );
});
