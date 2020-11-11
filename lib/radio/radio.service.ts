import { ElSize } from '../types';
import { inject, InjectionKey, provide, ref, watch } from "vue";

const radioServiceKey = Symbol() as InjectionKey<RadioService>;

export const injectRadioService = () => inject(radioServiceKey);

export class RadioService {

  private selectedValueRef = ref<any>(null);
  private touchedRef = ref(false);
  private disabledRef = ref(false);
  private nameRef = ref('');
  private radioSize = ref<ElSize>('');
  private changeEventRef = ref();
  private fillRef = ref(false);
  private textColorRef = ref('');

  get fill() { return this.fillRef.value; }
  get textColor() { return this.textColorRef.value; }

  constructor() {
    provide(radioServiceKey, this);
  }

  setupState(props: { fill?: boolean, textColor?: string }) {
    watch(() => props.fill, (value) => this.fillRef.value = value || false, {immediate: true});
    watch(() => props.textColor, (value) => this.textColorRef.value = value || '', {immediate: true});
  }

  setTouch(value: boolean) {
    this.touchedRef.value = value;
  }

  select(value: any) {
    this.selectedValueRef.value = value;
  }

  setDisabled(value: boolean) {
    this.disabledRef.value = value;
  }

  setName(value: string) {
    this.nameRef.value = value;
  }

  setSize(value: ElSize) {
    this.radioSize.value = value;
  }

  setChangeEvent(value: any) {
    this.changeEventRef.value = value;
  }

  watchTouch(fn: (value: boolean) => void) {
    watch(this.touchedRef, fn);
  }

  watchSelect(fn: (value: any) => void) {
    watch(this.selectedValueRef, fn, { immediate: true });
  }

  watchDisabled(fn: (value: boolean) => void) {
    watch(this.disabledRef, fn, { immediate: true });
  }

  watchName(fn: (value: string) => void) {
    watch(this.nameRef, fn, { immediate: true });
  }

  watchSize(fn: (value: ElSize) => void) {
    watch(this.radioSize, fn, { immediate: true });
  }

  watchEventChange(fn: (value: any) => void) {
    watch(this.changeEventRef, fn);
  }

}