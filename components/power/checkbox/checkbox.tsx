import { defineComponent, ref, toRef } from 'vue';
import { watchRef } from 'vue-cdk/hook';
import { Enum, Method, renderCondition } from 'vue-cdk/utils';
import { CdkSelectionItem } from 'vue-cdk/selection';
import { ElSize } from '../types';

export const Checkbox = defineComponent({
  name: 'po-checkbox',
  inheritAttrs: false,
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
    const modelRef = watchRef(toRef(props, 'checked'), (value) => {
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
        trackedKey={props.value}
        v-model={modelRef.value}
      >
        <label
          key={props.value}
          class={['el-checkbox',
            props.size ? 'el-checkbox--' + props.size : '',
            { 'is-disabled': props.disabled },
            { 'is-checked': modelRef.value },
            { 'is-focus': focus.value },
          ]}
          role="checkbox"
          aria-checked={modelRef.value}
          aria-disabled={props.disabled}
          {...ctx.attrs}
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
            <input
              class="el-checkbox__original"
              type="checkbox"
              name={props.name}
              disabled={props.disabled}
              checked={modelRef.value}
              onChange={handleChange}
              onClick={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </span>
          {renderCondition(
            ctx.slots.default || props.value,
            () => (
              <span class="el-checkbox__label">
                {ctx.slots.default ? ctx.slots.default() : props.value}
              </span>
            )
          )}
        </label>
      </CdkSelectionItem>
    );
  },
});
