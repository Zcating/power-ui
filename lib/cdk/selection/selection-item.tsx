import { defineComponent, reactive, renderSlot, watch } from 'vue';
import { Method } from '../utils';
import { CdkSelectionDispatcher } from './selection-dispatcher';
import { SelectionItemState } from './types';

/**
 * @description
 * 
 * @date 2020-09-24
 * @export
 * @component CdkSelectionItem
 */
export const CdkSelectionItem = defineComponent({
  name: 'cdk-selection-item',
  props: {
    onSelectedChange: Method<(value: boolean) => void>(),
  },
  setup(props, ctx) {
    const state = reactive<SelectionItemState>({selected: false});

    const dispatcher = CdkSelectionDispatcher.instance();
    if (dispatcher) {
      dispatcher.subscribe(state);
    }

    watch(() => state.selected, (value) => {
      props.onSelectedChange?.(value);
    });
    
    return () => (
      <>
        {renderSlot(ctx.slots, 'default', state)}
      </>
    );
  }
});
