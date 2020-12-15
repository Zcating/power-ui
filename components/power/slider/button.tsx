import { computed, customRef, defineComponent, reactive, ref, watch } from 'vue';
import { usePlatform } from 'vue-cdk';
import { watchRef } from 'vue-cdk/hook';
import { Method, addEvent, toFixedNumber } from 'vue-cdk/utils';
import { Tooltip } from '../tooltip';

export const SliderButton = defineComponent({
  name: 'po-slider-button',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100,
    },
    min: {
      type: Number,
      default: 0,
    },
    steps: {
      type: Number,
      default: 1,
    },
    precision: {
      tyep: Number,
      default: 0
    },
    vertical: {
      type: Boolean,
      default: false
    },
    tooltipClass: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    sliderLength: {
      type: Number,
      default: 1
    },
    format: {
      type: Method<(value: number) => string>(),
      default: String
    },
    clickedPosition: {
      type: Number,
      default: 0
    },
    enableTooltip: {
      type: Boolean,
      default: false
    },
    onDrag: Method<(value: boolean) => void>(),
  },

  emits: {
    'drag': (value: boolean) => true,
    'update:modelValue': (value: number) => true
  },

  setup(props, ctx) {
    const WINDOW = usePlatform().TOP!;

    // define state
    const state = reactive({
      showTooltip: customRef<boolean>((track, trigger) => {
        let show = false;
        const eenableTooltip = computed(() => {
          if (!eenableTooltip.value) {
            show = false;
          }
          return props.enableTooltip;
        });
        return {
          set(value: boolean) {
            if (eenableTooltip.value) {
              show = value;
              trigger();
            }
          },
          get() {
            track();
            return show;
          }
        };
      }),
      hovering: false,
      dragging: watchRef(
        ref(false),
        (value) => ctx.emit('drag', value)
      ),
      position: customRef((track, trigger) => {
        let position = 0;
        const result = {
          get() {
            track();
            return position;
          },
          set(newValue: number) {
            if (newValue === null || isNaN(newValue)) {
              return;
            }
            if (newValue <= 0) {
              position = 0;
            } else if (newValue >= 100) {
              position = 100;
            } else {
              position = newValue;
            }
            trigger();

            const { max, min, steps, precision } = props;
            const lengthPerStep = 100 / ((max - min) / steps);
            const stepCount = Math.round(position / lengthPerStep);
            const nextValue = toFixedNumber(stepCount * lengthPerStep * (max - min) * 0.01 + min, precision);
            ctx.emit('update:modelValue', nextValue);
          }
        };
        //
        watch(() => props.modelValue, (value) => {
          result.set(value / (props.max - props.min) * 100);
        }, { immediate: true });

        // whlie clicking runway, the position should change.
        watch(() => props.clickedPosition, (value) => result.set(value));

        return result;
      }),
      formatValue: computed(() => props.format(props.modelValue)),
      wrapperStyle: computed(() => {
        const { min, max, modelValue, vertical } = props;
        const offset = `${(modelValue - min) / (max - min) * 100}%`;
        return vertical ? { bottom: offset } : { left: offset };
      }),
    });

    // mouse event
    const handleMouseEnter = () => {
      state.hovering = true;
      state.showTooltip = true;
    };

    const handleMouseLeave = () => {
      state.hovering = false;
      if (!state.dragging) {
        state.showTooltip = false;
      }
    };
    // mouse event end


    // drag event
    const getPosition = (event: Event) => {
      let position = 0;
      if (event instanceof MouseEvent) {
        position = props.vertical ? event.clientY : event.clientX;
      } else if (event instanceof TouchEvent) {
        const touch = event.touches[0];
        position = props.vertical ? touch.clientY : touch.clientX;
      }
      return position;
    };

    const handleDrag = (event: Event) => {
      if (props.disabled) {
        return;
      }
      event.preventDefault();
      state.dragging = true;

      const prevPos = getPosition(event);
      const start = state.position;
      const disposes = [
        addEvent(WINDOW, ['mousemove', 'touchmove'], (event: MouseEvent | TouchEvent) => {
          if (!state.dragging) {
            return;
          }
          if (props.vertical) {
            state.position = start + (prevPos - getPosition(event)) / props.sliderLength * 100;
          } else {
            state.position = start + (getPosition(event) - prevPos) / props.sliderLength * 100;
          }
        }),

        addEvent(WINDOW, ['mouseup', 'touchend', 'contextmenu'], () => {
          state.dragging = false;
          state.showTooltip = false;
          disposes.forEach(fn => fn());
        })
      ];
    };
    // drag event end

    const buttonRef = ref<HTMLDivElement | null>(null);

    return () => {
      const { wrapperStyle, hovering, dragging, formatValue } = state;
      return (
        <div
          class="el-slider__button-wrapper"
          tabindex={0}
          ref={buttonRef}
          style={wrapperStyle}
          onMouseenter={handleMouseEnter}
          onMouseleave={handleMouseLeave}
          onMousedown={handleDrag}
          onTouchstart={handleDrag}
          onFocus={handleMouseEnter}
          onBlur={handleMouseLeave}
        >
          <Tooltip
            v-model={state.showTooltip}
            trigger="custom"
            placement={props.vertical ? 'right' : 'top'}
            v-slots={{
              default: () => (
                <div class={['el-slider__button', { 'hover': hovering, 'dragging': dragging }]} {...ctx.attrs} />
              ),
              content: () => (
                <span style={{ textAlign: 'center' }}>{formatValue}</span>
              )
            }}
          />
        </div>
      );
    };
  }
});