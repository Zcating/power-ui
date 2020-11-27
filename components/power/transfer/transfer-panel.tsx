import { Checkbox, CheckboxGroup } from 'power-ui/checkbox';
import { computed, defineComponent, ref, shallowReactive, toRef, VNode, watch } from 'vue';
import { vmodelRef } from 'vue-cdk/hook';
import { List, Method } from 'vue-cdk/utils';
import { TransferData } from './types';

function filterCount<T>(this: void, array: T[], where: (value: T, index: number, array: T[]) => boolean) {
  let count = 0;
  for (let i = 0; i < array.length; i++) {
    if (where(array[i], i, array)) {
      count++;
    }
  }
  return count;
}

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
    modelValue: {
      type: List<string>(),
      default: []
    }
  },
  setup(props, ctx) {
    const keysRef = vmodelRef(
      toRef(props, 'modelValue'),
      (value) => {
        ctx.emit('update:modelValue', value);
      }
    );

    const allChecked = ref(false);
    const enabledCount = computed(() => {
      const count = filterCount(props.dataSource, (data) => !data.disabled);
      allChecked.value = count !== 0 && count === keysRef.value.length;
      return count;
    });

    const isIndeterminate = computed(() => {
      const length = keysRef.value.length;
      const dataLength = enabledCount.value;
      return 0 < length && length < dataLength;
    });

    const checkedSummary = computed(() => {
      const keyLength = keysRef.value.length;
      const dataLength = props.dataSource.length;
      return `${keyLength}/${dataLength}`;
    });

    const handleAllChekcedChange = (value: boolean) => {
      if (value) {
        const allKeys: string[] = [];
        for (const data of props.dataSource) {
          if (data.disabled) {
            continue;
          }
          allKeys.push(data.key);
        }
        keysRef.value = Array.from(new Set([...keysRef.value, ...allKeys]));
      } else {
        keysRef.value = [];
      }
    };

    return () => {
      const { dataSource, title, filterable } = props;
      const hasFooter = !!ctx.slots.footer;
      return (
        <div class="el-transfer-panel">
          <p class="el-transfer-panel__header">
            <Checkbox
              v-model={[allChecked.value, 'checked']}
              indeterminate={isIndeterminate.value}
              onChange={handleAllChekcedChange}
            >
              {title}
              <span>{checkedSummary.value}</span>
            </Checkbox>
          </p>
          <div class={['el-transfer-panel__body', hasFooter ? 'is-with-footer' : '']}>
            <CheckboxGroup
              class={['el-transfer-panel__list', filterable ? 'is-filterable' : '']}
              v-model={keysRef.value}
              v-show={dataSource.length > 0}
            >
              {dataSource.map((data) => (
                <Checkbox
                  class="el-transfer-panel__item"
                  key={data.key}
                  value={data.key}
                  disabled={data.disabled}
                >
                  {data.label}
                </Checkbox>
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
