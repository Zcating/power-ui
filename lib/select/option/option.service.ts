import { InjectionKey, provide, reactive, toRef, watch } from 'vue';

export class OptionService {
  static key = Symbol('el-option-service') as InjectionKey<OptionService>;

  state = reactive({
    disabled: false,
    inputValue: '',
  });

  constructor() {
    provide(OptionService.key, this);
  }

  setInputValue(value: string) {
    this.state.inputValue = value;
  }

  setDisabled(value: boolean) {
    this.state.disabled = value;
  }

  watchDisabled(fn: (value: boolean) => void) {
    watch(toRef(this.state, 'disabled'), fn);
  }

  watchInputValue(fn: (value: string) => void) {
    watch(toRef(this.state, 'inputValue'), fn);
  }
}
