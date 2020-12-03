import { Checkbox, CheckboxButton, CheckboxGroup, CheckboxGroupRef } from 'power-ui';

import { computed, defineComponent, ref, shallowRef } from 'vue';

export const CheckboxDoc = defineComponent(() => {
  const cities = ['广州', '上海', '北京', '深圳'];
  const city = shallowRef(['广州']);


  const city2 = shallowRef(['广州']);
  const checkedAll = computed(() => city2.value.length === cities.length);
  const indeterminateRef = computed(() => {
    const length = city2.value.length;
    return 0 < length && length < cities.length;
  });
  const groupRef = ref<CheckboxGroupRef | null>(null);
  const selectAll = (value: boolean) => {
    groupRef.value?.selectAll(value);
  };

  const city3 = shallowRef(['深圳']);

  return () => (
    <div>
      <h1>Checkbox 多选框</h1>
      <p>在这里添加描述</p>

      <h2>单一 Checkbox</h2>
      <p>
        <Checkbox>test</Checkbox>
      </p>

      <h2>Checkbox Group</h2>
      <p>
        <CheckboxGroup v-model={city.value}>
          {cities.map((value) => (
            <Checkbox value={value}>{value}</Checkbox>
          ))}
        </CheckboxGroup>
      </p>
      <h2>集成全选功能</h2>
      <p>
        <Checkbox
          indeterminate={indeterminateRef.value}
          checked={checkedAll.value}
          onChange={selectAll}
        >全选</Checkbox>
        <CheckboxGroup ref={groupRef} v-model={city2.value}>
          {cities.map((value) => (
            <Checkbox value={value}>{value}</Checkbox>
          ))}
        </CheckboxGroup>
      </p>
      <h2>以按钮形式展示</h2>
      <p>
        <CheckboxGroup v-model={city3.value}>
          {cities.map((value) => (
            <CheckboxButton value={value}>{value}</CheckboxButton>
          ))}
        </CheckboxGroup>
      </p>
    </div>
  );
});
