import { computed, inject, onUnmounted, provide, Ref, ref, shallowRef, watch } from 'vue';
import { getClassToken } from '../tools';
import { ItemData, OptionItemData, SelectionItemState, SelectionValue } from './types';



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
    return inject(this.key, undefined);
  }

  readonly states = new Map<number | string, SelectionItemState>();

  readonly count = computed(() => this._count.value);

  private readonly _count = ref(0);

  private readonly dataRef: Ref<OptionItemData> = shallowRef([]);

  get multiple() {
    return this.multipleRef.value;
  }


  constructor(
    private readonly multipleRef: Ref<boolean>,
    private readonly initValue: Ref<SelectionValue>
  ) {
    provide(CdkSelectionDispatcher.key, this);
  }

  subscribe(key: number | string, state: SelectionItemState) {
    state.selected = this.isEqualModelValue(key);
    this.states.set(key, state);
    this._count.value = this.states.keys.length;
    watch(() => state.selected, (value) => {
      if (this.multiple || !value) {
        return;
      }
      this.states.forEach((curState) => {
        if (curState !== state) {
          curState.selected = false;
        }
      });
    });

    onUnmounted(() => {
      this.states.delete(key);
      this._count.value = this.states.keys.length;
    });
  }

  notify(value: boolean) {
    if (this.multiple) {
      this.states.forEach(state => state.selected = value);
    }
  }

  select(...data: ItemData[]) {
    if (this.multiple) {
      const dataValues = this.dataRef.value;
      if (Array.isArray(dataValues)) {
        this.dataRef.value = [...dataValues, ...data];
      } else {
        this.dataRef.value = [...data];
      }
    } else {
      this.dataRef.value = data[0];
    }
  }

  deselect(value: string | number) {
    if (this.multiple) {
      const dataValues = this.dataRef.value;
      if (Array.isArray(dataValues)) {
        this.dataRef.value = dataValues.filter((data) => data.value !== value);
      } else {
        this.dataRef.value = [];
      }
    } else {
      this.dataRef.value = null;
    }
  }

  watchValue(hook: (data: OptionItemData, multiple: boolean) => void) {
    watch([this.dataRef, this.multipleRef], (values) => {
      hook(values[0] as OptionItemData, values[1] as boolean);
    }, { immediate: true });
  }

  private isEqualModelValue(key: number | string) {
    const data = this.initValue.value;
    return Array.isArray(data) ? data.indexOf(key) !== -1 : data === key;
  }

  private isFull() {
    const values = this.dataRef.value;
    return Array.isArray(values) ? values.length === this.count.value : false;
  }
}
