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


/**
 * @description
 *  This class will provider a <div /> in
 *  <body />, it can help teleport find the
 *  right tag. After that, The Overlay can 
 *  render the content in slot.
 * 
 * @date 2020-10-21
 * 
 * @export
 * @class OverlayPrivider
 */
class OverlayProvider {
  static instance = new OverlayProvider(document);

  div?: Element | null;
  constructor(document: Document) {
    let div = this.div = document.getElementById('vue-cdk-overlay');
    if (!div) {
      div = this.div = document.createElement('div');
      div.id = 'vue-cdk-overlay';
      div.className = 'vue-cdk-overlay-container';
      document.body.append(div);
    }
  }
}

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
    inject('cdk-overlay-provider', OverlayProvider.instance);

    const strategy = inject('cdk-overlay-strategy', new GlobalPositionStrategy());

    const container = ref<HTMLElement>();
    const containerStyle = ref<CSSProperties>({});
    const positionedStyle = ref<CSSProperties>({});


    const clickBackground = (event: Event) => {
      event.preventDefault();

      props.backdropClick?.();
      if (props.backdropClose) {
        ctx.emit('update:visible', false);
      }
    }

    const originOverflow = document.body.style.overflow;
    watchEffect((onInvalidate) => {
      if (props.backgroundBlock) {
        document.body.style.overflow = props.visible ? 'hidden' : originOverflow;
      }
      onInvalidate(() => {
        document.body.style.overflow = originOverflow;
      });
    });

    onMounted(() => {
      const overlayProps = strategy.setup();

      containerStyle.value = overlayProps.containerStyle;
      watch(overlayProps.positionedStyle, (value) => {
        positionedStyle.value = value;
      }, { immediate: true });

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
      }, {flush: 'sync'});
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
      <Teleport to="#vue-cdk-overlay">
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
