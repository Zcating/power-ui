import { SPACE } from '../cdk/keycodes';
import { Enum, Method, renderCondition } from '../cdk/utils';
import { ElSize } from '../types';
import { computed, CSSProperties, customRef, defineComponent, nextTick, ref, renderSlot, watch } from "vue";
import { injectRadioService } from './radio.service';
import { useRadio } from './use-radio';

export const RadioButton = defineComponent({
  name: 'el-radio-button',
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: ''
    },
    label: {
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
    return useRadio(props, ctx);
  },

  render() {
    const {
      radioSize,
      isDisabled,
      label,
      tabIndex,
      focus,
      checked,
      activeStyle,
      handleLabelKeydown
    } = this;

    const updateFocus = (val: boolean) => {
      this.focus = val;
    }

    const handleChange = (e: Event) => { }

    return <label
      class={[
        "el-radio-button",
        radioSize ? 'el-radio-button--' + radioSize : '',
        { 'is-disabled': isDisabled },
        { 'is-focus': focus },
        { 'is-checked': checked }
      ]}
      role="radio"
      aria-checked={checked}
      aria-disabled={isDisabled}
      tabindex={tabIndex}
      onKeydown={handleLabelKeydown}
    >
      <input
        v-model={this.elValue}
        ref="radio"
        class="el-radio-button__orig-radio"
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
      <span 
        class="el-radio-button__inner" 
        onKeydown={(e) => e.stopPropagation()}
        style={activeStyle}
      >
        {renderCondition(this.$slots.default,
          renderSlot(this.$slots, 'default'),
          label
        )}
      </span>
    </label>
  }
})