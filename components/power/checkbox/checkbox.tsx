import { defineComponent, ref, toRef } from 'vue';
import { vmodelRef } from 'vue-cdk/hook';
import { Enum, Method, renderCondition } from 'vue-cdk/utils';
import { CdkSelectionItem } from 'vue-cdk/selection';
import { ElSize } from '../types';

export const Checkbox = defineComponent({
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
    value: {
      type: String,
      default: ''
    },
    name: String,
    trueLabel: [String, Number],
    falseLabel: [String, Number],
    indeterminate: Boolean,
    onChange: Method<(value: boolean) => void>(),
  },
  setup(props, ctx) {
    const modelRef = vmodelRef(toRef(props, 'checked'), (value) => {
      ctx.emit('update:checked', value);
    });


    const handleChange = (event: any) => {
      const value = event?.target?.checked ?? false;
      modelRef.value = value;
      props.onChange?.(value);
    };

    const focus = ref(false);
    const handleBlur = () => {
      focus.value = false;
    };
    const handleFocus = () => {
      focus.value = true;
    };

    return () => (
      <CdkSelectionItem
        value={props.value}
        v-model={modelRef.value}
      >
        <label
          class={['el-checkbox',
            props.size ? 'el-checkbox--' + props.size : '',
            { 'is-disabled': props.disabled },
            { 'is-checked': modelRef.value },
            { 'is-focus': focus.value },
          ]}
          role="checkbox"
          aria-checked={modelRef.value}
          aria-disabled={props.disabled}
        >
          <span
            class={[
              'el-checkbox__input',
              {
                'is-disabled': props.disabled,
                'is-checked': modelRef.value,
                'is-indeterminate': props.indeterminate,
                'is-focus': focus.value
              }
            ]}
            tabindex={props.indeterminate ? 0 : undefined}
            role={props.indeterminate ? 'checkbox' : undefined}
            aria-checked={props.indeterminate ? 'mixed' : undefined}
          >
            <span class="el-checkbox__inner" />
            {renderCondition(
              props.trueLabel || props.falseLabel,
              <input
                class="el-checkbox__original"
                type="checkbox"
                name={props.name}
                disabled={props.disabled}
                true-value={props.trueLabel}
                false-value={props.falseLabel}
                // v-model={modelRef.value}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                checked={modelRef.value}
              />,
              <input
                class="el-checkbox__original"
                type="checkbox"
                name={props.name}
                disabled={props.disabled}
                // value={props.value}
                // v-model={modelRef.value}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                checked={modelRef.value}
              />
            )}
          </span>
          {renderCondition(
            ctx.slots.default || props.value,
            <span
              class="el-checkbox__label"
            >
              {ctx.slots.default ? ctx.slots.default() : props.value}
            </span>
          )}
        </label>
      </CdkSelectionItem>
    );
  },
});
