import { computed, defineComponent, inject } from 'vue';
import { Enum, Method } from 'vue-cdk/utils';
import { ElButtonNativeType, ElButtonType } from './types';

export const Button = defineComponent({
  name: 'po-button',
  props: {
    type: {
      type: Enum<ElButtonType>(),
      default: 'default',
    },
    size: {
      type: String,
      default: 'medium',
    },
    icon: {
      type: String,
      default: '',
    },
    nativeType: {
      type: Enum<ElButtonNativeType>(),
      default: 'button',
    },

    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    autofocus: Boolean,
    round: Boolean,
    circle: Boolean,
    onClick: Method<(e: Event) => void>(),
  },

  emits: ['click'],

  setup(props, ctx) {
    const buttonDisabled = computed(() => props.disabled);
    const buttonSize = computed(() => props.size);

    return () => (
      <button
        disabled={buttonDisabled.value || props.loading}
        autofocus={props.autofocus}
        type={props.nativeType as ElButtonNativeType}
        class={[
          'el-button',
          props.type ? 'el-button--' + props.type : '',
          buttonSize.value ? 'el-button--' + buttonSize.value : '',
          {
            'is-disabled': buttonDisabled.value,
            'is-loading': props.loading,
            'is-plain': props.plain,
            'is-round': props.round,
            'is-circle': props.circle,
          },
        ]}
        onClick={(e) => ctx.emit('click', e)}
        {...ctx.attrs}
      >
        {props.loading ? <i class='el-icon-loading' /> : null}
        {props.icon && !props.loading ? <i class={props.icon} /> : null}
        {ctx.slots.default?.()}
      </button>
    );
  },
});
