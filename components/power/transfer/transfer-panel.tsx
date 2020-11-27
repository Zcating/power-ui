import { Checkbox, CheckboxGroup } from 'power-ui/checkbox';
import { computed, defineComponent, shallowReactive, toRef } from 'vue';
import { vmodelRef } from 'vue-cdk/hook';
import { List, Method } from 'vue-cdk/utils';
import { TransferData } from './types';

export const TransferPanel = defineComponent({
  name: 'po-transfer-panel',
  props: {
    dataSource: {
      type: List<TransferData>(),
      default: []
    },
    filterable: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '列表'
    },
    format: {
      type: Method<() => void>(),
      default: () => { }
    },
    modelValue: {
      type: List<string>(),
      default: []
    }
  },
  setup(props, ctx) {

    const state = shallowReactive({
      allChecked: false,
      isIndeterminate: false,
    });

    const keysRef = vmodelRef(
      toRef(props, 'modelValue'),
      (value) => {
        ctx.emit('update:modelValue', value);
      },
      (value) => {
        // console.trace();
      }
    );

    const handleAllCheckedChange = (value: boolean) => {
      const allKeys = props.dataSource.map(data => data.key);
      keysRef.value = Array.from(new Set(...keysRef.value, ...allKeys));
    };

    const checkedSummary = computed(() => {
      const keyLength = keysRef.value.length;
      const dataLength = props.dataSource.length;
      return `${keyLength}/${dataLength}`;
    });

    return () => {
      const { dataSource, title, filterable } = props;
      const { allChecked, isIndeterminate } = state;
      return (
        <div class="el-transfer-panel">
          <p class="el-transfer-panel__header">
            <Checkbox
              v-model={[allChecked, 'checked']}
              onChange={handleAllCheckedChange}
              indeterminate={isIndeterminate}
            >
              {title}
              <span>{checkedSummary.value}</span>
            </Checkbox>
          </p>
          <div class={['el-transfer-panel__body']}>
            <CheckboxGroup
              v-model={keysRef.value}
              v-show={dataSource.length > 0}
              class={['el-transfer-panel__list', { 'is-filterable': filterable }]}
            >
              {dataSource.map((data) => (
                <Checkbox key={data.key} value={data.key} disabled={data.disabled}>{data.label}</Checkbox>
              ))}
            </CheckboxGroup>
            <p class="el-transfer-panel__empty" v-show="hasNoMatch"></p>
            <p class="el-transfer-panel__empty" v-show={dataSource.length === 0}></p>
          </div>
        </div>
      );
    };
  }
});
