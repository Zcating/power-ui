import { computed, InjectionKey, provide, ref, Ref, shallowRef, watch, WatchSource } from 'vue';

export interface OptionData {
  value: string | number;
  label: string | number;
  index: number;
}

export interface OptionUniqueData {
  readonly __$current: Symbol;
  value: string | number;
  label: string | number;
}

type SelectValue = OptionData | (OptionData)[] | null;

export class SelectSerivce {
  static key: InjectionKey<SelectSerivce> = Symbol();

  private readonly optionsRef: Ref<OptionUniqueData[]> = ref([]);

  private readonly selectors: Ref<boolean>[] = [];

  private readonly selectValue: Ref<SelectValue> = shallowRef(null);

  get options() {
    return computed(() => this.optionsRef.value.map(opt => opt.value));
  }

  constructor(private multiple: Ref<boolean> = ref(false)) {
    provide(SelectSerivce.key, this);
  }

  watchSelectValue(hook: (value: SelectValue) => void) {
    watch(this.selectValue, hook);
  }

  watchOptions(label: Ref<number | string>, value: Ref<number | string>, current: Symbol): Ref<boolean> {
    const selector = ref(false);

    watch(() => [label.value, value.value], ([label, value]: (string | number)[]) => {
      const options = this.optionsRef.value;
      const index = options.findIndex((option) => option.__$current === current);
      if (index === -1) {
        options.push({ __$current: current, value, label });
        this.selectors.push(selector);
      } else {
        options[index].label = label;
        options[index].value = value;
      }
    }, { immediate: true });

    watch(selector, (selected) => {
      const options = this.optionsRef.value;
      const index = options.findIndex((option) => option.__$current === current);
      // index not exsisted
      // select is multiple
      // value is false
      if (index === -1) {
        return;
      }

      const option = options[index];
      if (this.multiple.value) {
        const selectValues = this.selectValue.value;
        if (Array.isArray(selectValues)) {
          if (selected) {
            const optionValue = { value: option.value, label: option.label, index };
            this.selectValue.value = [...selectValues, optionValue];
          } else {
            this.selectValue.value = selectValues.filter((value) => value.index === index);
          }
        } else {
          this.selectValue.value = [{ value: option.value, label: option.label, index }];
        }
      } else {
        this.selectValue.value = { value: option.value, label: option.label, index };

        // to mark all selector false.
        for (let i = 0; i < this.selectors.length; i++) {
          if (i === index) {
            continue;
          }
          this.selectors[i].value = false;
        }
      }
    });

    return selector;
  }

}