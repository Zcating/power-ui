import {
  Teleport,
  Transition,
  defineComponent,
  getCurrentInstance,
  inject,
  nextTick,
  onMounted,
  onUnmounted,
  onUpdated,
  provide,
  ref,
  renderSlot,
  toRef,
  watch,
} from 'vue';
import { GlobalPositionStrategy, PositionStrategy } from './position';
import { vmodelRef, watchRef } from '../hook';
import { platformToken } from '../global';
import './overlay.scss';

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
};

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


    const visible = vmodelRef(toRef(props, 'visible'), (value) => {
      ctx.emit('update:visible', value);
    });

    const clickBackground = (event: Event) => {
      event.preventDefault();

      props.backdropClick?.();
      if (props.backdropClose) {
        visible.value = false;
      }
    };

    const overlayRef = ref<HTMLElement>();
    onMounted(() => {
      const overlay = overlayRef.value;
      if (!overlay) {
        return;
      }
      watch(visible, (value) => {
        if (value) {
          nextTick(() => {
            strategy.apply?.(overlay);
          });
        } else {
          strategy.disapply?.();
        }
      });

      onUpdated(() => {
        strategy.update?.(overlay);
      });

      onUnmounted(() => {
        strategy.dispose();
      });
    });

    const body = inject(platformToken)?.BODY;
    if (body) {
      const originOverflow = body.style.overflow;
      watch(visible, (value) => {
        if (props.backgroundBlock) {
          body.style.overflow = value ? 'hidden' : originOverflow;
        }
      });
      onUnmounted(() => {
        body.style.overflow = originOverflow;
      });
    }

    return () => (
      <Teleport to="#cdk-overlay-anchor">
        <Transition name="cdk-overlay-fade">
          <div
            v-show={visible.value}
            class={[
              'cdk-overlay-container',
              {
                [props.backgroundClass]: props.hasBackdrop,
                'cdk-overlay-container__disabled': !props.hasBackdrop
              }
            ]}
          >
            <div
              class={['cdk-overlay-panel', !props.hasBackdrop ? 'cdk-overlay-container__disabled' : '']}
              style={containerStyle.value}
              onClick={clickBackground}
            >
              <div
                ref={overlayRef}
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
    );
  }
});
