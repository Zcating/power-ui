import { List, Method, renderCondition } from '../utils';
import { defineComponent, getCurrentInstance, toRef } from 'vue';
import { CdkSelectionDispatcher, useDispatcher } from './selection-dispatcher';
import { OptionItemData } from './types';

/**
 * @description
 * 
 * @date 2020-09-24
 * @export
 * @component CdkSelection
 */
export const CdkSelection = defineComponent({
  name: 'cdk-selection',
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    initValue: {
      type: [String, Number, List<string | number>()],
      default: '',
    },
    onSelected: Method<(value: OptionItemData) => void>(),
  },
  emits: {
    'selected': (value: OptionItemData) => true
  },
  setup(props, ctx) {
    const dispatcher = new CdkSelectionDispatcher(
      toRef(props, 'multiple'),
      toRef(props, 'initValue')
    );
    dispatcher.watchValue((data) => {
      if (!data) {
        return;
      }
      ctx.emit('selected', data);
    });

    const selectAll = (value: boolean) => {
      if (!props.multiple) {
        return;
      }
      dispatcher.notify(value);
    };

    return {
      selectAll,
      count: dispatcher.count
    };
  },
  render() {
    const { $slots: slots, count } = this;
    return [
      slots.default?.(),
      renderCondition(count === 0, slots.empty?.())
    ];
  }
});

export type CdkSelectionRef = InstanceType<typeof CdkSelection>;
