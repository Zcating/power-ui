import { computed, defineComponent, ref, toRef, watch } from 'vue';
import { vmodelRef, watchRef } from 'vue-cdk/hook';
import { Enum, Method } from 'vue-cdk/utils';
import { CdkSelectionItem } from 'vue-cdk/selection';
import { useRadioGroupData } from './radio-group';
import { ElSize } from '../types';

export const RadioButton = defineComponent({
  name: 'el-radio-button',
  props: {
    modelValue: {
      type: Boolean,
      default: ''
    },
    value: {
      type: [String, Number, Boolean],
      default: ''
    },
    size: {
      type: Enum<ElSize>(),
      default: ''
    },

    disabled: Boolean,
    onChange: Method<(value: string | number | boolean) => void>(),
  },

  setup(props, ctx) {
    const checkedRef = vmodelRef(toRef(props, 'modelValue'), (value) => {
      ctx.emit('update:modelValue', value);
    });
    const disabledRef = watchRef(toRef(props, 'disabled'));
    const sizeRef = watchRef(toRef(props, 'size'));
    const fillRef = ref('#ffffff');
    const textColorRef = ref('#409EFF');
    const groupData = useRadioGroupData();
    if (groupData) {
      watch(groupData.disabled, (value) => {
        disabledRef.value = value ?? false;
      });
      watch(groupData.size, (value) => {
        sizeRef.value = value ?? '';
      });
      watch(groupData.fill, (value) => fillRef.value = value ?? fillRef.value);
      watch(groupData.textColor, (value) => textColorRef.value = value ?? textColorRef.value);
    }

    const tabIndex = computed(() => {
      return (disabledRef.value || (!!groupData && checkedRef.value)) ? -1 : 0;
    });

    const focusRef = ref(false);
    const updateFocus = (value: boolean) => {
      focusRef.value = value;
    };

    const activeStyle = computed(() => {
      if (checkedRef.value) {
        const fill = fillRef.value;
        const textColor = textColorRef.value;
        return {
          backgroundColor: fill || undefined,
          borderColor: fill || undefined,
          boxShadow: fill ? `-1px 0 0 0 ${fill}` : undefined,
          color: textColor || undefined
        };
      }
    });

    return () => {
      const { value, } = props;
      const size = sizeRef.value;
      const disabled = disabledRef.value;
      const checked = checkedRef.value;
      const focus = focusRef.value;
      return (
        <CdkSelectionItem
          value={String(value)}
          label={String(value)}
          v-model={checkedRef.value}
        >
          <label
            class={[
              'el-radio-button',
              size ? 'el-radio-button--' + size : '',
              { 'is-disabled': disabled },
              { 'is-focus': focus },
              { 'is-checked': checked }
            ]}
            role="radio"
            aria-checked={checked}
            aria-disabled={disabled}
            tabindex={tabIndex.value}
          // onKeydown={handleLabelKeydown}
          >
            <input
              ref="radio"
              class="el-radio-button__orig-radio"
              type="radio"
              aria-hidden="true"
              onFocus={() => updateFocus(true)}
              onBlur={() => updateFocus(false)}
              onChange={(e: any) => checkedRef.value = e.target?.checked ?? false}
              name={name}
              disabled={disabled}
              tabindex={-1}
              checked={checked}
            />
            <span
              class="el-radio-button__inner"
              onKeydown={(e) => e.stopPropagation()}
              style={activeStyle.value}
            >
              {ctx.slots.default ? ctx.slots.default() : value}
            </span>
          </label>
        </CdkSelectionItem>
      );
    };
  }
});