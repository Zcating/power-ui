import { HTMLAttributes } from 'vue';

export * from './input';

export interface AutosizeData {
  minRows?: number;
  maxRows?: number;
}

export declare class Input {
  $props: {
    modelValue?: string | number,
    size?: string,
    resize?: string,
    form?: string,
    disabled?: boolean,
    readonly?: boolean,
    type?: 'text' | 'textarea',
    autosize?: boolean | AutosizeData,
    autocomplete?: string,
    validateEvent?: boolean | string,
    suffixIcon?: string,
    prefixIcon?: string,
    label?: string,
    clearable?: boolean,
    showPassword?: boolean,
    showWordLimit?: boolean,
    tabindex?: number,
    placeholder?: string,
    name?: string,
  } & {
    onBlur?: (e: Event) => void;
    onFocus?: (e: Event) => void;
    onChange?: (value: string | number) => void;
  } & HTMLAttributes;
}
