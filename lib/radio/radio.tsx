
import { Enum, Method, renderCondition } from '../cdk/utils';
import { ElSize } from '@/types';
import { defineComponent, renderSlot } from "vue";
import { useRadio } from './use-radio';

export const Radio = defineComponent({
  name: 'el-radio',

  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: ''
    },
    label: {
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

  setup(props, ctx) {
    return useRadio(props, ctx);
  },

  render() {
    const {
      border,
      radioSize,
      isDisabled,
      label,
      tabIndex,
      focus,
      checked,
      activeStyle,
      handleLabelKeydown,
      handleChange,
    } = this;

    const updateFocus = (val: boolean) => {
      this.focus = val;
    }

    return <label
      class={[
        "el-radio",
        border && radioSize ? 'el-radio--' + radioSize : '',
        { 'is-disabled': isDisabled },
        { 'is-focus': focus },
        { 'is-bordered': border },
        { 'is-checked': checked }
      ]}
      role="radio"
      aria-checked={checked}
      aria-disabled={isDisabled}
      tabindex={tabIndex}
      onKeydown={handleLabelKeydown}
    >
      <span
        class={[
          "el-radio__input",
          {
            'is-disabled': isDisabled,
            'is-checked': checked
          }
        ]}
      >
        <span class="el-radio__inner" />
        <input
          v-model={this.elValue}
          ref="radio"
          class="el-radio__original"
          type="radio"
          aria-hidden="true"
          value={label as any}
          onFocus={() => updateFocus(true)}
          onBlur={() => updateFocus(false)}
          onChange={handleChange}
          name={name}
          disabled={isDisabled}
          tabindex={-1}
          checked={checked}
        />
      </span>
      <span 
        class="el-radio__label" 
        onKeydown={(e) => e.stopPropagation()}
      >
        {renderCondition(this.$slots.default,
          renderSlot(this.$slots, 'default'),
          label
        )}
      </span>
    </label>
  }
})