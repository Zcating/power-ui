import { inject, onUnmounted, provide, watch } from 'vue';
import { getClassToken } from '../tools';
import { SelectionItemState } from './types';



/**
 * @description
 * 
 * @date 2020-09-24
 * @export
 * @class SelectionDispatcher
 */
export class CdkSelectionDispatcher {

  static key = getClassToken(CdkSelectionDispatcher);

  static instance() {
    return inject(this.key);
  }

  readonly states: SelectionItemState[] = [];

  multiple = false;

  initValue = false;

  constructor() {
    provide(CdkSelectionDispatcher.key, this);
  }

  subscribe(state: SelectionItemState) {
    if (this.multiple) {
      state.selected = this.initValue;
    }
    this.states.push(state);
    watch(() => state.selected, (value) => {
      if (this.multiple || !value) {
        return
      }
      this.states.forEach((curState) => {
        if (curState !== state) {
          curState.selected = false;
        }
      });
    });

    onUnmounted(() => {
      const index = this.states.findIndex(fn => fn === state);
      if (index === -1) {
        return;
      }
      this.states.splice(index, 1);
    });
  }

  notify(value: boolean) {
    if (this.multiple) {
      this.initValue = value;
      this.states.forEach(state => state.selected = value);
    }
  }
}
