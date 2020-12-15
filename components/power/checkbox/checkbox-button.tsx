import { computed, defineComponent, ref, toRef } from 'vue';

import { watchRef } from 'vue-cdk/hook';
import { Enum, Method, renderCondition } from 'vue-cdk/utils';
import { CdkSelectionItem } from 'vue-cdk';
import { ElSize } from '../types';

export const CheckboxButton = defineComponent({
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    size: {
      type: Enum<ElSize>(),
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    name: String,
    value: {
      type: String,
      default: ''
    },
    trueLabel: [String, Number],
    falseLabel: [String, Number],
    onChange: Method<(value: boolean) => void>(),

  },

  emits: [
    'update:checked',
    'change'
  ],

  setup(props, ctx) {
    const modelRef = watchRef(
      toRef(props, 'checked'),
      (value) => ctx.emit('update:checked', value)
    );

    const activeStyle = computed(() => {
      return {};
    });

    const focus = ref(false);
    const handleChange = (event: any) => {
      const checked = event.target?.checked ?? false;
      modelRef.value = checked;
      ctx.emit('change', checked);
    };

    const handleBlur = () => {
      focus.value = false;
    };

    const handleFocus = () => {
      focus.value = true;
    };

    return () => (
      <CdkSelectionItem
        trackedKey={props.value}
        v-model={modelRef.value}
      >
        <label
          class={['el-checkbox-button',
            props.size ? 'el-checkbox-button--' + props.size : '',
            { 'is-disabled': props.disabled },
            { 'is-checked': modelRef.value },
            { 'is-focus': focus },
          ]}
          role="checkbox"
          aria-checked={modelRef.value}
          aria-disabled={props.disabled}
        >
          {renderCondition(
            props.trueLabel || props.falseLabel,
            <input
              class="el-checkbox-button__original"
              type="checkbox"
              name={props.name}
              disabled={props.disabled}
              true-value={props.trueLabel}
              false-value={props.falseLabel}
              v-model={modelRef.value}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />,
            <input
              class="el-checkbox-button__original"
              type="checkbox"
              name={props.name}
              disabled={props.disabled}
              value={props.value}
              v-model={modelRef.value}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          )}
          {renderCondition(
            ctx.slots.default || props.value,
            <span
              class="el-checkbox-button__inner"
              style={modelRef.value ? activeStyle.value : undefined}
            >
              {ctx.slots.default ? ctx.slots.default() : props.value}
            </span>
          )}
        </label>
      </CdkSelectionItem>
    );
  }
});
