import { InjectionKey, provide, toRefs, watch } from 'vue';

interface SelectionState {
  multiple: boolean;
}

export class SelectSerivce {
  static key: InjectionKey<SelectSerivce> = Symbol();

  private state = toRefs<SelectionState>({
    multiple: false
  });

  constructor() {
    provide(SelectSerivce.key, this);
  }

  watchState<T extends keyof SelectionState>(key: T, fn: (value: SelectionState[T]) => void) {
    watch(this.state[key], fn);
  }
}