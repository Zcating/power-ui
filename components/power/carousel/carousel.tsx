import { throttle } from 'lodash-es';
import { defineComponent, Transition, ref, computed, Fragment, reactive, customRef, watch, watchEffect } from 'vue';
import { useInterval } from 'vue-cdk/hook';
import { Enum } from 'vue-cdk/utils';
import { CarouselItem } from './carousel-item';

export const Carousel = defineComponent({
  name: 'po-carousel',
  inheritAttrs: false,

  props: {
    direction: {
      type: Enum<'vertical' | 'horizontal'>(),
      default: 'horizontal',
      validator: (val: any) => {
        return ['horizontal', 'vertical'].indexOf(val) !== -1;
      }
    },
    trigger: {
      type: Enum<'click' | 'hover'>(),
      default: 'hover'
    },
    indicatorPosition: {
      type: Enum<'outside' | 'none'>(),
      default: 'outside',
    },
    initialIndex: {
      type: Number,
      default: 0
    },
    height: String,
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    },
    indicator: {
      type: Boolean,
      default: true
    },
    arrow: {
      type: Enum<'hover' | 'always' | 'never'>(),
      default: 'hover',
      validator: (val: any) => ['hover', 'always', 'never'].indexOf(val) !== -1
    },
    type: {
      type: Enum<'default' | 'card'>(),
      default: 'card'
    },
    loop: {
      type: Boolean,
      default: true
    }
  },

  setup(props, ctx) {

    const carouselClasses = computed(() => {
      if (props.type === 'card') {
        return ['el-carousel', 'el-carousel--' + props.direction, 'el-carousel--card'];
      } else {
        return ['el-carousel', 'el-carousel--' + props.direction];
      }
    });

    const state = reactive({
      activeIndex: customRef((track, trigger) => {
        let index = 0;
        return {
          get() {
            track();
            return index;
          },
          set(val: number) {
            if (val < 0) {
              index = props.loop ? state.length - 1 : 0;
            } else if (val >= state.length) {
              index = props.loop ? 0 : state.length - 1;
            } else {
              index = val;
            }
            trigger();
          }
        };
      }),
      length: 0,
    });
    const throttledArrowClick = throttle((e: Event, index: number) => {
      e.stopImmediatePropagation();
      state.activeIndex = index;
    }, 300);

    const indicatorHover = throttle((index: number) => {
      if (props.trigger === 'hover' && index !== state.activeIndex) {
        state.activeIndex = index;
      }
    }, 300);

    const handleIndicatorClick = (index: number) => (e: Event) => {
      e.stopImmediatePropagation();
      state.activeIndex = index;
    };

    const indicatorsClasses = computed(() => {
      const { direction, indicatorPosition, type } = props;
      if (indicatorPosition === 'outside' || type === 'card') {
        return [
          'el-carousel__indicators',
          'el-carousel__indicators--' + direction,
          'el-carousel__indicators--outside'
        ];
      } else {
        return [
          'el-carousel__indicators',
          'el-carousel__indicators--' + direction
        ];
      }
    });

    // hover
    const hoverRef = ref(false);
    const onHover = (value: boolean) => (e: Event) => {
      e.stopImmediatePropagation();
      hoverRef.value = value;
    };

    // arrow visible
    const arrowDisplay = computed(() => props.arrow !== 'never' && props.direction !== 'vertical');
    const arrowVisible = (reachBorder: boolean) => {
      return (props.arrow === 'always' || hoverRef.value) && (props.loop || reachBorder);
    };

    // get size of container
    const containerDiv = ref<HTMLDivElement | null>(null);
    const sizeRef = computed(() => {
      const container = containerDiv.value;
      if (!container) {
        return 0;
      }
      return props.direction === 'vertical' ? container.offsetHeight : container.offsetWidth;
    });

    // timer
    watchEffect((onInvalidate) => {
      const stop = useInterval(() => {
        state.activeIndex += 1;
      }, props.interval);
      onInvalidate(stop);
    });

    return () => {
      const { direction, indicatorPosition, type, loop } = props;

      const nodes = ctx.slots.default?.() ?? [];
      state.length = nodes.length;

      const children = nodes.map((node, index) => (
        <CarouselItem
          key={index}
          v-model={state.activeIndex}
          index={index}
          type={type}
          loop={loop}
          direction={direction}
          length={nodes.length}
          size={sizeRef.value}
        >
          {node}
        </CarouselItem>
      ));

      return (
        <div
          class={carouselClasses.value}
          onMouseenter={onHover(true)}
          onMouseleave={onHover(false)}
        >
          <div class="el-carousel__container" ref={containerDiv}>
            {arrowDisplay.value ? (
              <Fragment>
                <Transition name="carousel-arrow-left">
                  <button
                    type="button"
                    v-show={arrowVisible(state.activeIndex > 0)}
                    class="el-carousel__arrow el-carousel__arrow--left"
                    onClick={(e) => throttledArrowClick(e, state.activeIndex - 1)}
                  >
                    <i class="el-icon-arrow-left" />
                  </button>
                </Transition>
                <Transition name="carousel-arrow-right">
                  <button
                    type="button"
                    v-show={arrowVisible(state.activeIndex < nodes.length - 1)}
                    class="el-carousel__arrow el-carousel__arrow--right"
                    onClick={(e) => throttledArrowClick(e, state.activeIndex + 1)}
                  >
                    <i class="el-icon-arrow-right" />
                  </button>
                </Transition>
              </Fragment>
            ) : null}
            {children}
          </div>
          {indicatorPosition !== 'none' ? (
            <ul class={indicatorsClasses.value}>
              {nodes.map((_, index) => (
                <li
                  key={index}
                  class={[
                    'el-carousel__indicator',
                    'el-carousel__indicator--' + direction,
                    { 'is-active': index === state.activeIndex }
                  ]}
                  onMouseenter={() => indicatorHover(index)}
                  onClick={handleIndicatorClick(index)}
                >
                  <button class="el-carousel__button" />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      );
    };
  }
});

