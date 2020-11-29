import { computed, defineComponent, shallowRef, toRef } from 'vue';
import { Button } from 'power-ui';
import { watchRef } from 'vue-cdk/hook';
import { List, renderCondition } from 'vue-cdk/utils';
import { TransferPanel } from './transfer-panel';
import { TransferData } from './types';


export const Transfer = defineComponent({
  name: 'po-transfer',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    buttonTexts: {
      type: List<string>(),
      default: [],
    },
    targetKey: {
      type: List<string>(),
      default: []
    },
    dataSource: {
      type: List<TransferData>(),
      default: []
    },
    titles: {

    },
    leftDefaultKeys: {
      type: List<string>(),
      default: []
    },
    rightDefaultKeys: {
      type: List<string>(),
      default: []
    },
  },
  setup(props, ctx) {
    const targetKeyRef = watchRef(toRef(props, 'targetKey'), (value) => ctx.emit('update:targetKey', value));

    const leftValuesRef = watchRef(toRef(props, 'leftDefaultKeys'));
    const rightValuesRef = watchRef(toRef(props, 'rightDefaultKeys'));

    const leftItemsRef = computed(() => {
      return props.dataSource.filter((data) => {
        return targetKeyRef.value.indexOf(data.key) === -1;
      });
    });

    const rightItemsRef = computed(() => {
      return props.dataSource.filter((data) => {
        return targetKeyRef.value.indexOf(data.key) !== -1;
      });
    });

    const addTo = (direction: 'left' | 'right') => {
      if (direction === 'left') {
        const rightValues = rightValuesRef.value;
        targetKeyRef.value = targetKeyRef.value.filter((key) => {
          return rightValues.indexOf(key) === -1;
        });
        rightValuesRef.value = [];
      } else {
        targetKeyRef.value = Array.from(new Set([...leftValuesRef.value, ...targetKeyRef.value]));
        leftValuesRef.value = [];
      }
    };

    return () => {
      const { buttonTexts } = props;
      const leftValues = leftValuesRef.value;
      const rightValues = rightValuesRef.value;
      const hasButtonTexts = buttonTexts.length === 2;
      const leftItems = leftItemsRef.value;
      const rightItems = rightItemsRef.value;
      return (
        <div class="el-transfer">
          <TransferPanel
            dataSource={leftItems}
            v-model={leftValuesRef.value}
            v-slots={{ footer: ctx.slots.footer }}
          />
          <div class="el-transfer__buttons">
            <Button
              type="primary"
              class={['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']}
              onClick={() => addTo('left')}
              disabled={rightValues.length === 0}
            >
              <i class="el-icon-arrow-left" />
              {renderCondition(
                buttonTexts[0],
                (value) => <span>{value}</span>
              )}
            </Button>
            <Button
              type="primary"
              class={['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']}
              onClick={() => addTo('right')}
              disabled={leftValues.length === 0}
            >
              {renderCondition(
                buttonTexts[1],
                (value) => <span>{value}</span>
              )}
              <i class="el-icon-arrow-right" />
            </Button>
          </div>
          <TransferPanel
            dataSource={rightItems}
            v-model={rightValuesRef.value}
            v-slots={{ footer: ctx.slots.footer }}
          />
        </div>
      );
    };
  }
});
