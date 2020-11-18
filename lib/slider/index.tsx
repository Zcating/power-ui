import { List, renderCondition } from '../cdk/utils';
import { computed, defineComponent, ref, watch } from 'vue';
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
    }
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

    const onSliderClick = (event: MouseEvent) => {

    };

    return () => (
      <div class="el-slider" {...ctx.attrs} ref={sliderRef}>
        <div
          class={['el-slider__runway', { 'disabled': props.disabled }]}
          onClick={onSliderClick}
        >
          <div class="el-slider__bar" />
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
              tooltipClass={props.tooltipClass}
              vertical={props.vertical}
              v-model={secondValue.value}
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