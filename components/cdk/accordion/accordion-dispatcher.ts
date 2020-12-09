import { inject, InjectionKey, onUnmounted, provide, watch } from 'vue';
import { AccordionItemState as AccordionItemState } from './types';



/**
 * @description
 * 
 * @date 2020-09-24
 * @export
 * @class SelectionDispatcher
 */
export class CdkAccordionDispatcher {

  static key = Symbol() as InjectionKey<CdkAccordionDispatcher>;

  static instance() {
    return inject(this.key);
  }

  readonly states: AccordionItemState[] = [];

  multiple = false;

  initValue = false;

  constructor() {
    provide(CdkAccordionDispatcher.key, this);
  }

  subscribe(state: AccordionItemState) {
    if (this.states.indexOf(state) !== -1) {
      return;
    }
    if (this.multiple) {
      state.expanded = this.initValue;
    }
    this.states.push(state);

    watch(() => state.expanded, (value) => {
      if (this.multiple || !value) {
        return;
      }
      this.states.forEach((curState) => {
        if (curState !== state) {
          curState.expanded = false;
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
      this.states.forEach(state => state.expanded = value);
    }
  }
}
