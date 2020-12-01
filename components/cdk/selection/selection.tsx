import { defineComponent, Prop, toRef } from 'vue';
import { watchRef } from 'vue-cdk/hook';
import { List, Method, renderCondition } from '../utils';
import { CdkSelectionDispatcher } from './selection-dispatcher';
import { SelectionValue } from './types';

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
    modelValue: {
      type: [String, Number, List<string | number>()],
      default: '',
    },
    onSelected: Method<(value: SelectionValue) => void>(),
  },
  emits: {
    'selected': (value: SelectionValue) => true,
    'update:modelValue': (value: SelectionValue) => true,
  },
  setup(props, ctx) {
    const modelRef = watchRef(toRef(props, 'modelValue'));

    const dispatcher = new CdkSelectionDispatcher(
      toRef(props, 'multiple'),
      modelRef
    );

    dispatcher.watchData((data) => {
      if (!data) {
        return;
      }
      ctx.emit('update:modelValue', data);
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
      renderCondition(count === 0, () => slots.empty ? slots.empty() : '')
    ];
  }
});

export type CdkSelectionRef = InstanceType<typeof CdkSelection>;
