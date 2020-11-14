import { computed, inject, onUnmounted, provide, readonly, ref, unref, watch } from 'vue';
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

  readonly count = computed(() => this._count.value);
  
  private readonly _count = ref(0);

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
    this._count.value = this.states.length;

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
      this._count.value = this.states.length;
    });
  }

  notify(value: boolean) {
    if (this.multiple) {
      this.initValue = value;
      this.states.forEach(state => state.selected = value);
    }
  }
}
