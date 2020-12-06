
import { computed, defineComponent, ref, toRef, watch } from 'vue';
import { useRadioGroupData } from './radio-group';
import { watchRef } from 'vue-cdk/hook';
import { Enum, Method } from 'vue-cdk/utils';
import { CdkSelectionItem } from 'vue-cdk/selection';
import { ElSize } from '../types';

export const Radio = defineComponent({
  name: 'el-radio',

  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Boolean],
      default: ''
    },
    disabled: Boolean,
    border: Boolean,
    size: {
      type: Enum<ElSize>(),
      default: ''
    },
    onChange: Method<(value: string | number | boolean) => void>(),
  },
  emits: {
    'update:modelValue': (value: boolean) => true,
  },
  setup(props, ctx) {
    const checkedRef = watchRef(toRef(props, 'modelValue'), (value) => {
      ctx.emit('update:modelValue', value);
    });
    const disabledRef = watchRef(toRef(props, 'disabled'));
    const sizeRef = watchRef(toRef(props, 'size'));
    const groupData = useRadioGroupData();
    if (groupData) {
      watch(groupData.disabled, (value) => {
        disabledRef.value = value ?? false;
      });
      watch(groupData.size, (value) => {
        sizeRef.value = value ?? '';
      });
    }

    const tabIndex = computed(() => {
      return (disabledRef.value || (!!groupData && checkedRef.value)) ? -1 : 0;
    });

    const focusRef = ref(false);
    const updateFocus = (value: boolean) => {
      focusRef.value = value;
    };


    return () => {
      const { border, value } = props;
      const disabled = disabledRef.value;
      const size = sizeRef.value;
      const focus = focusRef.value;
      return (
        <CdkSelectionItem
          trackedKey={String(value)}
          v-model={checkedRef.value}
        >
          <label
            class={[
              'el-radio',
              border && size ? 'el-radio--' + size : '',
              { 'is-disabled': disabled },
              { 'is-focus': focus },
              { 'is-bordered': props.border },
              { 'is-checked': checkedRef.value }
            ]}
            role="radio"
            aria-checked={checkedRef.value}
            aria-disabled={disabled}
            tabindex={tabIndex.value}
          // onKeydown={handleLabelKeydown}
          >
            <span
              class={[
                'el-radio__input',
                {
                  'is-disabled': disabled,
                  'is-checked': checkedRef.value
                }
              ]}
            >
              <span class="el-radio__inner" />
              <input
                ref="radio"
                class="el-radio__original"
                type="radio"
                aria-hidden="true"
                onFocus={() => updateFocus(true)}
                onBlur={() => updateFocus(false)}
                onChange={(e: any) => {
                  checkedRef.value = e.target?.checked ?? false;
                }}
                name={name}
                disabled={disabled}
                tabindex={-1}
                checked={checkedRef.value}
              />
            </span>
            <span
              class="el-radio__label"
              onKeydown={(e) => e.stopPropagation()}
            >
              {ctx.slots.default ? ctx.slots.default() : value}
            </span>
          </label>
        </CdkSelectionItem>
      );
    };
  }
});