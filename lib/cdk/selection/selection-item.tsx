import { defineComponent, reactive, renderSlot } from "vue";
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
  setup(props, ctx) {
    const state = reactive<SelectionItemState>({selected: false});

    const dispatcher = CdkSelectionDispatcher.instance();
    if (dispatcher) {
      dispatcher.subscribe(state);
    }
    
    return () => (
      <>
        {renderSlot(ctx.slots, 'default', state)}
      </>
    );
  }
});
