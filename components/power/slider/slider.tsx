import { List, renderCondition } from 'vue-cdk/utils';
import { computed, defineComponent, reactive, ref, watch } from 'vue';
import { SliderButton } from './button';



export const Slider = defineComponent({
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    range: {
      type: Boolean,
      default: false,
    },
    showStop: {
      type: Boolean,
      default: false,
    },
    tooltipClass: String,
    vertical: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: [Number, List<number>()],
      default: 0,
    },
    height: {
      type: String
    },
  },
  setup(props, ctx) {
    const firstValue = ref(0);
    const secondValue = ref(0);
    watch(
      () => [props.modelValue, props.min, props.max],
      (values) => {
        const value = values[0];
        const min = values[1] as number;
        const max = values[2] as number;
        if (Array.isArray(value)) {
          firstValue.value = Math.max(value[0], min);
          secondValue.value = Math.min(value[1], max);
        } else {
          firstValue.value = Math.max(value, min);
        }
      },
      { immediate: true }
    );

    const createSection = (value1: number, value2: number) => {
      return value1 > value2 ? [value2, value1] : [value1, value2];
    };

    watch(firstValue, (value) => {
      if (props.range) {
        ctx.emit('update:modelValue', createSection(value, secondValue.value));
      } else {
        ctx.emit('update:modelValue', value);
      }
    });
    watch(secondValue, (value) => {
      if (props.range) {
        ctx.emit('update:modelValue', createSection(value, firstValue.value));
      }
    });

    const sliderRef = ref<HTMLDivElement | null>(null);

    const size = computed(() => {
      const slider = sliderRef.value;
      if (!slider) {
        return 0;
      }
      if (props.vertical) {
        return slider.clientHeight ?? 0;
      } else {
        return slider.clientWidth ?? 0;
      }
    });

    const barStyle = computed(() => {
      const rangeSize = props.max - props.min;
      let barSize: number | string;
      let barStart: number | string;
      if (props.range) {
        const first = firstValue.value;
        const second = secondValue.value;
        barSize = Math.abs(first - second) / rangeSize;
        barStart = (Math.min(first, second) - props.min) / rangeSize;
      } else {
        barSize = (firstValue.value - props.min) / rangeSize;
        barStart = 0;
      }
      barSize = `${barSize * 100}%`;
      barStart = `${barStart * 100}%`;
      return props.vertical ? { height: barSize, top: barStart } : { width: barSize, left: barStart };
    });

    const precision = computed(() => {
      return Math.max(...[props.min, props.max, props.step].map(item => {
        const decimal = ('' + item).split('.')[1];
        return decimal ? decimal.length : 0;
      }));
    });

    const positions = reactive({
      first: 0,
      second: 0
    });

    const dragging = ref(false);

    const onSliderClick = (event: MouseEvent) => {
      const slider = sliderRef.value;
      if (!slider || dragging.value || props.disabled) {
        return;
      }
      const rect = slider.getBoundingClientRect();
      let offset: number;
      if (props.vertical) {
        offset = (rect.bottom - event.clientY) / size.value * 100;
      } else {
        offset = (event.clientX - rect.left) / size.value * 100;
      }
      if (props.range) {
        // Caculate the relative distances between first & second.
        const firstDist = Math.abs(offset - firstValue.value);
        const secondDist = Math.abs(offset - secondValue.value);
        if (firstDist < secondDist) {
          positions.first = offset;
        } else {
          positions.second = offset;
        }
      } else {
        positions.first = offset;
      }
    };

    return () => (
      <div
        ref={sliderRef}
        class={['el-slider', { 'is-vertical': props.vertical }]}
        role="slider"
        aria-valuemax={props.max}
        aria-valuemin={props.min}
        aria-orientation={props.vertical ? 'vertical' : 'horizontal'}
        aria-disabled={props.disabled}
        {...ctx.attrs}
      >
        <div
          class={['el-slider__runway', { 'disabled': props.disabled }]}
          style={props.vertical ? { height: props.height } : undefined}
          onClick={onSliderClick}
        >
          <div class="el-slider__bar" style={barStyle.value} />
          <SliderButton
            ref="button1"
            v-model={firstValue.value}
            tooltipClass={props.tooltipClass}
            vertical={props.vertical}
            size={size.value}
            max={props.max}
            min={props.min}
            position={positions.first}
            precision={precision.value}
            onDrag={(value) => dragging.value = value}
          />
          {renderCondition(
            props.range,
            <SliderButton
              ref="button2"
              v-model={secondValue.value}
              tooltipClass={props.tooltipClass}
              vertical={props.vertical}
              size={size.value}
              max={props.max}
              min={props.min}
              position={positions.second}
              precision={precision.value}
              onDrag={(value) => dragging.value = value}
            />)}
        </div>
      </div>
    );
  }
});