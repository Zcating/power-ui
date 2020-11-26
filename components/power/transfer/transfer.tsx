import { Button } from 'power-ui/button/button';
import { computed, defineComponent, ref, shallowRef, toRef, watch } from 'vue';
import { vmodelRef } from 'vue-cdk/hook';
import { List, renderCondition } from 'vue-cdk/utils';
import { TransferPanel } from './transfer-panel';

export interface TransferRenderProps {
  disabled: boolean;
}

export interface TransferData {
  key: string;
  label: string;
  disabled: boolean;
}

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
  },
  setup(props, ctx) {
    const leftValuesRef = shallowRef<string[]>([]);
    const rightValuesRef = shallowRef<string[]>([]);

    const onSelected = () => { };

    const add = (direction: 'left' | 'right') => {
      if (direction === 'left') {

      } else {

      }
    };

    const modelRef = vmodelRef(toRef(props, 'targetKey'), (value) => ctx.emit('update:targetKey', value));

    const leftItems = computed(() => {
      return props.dataSource.filter((data) => {
        return modelRef.value.indexOf(data.key) === -1;
      });
    });

    const rightItems = computed(() => {
      return props.dataSource.filter((data) => {
        return modelRef.value.indexOf(data.key) !== -1;
      });
    });

    // const 
    return () => {
      // const renderProps: TransferRenderProps = {
      //   disabled: props.disabled,
      //   onSelected: 
      // }
      const { buttonTexts } = props;
      const leftValues = leftValuesRef.value;
      const rightValues = rightValuesRef.value;
      const hasButtonTexts = buttonTexts.length === 2;
      return (
        <div class="el-transfer">
          {/* <TransferPanel dataSource={leftItems} /> */}
          <div class="el-transfer__buttons">
            <Button
              type="primary"
              class={['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']}
              onClick={() => add('left')}
              disabled={leftValues.length === 0}
            >
              <i class="el-icon-arrow-left" />
              {renderCondition(
                typeof buttonTexts[0] === 'string',
                () => <span>{buttonTexts[0]}</span>
              )}
            </Button>
            <Button
              type="primary"
              class={['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']}
              onClick={() => add('right')}
              disabled={rightValues.length === 0}
            >
              {renderCondition(
                typeof buttonTexts[1] === 'string',
                () => <span>{buttonTexts[1]}</span>
              )}
              <i class="el-icon-arrow-right" />
            </Button>
          </div>
          {/* <TransferPanel dataSource={rightItems} /> */}
          {/* {ctx.slots.left ? ctx.slots.left(renderProps) : <TransferPanel v-model={leftValues.value}></TransferPanel>}
          {ctx.slots.right ? ctx.slots.right(renderProps) : <TransferPanel v-model={rightValues.value}></TransferPanel>} */}
        </div>
      );
    };
  }
});
