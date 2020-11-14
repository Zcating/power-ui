import { InjectionKey, provide, ref, Ref } from 'vue';

export interface OptionData {
  value: string | number;
  label: string | number;
}

export interface OptionUniqueData {
  readonly __$current: Symbol;
  value: string | number;
  label: string | number;
}

type SelectValue = OptionData | (OptionData)[] | null;

export class SelectSerivce {
  static key: InjectionKey<SelectSerivce> = Symbol();

  private readonly optionsRef: Ref<SelectValue> = ref([]);

  constructor(private multiple: Ref<boolean> = ref(false)) {
    provide(SelectSerivce.key, this);
  }
}
