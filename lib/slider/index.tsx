import { List, renderCondition, toFixedNumber } from '../cdk/utils';
import { computed, defineComponent, ref, watch } from 'vue';
import { SliderButton } from './button';
import { range } from 'lodash-es';


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
      () => props.modelValue,
      (value) => {
        if (Array.isArray(value)) {
          firstValue.value = value[0];
          secondValue.value = value[1];
        } else {
          firstValue.value = value;
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
        return slider.clientHeight ?? 1;
      } else {
        return slider.clientWidth ?? 1;
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

    const onSliderClick = (event: MouseEvent) => {
      const slider = sliderRef.value;
      if (!slider) {
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

      } else {
        firstValue.value = toFixedNumber(offset, precision.value);
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
            v-model={firstValue.value}
            tooltipClass={props.tooltipClass}
            vertical={props.vertical}
            size={size.value}
            max={props.max}
            min={props.min}
          />
          {renderCondition(
            props.range,
            <SliderButton
              v-model={secondValue.value}
              tooltipClass={props.tooltipClass}
              vertical={props.vertical}
              size={size.value}
              max={props.max}
              min={props.min}
            />)}
          {/* {renderCondition(props.showStop, )} */}
        </div>
      </div>
    );
  }
});