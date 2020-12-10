import { List, Method, Model, renderCondition } from 'vue-cdk/utils';
import { computed, defineComponent, reactive, ref, watch } from 'vue';
import { SliderButton } from './button';
import { watchRef } from 'vue-cdk/hook';



export const Slider = defineComponent({
  props: {
    modelValue: {
      type: [Number, List<number>()],
      default: 0,
    },
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
    tooltipClass: {
      type: String,
      default: ''
    },
    vertical: {
      type: Boolean,
      default: false
    },
    height: {
      type: String
    },
    buttonClass: {
      type: String,
      default: ''
    },
    onChange: {
      type: Method<() => void>(),
    },
    onBlur: {
      type: Method<() => void>()
    },
    onFocus: {
      type: Method<() => void>()
    },
    color: {
      type: Model<{ runway: string, bar: string }>(),
      default: {}
    },
  },
  emits: [
    'update:modelValue',
    'blur',
    'focus',
    'change'
  ],

  setup(props, ctx) {
    const firstValue = watchRef(ref(0));
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
      // console.log(value);
    });
    watch(secondValue, (value) => {
      if (props.range) {
        ctx.emit('update:modelValue', createSection(value, firstValue.value));
      }
    });

    const sliderRef = ref<HTMLDivElement | null>(null);

    const sliderLength = computed(() => {
      const slider = sliderRef.value;
      if (!slider) {
        return 1;
      }
      console.log(slider);
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
        offset = (rect.bottom - event.clientY) / sliderLength.value * 100;
      } else {
        offset = (event.clientX - rect.left) / sliderLength.value * 100;
      }
      if (props.range) {
        // Caculate the absolute distances between first & second.
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

    return () => {
      console.log(sliderRef.value?.clientWidth);
      return (
        <div
          ref={sliderRef}
          class={['el-slider', { 'is-vertical': props.vertical }]}
          role="slider"
          aria-valuemax={props.max}
          aria-valuemin={props.min}
          aria-orientation={props.vertical ? 'vertical' : 'horizontal'}
          aria-disabled={props.disabled}
          tabindex={0}
          {...ctx.attrs}
        >
          <div
            class={['el-slider__runway', { 'disabled': props.disabled }]}
            style={{
              background: props.color?.runway,
              height: props.vertical ? props.height : undefined,
            }}
            onClick={onSliderClick}
          >
            <div class="el-slider__bar" style={{
              background: props.color?.bar,
              ...barStyle.value
            }} />
            <SliderButton
              ref="button1"
              class={props.buttonClass}
              v-model={firstValue.value}
              tooltipClass={props.tooltipClass}
              vertical={props.vertical}
              sliderLength={sliderLength.value}
              max={props.max}
              min={props.min}
              position={positions.first}
              precision={precision.value}
              onDrag={(value) => dragging.value = value}
            />
            {renderCondition(
              props.range,
              () => <SliderButton
                ref="button2"
                class={props.buttonClass}
                v-model={secondValue.value}
                tooltipClass={props.tooltipClass}
                vertical={props.vertical}
                sliderLength={sliderLength.value}
                max={props.max}
                min={props.min}
                position={positions.second}
                precision={precision.value}
                onDrag={(value) => dragging.value = value}
              />
            )}
          </div>
        </div>
      );
    };
  }
});