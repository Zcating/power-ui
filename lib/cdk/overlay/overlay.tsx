import {
  defineComponent,
  Teleport,
  renderSlot,
  onMounted,
  watch,
  CSSProperties,
  onUnmounted,
  watchEffect,
  Transition,
  computed,
  inject,
  provide,
  nextTick,
  ref
} from "vue";
import { PositionStrategy, GlobalPositionStrategy } from './position';
import './overlay.scss';
import { watchRef } from '../hook';
import { platformToken } from '../global';

/**
 * @description
 * overlay config.
 * 
 * @date 2020-09-14
 * @export
 * @interface OverlayConfig
 */
export interface OverlayConfig {
  readonly strategy: PositionStrategy;
  readonly hasBackdrop?: boolean;
  readonly backdropClose?: boolean;
  readonly backdropClick?: (() => void) | null;
  readonly backgroundBlock?: boolean;
  readonly backgroundClass?: string | string[];
  readonly backgroundColor?: string;
}


export const provideStrategy = (strategy: PositionStrategy) => {
  provide('cdk-overlay-strategy', strategy);
}

/**
 * @description
 * The content renderer.
 * 
 * @class Overlay
 */
export const Overlay = defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    backgroundClass: {
      type: String,
      default: 'cdk-overlay-container__background'
    },
    hasBackdrop: {
      type: Boolean,
      default: true,
    },
    backdropClose: {
      type: Boolean,
      default: true,
    },
    backgroundBlock: Boolean,
    backdropClick: Function,
    panelClass: String,
  },
  setup(props, ctx) {
    const strategy = inject('cdk-overlay-strategy', new GlobalPositionStrategy());
    const overlayProps = strategy.setup();
    const positionedStyle = watchRef(overlayProps.positionedStyle);
    const containerStyle = ref(overlayProps.containerStyle);
    const container = ref<HTMLElement>();

    const clickBackground = (event: Event) => {
      event.preventDefault();

      props.backdropClick?.();
      if (props.backdropClose) {
        ctx.emit('update:visible', false);
      }
    }

    const body = inject(platformToken)?.BODY;
    if (body) {
      const originOverflow = body.style.overflow;
      watchEffect((onInvalidate) => {
        if (props.backgroundBlock) {
          body.style.overflow = props.visible ? 'hidden' : originOverflow;
        }
        onInvalidate(() => {
          body.style.overflow = originOverflow;
        });
      });
    }

    onMounted(() => {
      if (!container.value) {
        throw Error('overlay container is null.');
      }
      nextTick(() => {
        strategy.apply?.(container.value!);
      });

      watch(() => props.visible, (value) => {
        if (value) {
          nextTick(() => {
            strategy.apply?.(container.value!);
          });
        } else {
          strategy.disapply?.();
        }
      }, {immediate: true});
    });

    onUnmounted(() => {
      strategy.dispose();
    });

    const containerClass = computed(() => {
      const clazz = ['cdk-overlay-container'];
      if (!props.hasBackdrop) {
        clazz.push('cdk-overlay-container__diabled');
      } else {
        clazz.push(props.backgroundClass);
      }
      return clazz;
    });

    return () => (
      <Teleport to="#cdk-overlay-anchor">
        <Transition name="cdk-overlay-fade">
          <div v-show={props.visible}>
            <div
              class={containerClass.value}
              style={containerStyle.value}
              onClick={clickBackground}
            >
              <div
                ref={container}
                class="cdk-overlay"
                style={positionedStyle.value}
                onClick={event => event.cancelBubble = true}
              >
                {renderSlot(ctx.slots, 'default')}
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    )
  }
});
