import { computed, defineComponent, renderSlot, Transition } from "vue";

export default defineComponent({
  name: "ele-badge",
  props: {
    value: [String, Number],
    max: Number,
    isDot: Boolean,
    hidden: Boolean,
    type: {
      type: String as () =>
        | "primary"
        | "success"
        | "warning"
        | "info"
        | "danger",
    },
  },
  setup(props, ctx) {
    const content = computed(() => {
      if (props.isDot) return;
      const value = props.value;
      const max = props.max;
      if (typeof value === "number" && typeof max === "number") {
        return max < value ? `${max}+` : value;
      }
      return value;
    });
    return () => (
      <div class='el-badge'>
        {renderSlot(ctx.slots, "default")}
        <Transition name='el-zoom-in-center'>
          <sup
            v-show={
              !props.hidden &&
              (content.value || content.value === 0 || props.isDot)
            }
            class={[
              "el-badge__content",
              "el-badge__content--" + props.type,
              {
                "is-fixed": ctx.slots["default"],
                "is-dot": props.isDot,
              },
            ]}
          >
            {content.value}
          </sup>
        </Transition>
      </div>
    );
  },
});
