import { List, Method, renderCondition } from '../utils';
import { defineComponent, toRef } from 'vue';
import { CdkSelectionDispatcher } from './selection-dispatcher';
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
    const dispatcher = new CdkSelectionDispatcher(toRef(props, 'multiple'), toRef(props, 'initValue'));
    dispatcher.watchValue((data) => {
      if (!data) {
        return;
      }
      ctx.emit('selected', data);
    });

    return () => (
      <>
        {ctx.slots.default?.()}
        {renderCondition(dispatcher.count.value === 0, ctx.slots.empty?.())}
      </>
    );
  },
  methods: {
    selectAll(value: boolean) {
      if (this.multiple) {
        const instance = CdkSelectionDispatcher.instance();
        if (instance) {
          instance.notify(value);
        }
      }
    }
  }
});

export type CdkSelectionRef = InstanceType<typeof CdkSelection>;
