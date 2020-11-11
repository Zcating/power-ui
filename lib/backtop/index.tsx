import {
  defineComponent,
  inject,
  provide,
  Ref,
  ref,
  renderSlot,
  Transition,
  watch,
} from "vue";
import { platformToken, getFuncToken } from "..";
import { runWhileScroll } from "../cdk/tools";

/**
 * visible while scroll to certain area
 * controll every where
 * use a little bit function instead of class
 * so any type will be announced
 *
 * @export
 * @param {Ref<string>} [target]
 * @returns
 */
export function backtopController(target?: Ref<string>) {
  const { BODY } = inject(platformToken)!;
  // for ssr
  // not body element , no val
  if (!BODY) return null;
  const container = ref<HTMLElement>(BODY);
  if (target) {
    watch(target, (res) => {
      if (res) {
        container.value = document.querySelector(res) || BODY;
      }
    });
  }
  const visible = ref(false);
  const scrollToTop = () => {
    const beginTime = Date.now();
    const beginValue = container.value.scrollTop;
    const rAF =
      window.requestAnimationFrame || ((func) => setTimeout(func, 16));
    const cubic = (value: number) => Math.pow(value, 3);
    const easeInOutCubic = (value: number) =>
      value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2;

    const frameFunc = () => {
      const progress = (Date.now() - beginTime) / 500;
      if (progress < 1) {
        container.value.scrollTop = beginValue * (1 - easeInOutCubic(progress));
        rAF(frameFunc);
      } else {
        container.value.scrollTop = 0;
      }
    };
    rAF(frameFunc);
  };
  provide("ele-backtop", { container, visible, scrollToTop });
  return { container, visible, scrollToTop };
}

export default defineComponent({
  name: "ele-backtop",
  props: {
    visibilityHeight: {
      type: Number,
      default: 200,
    },
    target: [String],
    right: {
      type: Number,
      default: 40,
    },
    bottom: {
      type: Number,
      default: 40,
    },
    onClick: {
      type: Function,
      default: () => {},
    },
  },
  setup(props, ctx) {
    const backtop = inject(
      getFuncToken(backtopController, "ele-backtop"),
      backtopController()
    );
    // for ssr
    // no backtop logic
    // no content
    if (!backtop) return null;
    const { container, visible, scrollToTop } = backtop;
    runWhileScroll(() => {
      const scrollTop = container.value.scrollTop;
      visible.value = scrollTop >= props.visibilityHeight;
    });
    const hasDefaultSlot = ctx.slots["default"] ? true : false;
    return () => (
      <Transition name='el-fade-in' appear mode='out-in'>
        {visible.value ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
              scrollToTop();
              props.onClick();
            }}
            style={{ right: props.right + "px", bottom: props.bottom + "px" }}
            class='el-backtop'
          >
            {hasDefaultSlot ? (
              renderSlot(ctx.slots, "default")
            ) : (
              <i class='el-icon-caret-top'></i>
            )}
          </div>
        ) : null}
      </Transition>
    );
  },
});
