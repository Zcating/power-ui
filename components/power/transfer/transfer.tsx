import { computed, defineComponent, toRef } from 'vue';
import { Button } from 'power-ui';
import { watchRef } from 'vue-cdk/hook';
import { List } from 'vue-cdk/utils';
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
      type: List<string>(),
      default: []
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
  emits: ['update:targetKey'],
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

    // set target keys
    const addTo = (direction: 'left' | 'right') => {
      if (direction === 'left') {
        const rightValues = rightValuesRef.value;
        targetKeyRef.value = targetKeyRef.value.filter((key) => rightValues.indexOf(key) === -1);
        rightValuesRef.value = [];
      } else {
        targetKeyRef.value = [...leftValuesRef.value, ...targetKeyRef.value];
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
              {buttonTexts[0] ? <span>{buttonTexts[0]}</span> : null}
            </Button>
            <Button
              type="primary"
              class={['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']}
              onClick={() => addTo('right')}
              disabled={leftValues.length === 0}
            >
              {buttonTexts[1] ? <span>{buttonTexts[1]}</span> : null}
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
