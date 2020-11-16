import {
  defineComponent,
  Teleport,
  Transition,
  renderSlot,
  watch,
  onUnmounted,
  inject,
  provide,
  nextTick,
  ref,
  toRef,
} from "vue";
import { PositionStrategy, GlobalPositionStrategy } from './position';
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


    const visible = vmodelRef(toRef(props, 'visible'), (value) => {
      ctx.emit('update:visible', value);
    });

    const clickBackground = (event: Event) => {
      event.preventDefault();

      props.backdropClick?.();
      if (props.backdropClose) {
        visible.value = false;
      }
    }

    const overlayRef = ref<HTMLElement>();
    watch(overlayRef, (overlay) => {
      if (!overlay) {
        return;
        // throw Error('overlay container is null.');
      }
      nextTick(() => {
        strategy.apply?.(overlay);
      });

      watch(visible, (value) => {
        if (value) {
          nextTick(() => {
            strategy.apply?.(overlay);
          });
        } else {
          strategy.disapply?.();
        }
      }, { immediate: true });

    });

    onUnmounted(() => {
      strategy.dispose();
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

    // const containerClass = computed(() => {
    //   const clazz = ['cdk-overlay-container'];
    //   if (!props.hasBackdrop) {
    //     clazz.push('cdk-overlay-container__disabled');
    //   } else {
    //     clazz.push(props.backgroundClass);
    //   }
    //   return clazz;
    // });

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
              class={!props.hasBackdrop ? 'cdk-overlay-container__disabled' : undefined}
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
    )
  }
});
