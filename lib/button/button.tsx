import { Enum } from '../cdk/utils';
import { computed, defineComponent, inject, renderSlot } from "vue";
import { ElButtonNativeType } from './types';

export const Button = defineComponent({
  name: "ele-button",
  props: {
    type: {
      type: String,
      default: "default",
    },
    size: {
      type: String,
      default: "medium",
    },
    icon: {
      type: String,
      default: "",
    },
    nativeType: {
      type: Enum<ElButtonNativeType>(),
      default: "button",
    },

    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    autofocus: Boolean,
    round: Boolean,
    circle: Boolean,
  },

  emits: ["click"],

  setup(props, ctx) {
    const formItem = inject("ele-form-item", { disabled: false, size: "" });
    const buttonDisabled = computed(() => formItem.disabled || props.disabled);
    const buttonSize = computed(
      () => formItem.size || props.size || inject("ele-global-size")
    );

    return () => (
      <button
        disabled={buttonDisabled.value || props.loading}
        autofocus={props.autofocus}
        type={props.nativeType as ElButtonNativeType}
        class={[
          "el-button",
          props.type ? "el-button--" + props.type : "",
          buttonSize.value ? "el-button--" + buttonSize.value : "",
          {
            "is-disabled": buttonDisabled.value,
            "is-loading": props.loading,
            "is-plain": props.plain,
            "is-round": props.round,
            "is-circle": props.circle,
          },
        ]}
        onClick={(e) => ctx.emit('click', e)}
        {...ctx.attrs}
      >
        {props.loading ? <i class='el-icon-loading' v-if='loading'></i> : null}
        {props.icon && !props.loading ? <i class={props.icon}></i> : null}
        {renderSlot(ctx.slots, "default")}
      </button>
    );
  },
});
