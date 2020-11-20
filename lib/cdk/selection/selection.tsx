import { List, Method, renderCondition } from '../utils';
import { defineComponent, renderSlot, toRef, watch } from 'vue';
import { CdkSelectionDispatcher } from './selection-dispatcher';
import { ItemData, OptionItemData, SelectionValue } from './types';

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
    selected: {
      type: Boolean,
      default: false
    },
    onSelected: {
      type: Method<(value: OptionItemData) => void>(),
    },
    initValue: {
      type: [String, Number, List<string | number>()],
      default: '',
    },
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

    watch(() => props.selected, (value) => {
      if (props.multiple) {
        dispatcher.notify(value);
      }
    }, { immediate: true });


    return () => (
      <>
        {renderSlot(ctx.slots, 'default')}
        {renderCondition(dispatcher.count.value === 0,
          renderSlot(ctx.slots, 'empty')
        )}
      </>
    );
  }
});