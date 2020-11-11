import { ref, computed, nextTick, toRef, SetupContext, reactive, CSSProperties, watch } from 'vue';
import { injectRadioService } from './radio.service';
import { vmodelRef, watchRef } from '../cdk/hook';
import { SPACE } from '../cdk/keycodes';
import { ElSize } from '../types';

interface RadioProps {
  modelValue: any;
  label: string | number | boolean;
  disabled?: boolean;
  size?: ElSize;
  onChange?: (arg: any) => void;
}


export function useRadio(props: RadioProps, ctx: SetupContext) {
  const nameRef = ref('');
  const disabledRef = watchRef(toRef(props, 'disabled'), (arg) => !!arg);
  const checkedRef = watchRef([props.modelValue, props.label], ([v1, v2]) => v1 === v2);
  const radioSizeRef = watchRef(toRef(props, 'size'), (arg) => arg || '');
  const tabIndex = computed(() => (disabledRef.value || !checkedRef.value) ? -1 : 0);
  const focusRef = ref(false);

  watch(() => props.modelValue, (value) => {
    console.log(value);
  });

  const service = injectRadioService();
  if (service) {
    service.watchName((value) => {
      nameRef.value = value;
    });
    service.watchDisabled((value) => {
      disabledRef.value = value;
    });

    service.watchSelect((value) => {
      checkedRef.value = props.label === value;
    });

    service.watchSize((value) => {
      radioSizeRef.value = value;
    });
  }

  const valueChange = (newValue: any) => {
    ctx.emit('update:modelValue', newValue);
    service?.select(newValue);
  }

  const elValue = vmodelRef(toRef(props, 'modelValue'), valueChange);

  const activeStyle = computed(() => {
    if (checkedRef.value) {
      const fill = service?.fill;
      const textColor = service?.textColor;
      return {
        backgroundColor: fill || undefined,
        borderColor: fill || undefined,
        boxShadow: fill ? `-1px 0 0 0 ${fill}` : undefined,
        color: textColor || undefined
      } as CSSProperties;
    }
  });

  const handleLabelKeydown = (e: KeyboardEvent) => {
    if (e.keyCode === SPACE) {
      e.stopPropagation();
      e.preventDefault();
      valueChange(disabledRef.value ? props.modelValue : props.label);
    }
  }

  const handleChange = () => {
    nextTick(() => {
      const value = elValue.value;
      props.onChange ? props.onChange(value) : ctx.emit('change', value);
    });
  }

  return reactive({
    checked: checkedRef,
    focus: focusRef,
    isDisabled: disabledRef,
    radioSize: radioSizeRef,
    elValue,
    tabIndex,
    activeStyle,
    handleLabelKeydown,
    handleChange,
  });
}
