import {
  Ref,
  Transition,
  defineComponent,
  inject,
  provide,
  ref,
  watch,
  InjectionKey,
  shallowRef,
} from 'vue';
import { usePlatform } from 'vue-cdk';
import { useAnimationFrame, useScroll } from 'vue-cdk/hook/tools';
import { Method } from 'vue-cdk/utils';


const token = Symbol() as InjectionKey<ReturnType<typeof backtopController>>;
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
  const { BODY, TOP } = usePlatform();
  if (!BODY || !TOP) {
    return null;
  }

  const container = shallowRef<HTMLElement>(BODY);
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
    const cubic = (value: number) => Math.pow(value, 3);
    const easeInOutCubic = (value: number) => value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2;

    useAnimationFrame(() => {
      const progress = (Date.now() - beginTime) / 500;
      if (progress < 1) {
        container.value.scrollTop = beginValue * (1 - easeInOutCubic(progress));
        return true;
      } else {
        container.value.scrollTop = 0;
        return false;
      }
    });
  };
  provide(token, { container, visible, scrollToTop });

  return { container, visible, scrollToTop };
}

export default defineComponent({
  name: 'po-backtop',
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
      type: Method<(event: MouseEvent) => void>(),
      default: () => { },
    },
  },
  setup(props, ctx) {
    const backtop = inject(token, backtopController());
    if (!backtop) {
      return null;
    }

    const { container, visible, scrollToTop } = backtop;
    const { DOCUMENT } = usePlatform();
    if (DOCUMENT) {
      useScroll(DOCUMENT, () => {
        const scrollTop = container.value.scrollTop;
        visible.value = scrollTop >= props.visibilityHeight;
      });
    }
    return () => (
      <Transition name='el-fade-in' appear mode='out-in'>
        {visible.value ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
              scrollToTop();
              ctx.emit('click', e);
            }}
            style={{
              right: props.right + 'px',
              bottom: props.bottom + 'px'
            }}
            class='el-backtop'
          >
            {ctx.slots.default ? ctx.slots.default() : <i class='el-icon-caret-top' />}
          </div>
        ) : null}
      </Transition>
    );
  },
});
