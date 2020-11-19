import { vmodelRef } from '../cdk/hook';
import { isObject, List, Model, renderCondition } from '../cdk/utils';
import { computed, defineComponent, Prop, reactive, Ref, ref, renderList, toRef, VNode } from 'vue';

export type RateSection = {
  [k in number]: { value: string, excluded: boolean } | string
}


export const Rate = defineComponent({
  name: 'el-rate',
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    lowThreshold: {
      type: Number,
      default: 2
    },
    highThreshold: {
      type: Number,
      default: 4
    },
    max: {
      type: Number,
      default: 5
    },
    colors: {
      type: [Array, Object],
      default: ['#F7BA2A', '#F7BA2A', '#F7BA2A']
    },
    voidColor: {
      type: String,
      default: '#C6D1DE'
    },
    disabledVoidColor: {
      type: String,
      default: '#EFF2F7'
    },
    iconClasses: {
      type: [Array, Object],
      default: () => ['el-icon-star-on', 'el-icon-star-on', 'el-icon-star-on']
    },
    voidIconClass: {
      type: String,
      default: 'el-icon-star-off'
    },
    disabledVoidIconClass: {
      type: String,
      default: 'el-icon-star-on'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    allowHalf: {
      type: Boolean,
      default: false
    },
    showText: {
      type: Boolean,
      default: false
    },
    showScore: {
      type: Boolean,
      default: false
    },
    textColor: {
      type: String,
      default: '#1f2d3d'
    },
    texts: {
      type: List<string>(),
      default: () => ['极差', '失望', '一般', '满意', '惊喜']
    },
    scoreTemplate: {
      type: String,
      default: '{value}'
    }
  },

  setup(props, ctx) {
    const currentValue = vmodelRef(toRef(props, 'modelValue'), value => {
      ctx.emit('update:modelValue', value);
    });
    const rateDisabled = toRef(props, 'disabled');
    const texts = ref([]);
    const text = computed(() => {
      let result = '';
      const current = currentValue.value;
      if (props.showScore) {
        const value = rateDisabled.value ? props.modelValue : current;
        result = props.scoreTemplate.replace(/\{\s*value\s*\}/, `${value}`);
      } else if (props.showText) {
        result = texts.value[Math.ceil(current) - 1];
      }
      return result;
    });

    const handleKey = () => {

    };

    const state = reactive({
      hoverIndex: 0,
      currentValue: 0,
      pointerAtLeftHalf: false,
    });

    const setCurrentValue = (value: number, event: MouseEvent) => {
      if (rateDisabled.value) {
        return;
      }
      if (props.allowHalf) {
        const target = (event.target as Element);
        let width = target.clientWidth;
        if (target.classList.contains('el-rate__item')) {
          width = target.querySelector('.el-rate__icon')!.clientWidth;
        }
        if (target.classList.contains('el-rate__decimal')) {
          width = (target.parentNode! as Element).clientWidth;
        }

        state.pointerAtLeftHalf = event.offsetX * 2 <= width;
        state.currentValue = state.pointerAtLeftHalf ? value - 0.5 : value;
      } else {
        state.currentValue = value;
      }
      state.hoverIndex = value;
    };

    const resetCurrentValue = () => {
    };

    const selectValue = (item: number) => {
      if (rateDisabled.value) {
        return;
      }
      if (props.allowHalf) {

      }
    };


    const computeSection = (valueRef: Ref<string[] | RateSection>) => {
      return computed(() => {
        const target = valueRef.value;
        return Array.isArray(target)
          ? {
            [props.lowThreshold!]: target[0],
            [props.highThreshold!]: { value: target[1], excluded: true },
            [props.max!]: target[2]
          } : target as RateSection;
      });
    };
    const colorSection = computeSection(toRef(props, 'colors'));
    const iconsSection = computeSection(toRef(props, 'iconClasses'));

    const getValueFromSection = (value: number, section: RateSection) => {
      const matchedKeys = (Object.keys(section) as unknown as number[])
        .filter(key => {
          const val = section[key];
          const excluded = isObject(val) ? val.excluded : false;
          return excluded ? value < key : value <= key;
        })
        .sort((a, b) => a - b);
      const matchedValue = section[matchedKeys[0]];
      return isObject(matchedValue) ? matchedValue.value : (matchedValue || '');
    };

    const activeColor = computed(() => {
      return getValueFromSection(state.currentValue, colorSection.value);
    });

    const activeClass = computed(() => {
      return getValueFromSection(state.currentValue, iconsSection.value);

    });

    const decimalIconClass = computed(() => {
      return getValueFromSection(props.modelValue, iconsSection.value);
    });

    const voidClass = computed(() => {
      return props.disabled ? props.disabledVoidIconClass : props.voidIconClass;
    });

    const classes = computed(() => {
      const result = [];
      let i = 0;
      let threshold = state.currentValue;
      if (props.allowHalf && threshold !== Math.floor(threshold)) {
        threshold--;
      }
      for (; i < threshold; i++) {
        result.push(activeClass.value);
      }
      for (; i < props.max; i++) {
        result.push(voidClass.value);
      }
      return result;
    });

    const valueDecimal = computed(() => {
      const { modelValue } = props;
      return modelValue * 100 - Math.floor(modelValue) * 100;
    });
    const decimalStyle = computed(() => {
      return {
        color: activeColor.value,
        width: props.disabled ? `${valueDecimal.value}%` : props.allowHalf ? '50%' : ''
      };
    });

    const showDecimalIcon = (item: number) => {
      const { modelValue, disabled, allowHalf } = props;
      const showWhenDisabled = disabled && valueDecimal.value > 0 && item - 1 < modelValue && item > modelValue;
      const showWhenAllowHalf = allowHalf &&
        state.pointerAtLeftHalf &&
        item - 0.5 <= state.currentValue &&
        item > state.currentValue;
      return showWhenDisabled || showWhenAllowHalf;
    };

    const getIconStyle = (item: number) => {
      const voidColor = rateDisabled.value ? props.disabledVoidColor : props.voidColor;
      return {
        color: item <= currentValue.value ? activeColor.value : voidColor
      };
    };

    return () => (
      <div
        class="el-rate"
        role="slider"
        onKeydown={handleKey}
        aria-valuenow={currentValue.value}
        aria-valuetext={text.value}
        aria-valuemin={0}
        aria-valuemax={props.max}
        tabindex={0}
      >
        {...renderList(props.max, (item, key) => (
          <span
            class="el-rate__item"
            onMousemove={($event) => setCurrentValue(item, $event)}
            onMouseleave={resetCurrentValue}
            onClick={() => selectValue(item)}
            style={{ cursor: rateDisabled.value ? 'auto' : 'pointer' }}
            key={key}
          >
            <i
              class={['el-rate__icon', classes.value[item - 1], { 'hover': state.hoverIndex === item }]}
              style={getIconStyle(item)}
            >
              {renderCondition(showDecimalIcon(item),
                <i
                  class={['el-rate__decimal', decimalIconClass.value]}
                  style={decimalStyle.value}
                />
              )}
            </i>
          </span> as VNode
        ))}
        {renderCondition(props.showText || props.showScore, <span class="el-rate__text" style={{ color: props.textColor }}>{text}</span>)}
      </div>
    );
  },
});
