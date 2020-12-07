import { throttle } from 'lodash-es';
import { defineComponent, Transition, ref, computed, Fragment } from 'vue';
import { useViewport } from 'vue-cdk';
import { domRef } from 'vue-cdk/hook';
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
    type: String,
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

    const activeIndex = ref(0);
    const throttledArrowClick = throttle((e: Event, index: number) => {
      e.stopImmediatePropagation();
    }, 300);

    const handleIndicatorHover = (index: number) => {
      if (props.trigger === 'hover' && index === activeIndex.value) {
        activeIndex.value = index;
      }
    };
    const throttledIndicatorHover = throttle(handleIndicatorHover, 300);

    const handleIndicatorClick = (e: Event, index: number) => {
      e.stopImmediatePropagation();
      activeIndex.value = index;
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


    const containerRef = domRef<HTMLElement>((el) => {

    });

    useViewport().observe(() => {

    });

    const hoverRef = ref(false);
    const onHover = (value: boolean) => (e: Event) => {
      e.stopImmediatePropagation();
      hoverRef.value = value;
    };

    const arrowDisplay = computed(() => props.arrow !== 'never' && props.direction !== 'vertical');
    const arrowVisible = (reachBorder: boolean) => {
      return (props.arrow === 'always' || hoverRef.value) && (props.loop || reachBorder);
    };



    return () => {
      const { direction, indicatorPosition, type, loop } = props;

      const nodes = ctx.slots.default?.() ?? [];
      const children = nodes.map((node, index) => (
        <CarouselItem
          key={index}
          index={index}
          type={type}
          loop={loop}
          direction={direction}
          length={nodes.length}
          v-model={activeIndex.value}
        >
          {node}
        </CarouselItem>
      ));

      return (
        <div
          class={carouselClasses.value}
          ref={containerRef}
          onMouseenter={onHover(true)}
          onMouseleave={onHover(false)}
        >
          <div class="el-carousel__container">
            {arrowDisplay.value ? (
              <Fragment>
                <Transition name="carousel-arrow-left">
                  <button
                    type="button"
                    v-show={arrowVisible(activeIndex.value > 0)}
                    class="el-carousel__arrow el-carousel__arrow--left"
                    onClick={(e) => throttledArrowClick(e, activeIndex.value - 1)}
                  >
                    <i class="el-icon-arrow-left" />
                  </button>
                </Transition>
                <Transition name="carousel-arrow-right">
                  <button
                    type="button"
                    v-show={arrowVisible(activeIndex.value < nodes.length - 1)}
                    class="el-carousel__arrow el-carousel__arrow--right"
                    onClick={(e) => throttledArrowClick(e, activeIndex.value + 1)}
                  >
                    <i class="el-icon-arrow-right" />
                  </button>
                </Transition>
              </Fragment>
            ) : null}
            {children}
          </div>
          {indicatorPosition !== 'none' ? (
            <ul
              class={indicatorsClasses.value}
            >
              {nodes.map((item, index) => (
                <li
                  key={index}
                  class={[
                    'el-carousel__indicator',
                    'el-carousel__indicator--' + direction,
                    { 'is-active': index === activeIndex.value }
                  ]}
                  onMouseenter={() => throttledIndicatorHover(index)}
                  onClick={(e) => handleIndicatorClick(e, index)}
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

