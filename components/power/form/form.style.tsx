import { InjectionKey, inject, provide } from 'vue';

const token = Symbol() as InjectionKey<FormStyle>;

export const useFormStyle = () => inject(token, {
  labelPosition: '',
  labelWidth: '',
  inline: false,
  inlineMessage: false,
  hideRequiredAsterisk: false,
  showMessage: false,
  size: ''
})!;

export const provideFormStyle = (style: FormStyle) => {
  provide(token, style);
};

interface FormStyle {
  readonly labelPosition?: string;
  readonly labelWidth: string;
  readonly inline: boolean;
  readonly inlineMessage: boolean;
  readonly hideRequiredAsterisk: boolean;
  readonly showMessage: boolean;
  readonly size: string;
}
