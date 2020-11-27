import { computed, inject, InjectionKey, onUnmounted, provide, Ref, ref, shallowRef, watch } from 'vue';
import { SelectionItemState, SelectionValue } from './types';

const token = Symbol() as InjectionKey<CdkSelectionDispatcher>;

export const useDispatcher = () => inject(token, undefined);

/**
 * @description
 * 
 * @date 2020-09-24
 * @export
 * @class SelectionDispatcher
 */
export class CdkSelectionDispatcher {

  readonly states = new Map<number | string, SelectionItemState | undefined>();

  readonly count = computed(() => this._count.value);

  private readonly _count = ref(0);

  get multiple() {
    return this.multipleRef.value;
  }


  constructor(
    private readonly multipleRef: Ref<boolean>,
    private readonly dataRef: Ref<SelectionValue>
  ) {
    provide(token, this);
    watch(dataRef, (value) => {

    });
  }

  subscribe(key: number | string, state: SelectionItemState) {
    state.selected = this.testEquals(this.dataRef.value, key);
    this.states.set(key, state);
    this._count.value = this.states.size;
    const stop = watch(() => state.selected, (selected, oldValue) => {
      if (selected === oldValue) {
        return;
      }

      if (selected) {
        this.select(this.multiple, key);
      } else {
        this.deselect(this.multiple, key);
      }

      if (this.multiple || !selected) {
        return;
      }

      this.states.forEach((curState) => {
        if (curState && curState !== state) {
          curState.selected = false;
        }
      });
    });

    onUnmounted(() => {
      stop();
      this.states.set(key, undefined);
      console.log(key, this.states);
      this._count.value = this.states.size;
    });
  }

  notify(value: boolean) {
    if (this.multiple) {
      this.states.forEach(state => state && (state.selected = value));
    }
  }

  select(multiple: boolean, value: string | number) {
    if (multiple) {
      const dataValues = this.dataRef.value;
      if (dataValues && Array.isArray(dataValues)) {
        this.dataRef.value = Array.from(new Set([...dataValues, value]));
      } else {
        this.dataRef.value = [value];
      }
    } else {
      this.dataRef.value = value;
    }
  }

  deselect(multiple: boolean, value: string | number) {
    if (multiple) {
      const dataValues = this.dataRef.value;
      if (Array.isArray(dataValues)) {
        this.dataRef.value = dataValues.filter((_) => _ !== value);
      } else {
        this.dataRef.value = [];
      }
    } else {
      this.dataRef.value = '';
    }
  }

  watchData(hook: (data: SelectionValue, multiple: boolean) => void) {
    watch([this.dataRef, this.multipleRef], (values) => {
      hook(values[0] as SelectionValue, values[1] as boolean);
    }, { immediate: true });
  }

  private testEquals(data: SelectionValue, key: number | string): boolean {
    return Array.isArray(data) ? data.indexOf(key) !== -1 : data === key;
  }
}
