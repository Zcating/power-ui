import { computed, defineComponent, getCurrentInstance, onMounted, reactive, watch } from 'vue';
import { usePlatform } from 'vue-cdk';
import { useResize } from 'vue-cdk/hook';
import { Enum, Method } from 'vue-cdk/utils';

const CARD_SCALE = 0.83;

export const CarouselItem = defineComponent({
  name: 'po-carousel-item',
  inheritAttrs: false,

  props: {
    type: {
      type: String,
      required: true
    },
    direction: {
      type: Enum<'vertical' | 'horizontal'>(),
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    length: {
      type: Number,
      required: true
    },
    loop: {
      type: Boolean,
      required: true,
    },
    modelValue: {
      type: Number,
      default: 0,
    },
    size: {
      type: Number,
      required: true
    }
  },

  setup(props, ctx) {

    const state = reactive({
      inStage: false,
      hover: false,
      animating: false,
      ready: false,
      active: false,
      translate: 0,
      scale: 1
    });


    const parent = getCurrentInstance()?.parent;
    const parentElRef = computed(() => {
      return parent?.proxy?.$el;
    });

    const handleItemClick = () => {
      if (props.type === 'card' && props.modelValue !== props.index) {
        ctx.emit('update:modelValue', props.index);
      }
    };

    const calcCardTranslate = (index: number, activeIndex: number) => {
      if (state.inStage) {
        return props.size * ((2 - CARD_SCALE) * (index - activeIndex) + 1) / 4;
      } else if (index < activeIndex) {
        return -(1 + CARD_SCALE) * props.size / 4;
      } else {
        return (3 + CARD_SCALE) * props.size / 4;
      }
    };

    const calcTranslate = (index: number, activeIndex: number) => {
      return props.size * (index - activeIndex);
    };

    const processIndex = (index: number, activeIndex: number, length: number) => {
      if (activeIndex === 0 && index === length - 1) {
        return -1;
      } else if (activeIndex === length - 1 && index === 0) {
        return length;
      } else if (index < activeIndex - 1 && activeIndex - index >= length / 2) {
        return length + 1;
      } else if (index > activeIndex + 1 && index - activeIndex >= length / 2) {
        return -2;
      }
      return index;
    };

    const translateItem = (index: number, activeIndex: number, oldIndex?: number) => {
      const { type, direction, length, loop } = props;

      if (type !== 'card' && oldIndex !== undefined) {
        state.animating = index === activeIndex || index === oldIndex;
      }
      if (index !== activeIndex && length > 2 && loop) {
        index = processIndex(index, activeIndex, length);
      }

      if (type === 'card') {
        if (direction === 'vertical') {
          console.warn('[Element Warn][Carousel]vertical direction is not supported in card mode');
        }
        state.inStage = Math.round(Math.abs(index - activeIndex)) <= 1;
        state.active = index === activeIndex;
        state.translate = calcCardTranslate(index, activeIndex);
        state.scale = state.active ? 1 : CARD_SCALE;
      } else {
        state.active = index === activeIndex;
        state.translate = calcTranslate(index, activeIndex);
      }
      state.ready = true;
    };

    onMounted(() => {
      watch(() => props.modelValue, (activeIndex, oldIndex) => {
        translateItem(props.index, activeIndex, oldIndex);
      }, { immediate: true });
    });

    const { DOCUMENT } = usePlatform();
    if (DOCUMENT) {
      useResize(DOCUMENT, () => {
        translateItem(props.index, props.modelValue);
      });
    }

    const itemStyle = computed(() => {
      const translateType = props.direction === 'vertical' ? 'translateY' : 'translateX';
      const value = `${translateType}(${state.translate}px) scale(${state.scale})`;
      return { transform: value };
    });

    return () => {
      const { type } = props;
      const { active, inStage, hover, animating, ready } = state;
      return (
        <div
          v-show={ready}
          class={[
            'el-carousel__item',
            {
              'is-active': active,
              'el-carousel__item--card': type === 'card',
              'is-in-stage': inStage,
              'is-hover': hover,
              'is-animating': animating
            }
          ]}
          onClick={handleItemClick}
          style={itemStyle.value}
        >
          {type === 'card' ? (
            <div
              v-show={!active}
              class="el-carousel__mask"
            />
          ) : null}
          {ctx.slots.default?.()}
        </div>
      );
    };
  }
});