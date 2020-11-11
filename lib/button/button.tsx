import { Method, toAttrComponent } from '../cdk/utils';
import { ElSize } from '../types';
import { computed, defineComponent, HTMLAttributes, inject, renderSlot } from "vue";
import { ElButtonNativeType, ElButtonType } from './types';


export const Button = toAttrComponent<HTMLAttributes>()(defineComponent({
  name: "ele-button",
  props: {
    type: {
      type: Method<ElButtonType>(),
      default: "default",
    },
    size: {
      type: Method<ElSize>(),
      default: "medium",
    },
    icon: {
      type: String,
      default: "",
    },
    nativeType: {
      type: Method<ElButtonNativeType>(),
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
        type={props.nativeType}
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
        {...ctx.attrs}
      >
        {props.loading ? <i class='el-icon-loading' v-if='loading'></i> : null}
        {props.icon && !props.loading ? <i class={props.icon}></i> : null}
        {renderSlot(ctx.slots, "default")}
      </button>
    );
  },
}));
