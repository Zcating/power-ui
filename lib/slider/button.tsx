import { computed, customRef, defineComponent, reactive, ref, watch } from 'vue';
import { usePlatform } from '../cdk/global';
import { Method, addEvent, toFixedNumber } from '../cdk/utils';
import { Tooltip } from '../tooltip';

export const SliderButton = defineComponent({
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    vertical: {
      type: Boolean,
      default: false
    },
    tooltipClass: String,
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 1
    },
    format: {
      type: Method<(value: number) => string>(),
      default: String
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

    position: {
      type: Number,
      default: 0
    },
    onDrag: Method<(value: boolean) => void>(),
  },

  emits: {
    'drag': (value: boolean) => true,
    'update:modelValue': (value: number) => true
  },

  setup(props, ctx) {
    const formatValue = computed(() => {
      return props.format(props.modelValue);
    });

    const WINDOW = usePlatform().TOP!;

    const state = reactive({
      showTooltip: false,
      hovering: false,
      dragging: false,
    });

    watch(() => state.dragging, (value) => {
      ctx.emit('drag', value);
    });

    const positionRef = customRef((track, trigger) => {
      let position = 0;
      return {
        get() {
          track();
          return position;
        },
        set(newValue: number) {
          if (newValue === null || isNaN(newValue)) {
            return;
          }
          if (newValue < 0) {
            position = 0;
          } else if (newValue > 100) {
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
    });

    watch(() => props.position, (value) => {
      positionRef.value = value;
    });

    const handleMouseEnter = () => {
      state.hovering = true;
      state.showTooltip = true;
    };
    const handleMouseLeave = () => {
      state.hovering = false;
      state.showTooltip = false;
    };
    const handleDrag = (event: Event) => {
      if (props.disabled) {
        return;
      }
      event.preventDefault();
      state.dragging = true;
      let prevX = 0;
      let prevY = 0;
      if (event instanceof MouseEvent) {
        prevX = event.clientX;
        prevY = event.clientY;
      } else if (event instanceof TouchEvent) {
        const touch = event.touches[0];
        prevX = touch.clientX;
        prevY = touch.clientY;
      }

      const start = positionRef.value;

      const disposes = [
        addEvent(WINDOW, ['mousemove', 'touchmove'], (event: MouseEvent | TouchEvent) => {
          if (!state.dragging) {
            return;
          }

          let currentX = 0;
          let currentY = 0;
          if (event instanceof MouseEvent) {
            currentX = event.clientX;
            currentY = event.clientY;
          } else if (event instanceof TouchEvent) {
            const touch = (event as TouchEvent).touches[0];
            currentX = touch.clientX;
            currentY = touch.clientY;
          }

          let diff = 0;
          if (props.vertical) {
            diff = (prevY - currentY) / props.size * 100;
          } else {
            diff = (currentX - prevX) / props.size * 100;
          }
          positionRef.value = start + diff;
        }),

        addEvent(WINDOW, ['mouseup', 'touchend', 'contextmenu'], () => {
          state.dragging = false;
          state.showTooltip = false;
          disposes.forEach(fn => fn());
        })
      ];
    };

    const buttonRef = ref<HTMLDivElement | null>(null);

    const wrapperStyle = computed(() => {
      const { min, max, modelValue, vertical } = props;
      const position = `${(modelValue - min) / (max - min) * 100}%`;
      return vertical ? { bottom: position } : { left: position };
    });

    return () => (
      <div
        class="el-slider__button-wrapper"
        tabindex={0}
        ref={buttonRef}
        style={wrapperStyle.value}
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
              <div class={['el-slider__button', { 'hover': state.hovering, 'dragging': state.dragging }]} />
            ),
            content: () => (
              <span style={{ textAlign: 'center' }}>{formatValue.value}</span>
            )
          }}
        />
      </div>
    );
  }
});