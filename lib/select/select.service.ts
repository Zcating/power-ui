import { InjectionKey, Ref, inject, provide, ref, watch } from 'vue';

export interface OptionData {
  value: string | number;
  label: string;
}


type SelectData = OptionData | OptionData[] | null;

export class SelectSerivce {
  static key: InjectionKey<SelectSerivce> = Symbol();
  static instance() {
    return inject(SelectSerivce.key);
  }

  private readonly dataRef: Ref<SelectData> = ref([]);

  constructor(private multiple: Ref<boolean> = ref(false)) {
    provide(SelectSerivce.key, this);
  }

  updateValue(data: OptionData) {
    if (this.multiple.value) {
      const dataValues = this.dataRef.value;
      if (Array.isArray(dataValues)) {
        this.dataRef.value = [...dataValues, data];
      } else {
        this.dataRef.value = [data];
      }
    } else {
      this.dataRef.value = data;
    }
  }

  removeValue(value: string | number) {
    if (this.multiple.value) {
      const dataValues = this.dataRef.value;
      if (Array.isArray(dataValues)) {
        this.dataRef.value = dataValues.filter((data) => data.value !== value);
      } else {
        this.dataRef.value = [];
      }
    }
  }

  watchValue(hook: (data: SelectData, multiple: boolean) => void) {
    watch([this.dataRef, this.multiple], (values) => {
      hook(values[0] as SelectData, values[1] as boolean);
    }, {immediate: true});
  }
}
