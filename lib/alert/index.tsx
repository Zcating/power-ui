import { computed, defineComponent, ref, renderSlot, Transition } from "vue";

export default defineComponent({
  name: "ele-alert",
  props: {
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    type: {
      type: String as () => "info" | "success" | "warning" | "error",
      default: "info",
    },
    closable: {
      type: Boolean,
      default: true,
    },
    closeText: {
      type: String,
      default: "",
    },
    showIcon: Boolean,
    center: Boolean,
    effect: {
      type: String as () => "light" | "dark",
      default: "light",
    },
    onClose: {
      type: Function,
      default: () => {},
    },
  },
  setup(props, ctx) {
    const visible = ref(true);
    const close = () => {
      visible.value = false;
      props.onClose();
    };
    const isBigIcon = computed(() =>
      props.description || ctx.slots["default"]?.() ? "is-big" : ""
    );
    const isBoldTitle = computed(() =>
      props.description || ctx.slots["default"]?.() ? "is-bold" : ""
    );

    return () => (
      <Transition name='el-alert-fade' appear={true}>
        <div
          class={[
            "el-alert",
            "el-alert--" + props.type,
            props.center ? "is-center" : "",
            "is-" + props.effect,
          ]}
          v-show={visible.value}
          role='alert'
        >
          {props.showIcon ? (
            <i
              class={[
                "el-alert__icon",
                "el-icon-" + props.type,
                isBigIcon.value,
              ]}
            ></i>
          ) : null}

          <div class='el-alert__content'>
            {props.title || ctx.slots["title"]?.() ? (
              <span class={["el-alert__title", isBoldTitle.value]}>
                {renderSlot(ctx.slots, "title", { title: props.title })}
              </span>
            ) : null}
            {ctx.slots["default"]?.() && !props.description ? (
              <p class='el-alert__description'>
                {renderSlot(ctx.slots, "default")}
              </p>
            ) : null}
            <i
              class={{
                "el-alert__closebtn": true,
                "is-customed": props.closeText !== "",
                "el-icon-close": props.closeText === "",
              }}
              v-show={props.closable}
              onClick={close}
            >
              {props.closeText}
            </i>
          </div>
        </div>
      </Transition>
    );
  },
});
