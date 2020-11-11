import { ENTER } from '../cdk/keycodes';
import { renderCondition } from "../cdk/utils"
import { computed, defineComponent, nextTick, ref, watch } from 'vue'

import '../theme-chalk/src/switch.scss';

export const Switch = defineComponent({
  props: {
    modelValue: {
      type: [Boolean, String, Number],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 40
    },
    activeIconClass: {
      type: String,
      default: ''
    },
    inactiveIconClass: {
      type: String,
      default: ''
    },
    activeText: String,
    inactiveText: String,
    activeColor: {
      type: String,
      default: ''
    },
    inactiveColor: {
      type: String,
      default: ''
    },
    activeValue: {
      type: [Boolean, String, Number],
      default: true
    },
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    id: String
  },


  setup(props, ctx) {
    const switchDisabled = computed(() => props.disabled);
    const checked = computed(() => props.modelValue === props.activeValue);

    const input = ref<HTMLInputElement>();
    watch([input, checked], (values) => {
      const input = values[0] as HTMLInputElement;
      const checked = values[1] as boolean;
      if (!input) {
        return;
      }
      input.checked = checked;
    });

    const core = ref<HTMLSpanElement>();
    watch([core, checked], (values) => {
      const core = values[0] as HTMLInputElement;
      const checked = values[1] as boolean;
      if (!core) {
        return;
      }
      const newColor = checked ? props.activeColor : props.inactiveColor;
      core.style.borderColor = newColor;
      core.style.backgroundColor = newColor;
    });

    const coreWidth = computed(() => props.width || 40);


    const handleChange = () => {
      const checkedValue = checked.value;
      const val = checkedValue ? props.inactiveValue : props.activeValue;
      ctx.emit('update:modelValue', val);
      ctx.emit('change', val);
      nextTick(() => {
        // set input's checked property
        // in case parent refuses to change component's value
        input.value && (input.value.checked = checkedValue);
      });
    };

    const switchValue = () => {
      !switchDisabled.value && handleChange();
    };

    return {
      input,
      core,
      coreWidth,
      switchDisabled,
      checked,
      handleChange,
      switchValue
    }
  },

  render() {
    const {
      id,
      name,
      activeValue,
      activeIconClass,
      activeText,
      inactiveValue,
      inactiveIconClass,
      inactiveText,
      switchDisabled,
      checked,
      coreWidth,
      switchValue,
      handleChange
    } = this;

    return <div
      class={[
        'el-switch',
        switchDisabled ? 'is-disabled' : '',
        checked ? 'is-checked' : ''
      ]}
      role="switch"
      aria-checked={checked}
      aria-disabled={switchDisabled}
      onClick={(e) => {
        e.preventDefault();
        switchValue();
      }}
    >
      <input
        class="el-switch__input"
        type="checkbox"
        ref="input"
        id={id}
        name={name}
        onChange={handleChange}
        true-value={activeValue}
        false-value={inactiveValue}
        disabled={switchDisabled}
        onKeydown={(e) => e.keyCode === ENTER && switchValue()}
      />
      {renderCondition(
        inactiveIconClass || inactiveText,
        <span class={['el-switch__label', 'el-switch__label--left', !checked ? 'is-active' : '']}>
          {renderCondition(inactiveIconClass, <i class={[inactiveIconClass]} />)}
          {renderCondition(
            !inactiveIconClass && inactiveText,
            <span aria-hidden={checked} v-slots={{ default: () => inactiveText }} />
          )}
        </span>
      )}
      <span class="el-switch__core" ref="core" style={{ 'width': coreWidth + 'px' }} />
      {renderCondition(
        activeIconClass || activeText,
        <span class={['el-switch__label', 'el-switch__label--right', checked ? 'is-active' : '']}>
          {renderCondition(activeIconClass, <i class={activeIconClass} />)}
          {renderCondition(
            !activeIconClass && activeText,
            <span aria-hidden={!checked} v-slots={{ default: () => activeText }} />
          )}
        </span>
      )}
    </div>
  }
});
