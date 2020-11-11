import { Model, renderCondition } from '../cdk/utils';
import { CSSProperties, defineComponent, h, provide, ref } from 'vue'
import { Bar } from './bar';
import scrollBarWidth from './utils';

export default defineComponent({
  name: 'ElScrollbar',

  props: {
    native: Boolean,
    wrapStyle: {
      type: [String, Model<CSSProperties>()],
      default: '',
    },
    wrapClass: {},
    viewClass: {},
    viewStyle: {},
    // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    noresize: Boolean,
    tag: {
      type: String,
      default: 'div'
    }
  },

  data() {
    return {
      sizeWidth: '0',
      sizeHeight: '0',
      moveX: 0,
      moveY: 0
    };
  },

  setup() {
    const wrapRef = ref<HTMLElement>();

    provide('el-scrollbar-wrap', wrapRef);

    return {
      wrap: wrapRef,
    }
  },

  methods: {
    handleScroll() {
      const wrap = this.wrap!;

      this.moveY = ((wrap.scrollTop * 100) / wrap.clientHeight);
      this.moveX = ((wrap.scrollLeft * 100) / wrap.clientWidth);
    },

    update() {
      const wrap = this.wrap;
      if (!wrap) {
        return;
      }

      const heightPercentage = (wrap.clientHeight * 100 / wrap.scrollHeight);
      const widthPercentage = (wrap.clientWidth * 100 / wrap.scrollWidth);

      this.sizeHeight = (heightPercentage < 100) ? (heightPercentage + '%') : '';
      this.sizeWidth = (widthPercentage < 100) ? (widthPercentage + '%') : '';
    }
  },

  mounted() {
    if (this.native) return;
    this.$nextTick(() => this.update());
  },

  beforeDestroy() {
    if (this.native) return;
  },

  render() {
    const {
      $slots,
      tag,
      wrapStyle,
      wrapClass,
      viewClass,
      viewStyle,
      native,
      moveX,
      moveY,
      sizeWidth,
      sizeHeight,
      handleScroll,
    } = this;

    const gutter = scrollBarWidth();

    let style: CSSProperties | string;
    const gutterWith = `-${gutter}px`;
    if (!wrapStyle) {
      style = { marginBottom: gutterWith, marginRight: gutterWith };
    } else if (typeof wrapStyle === "object") {
      style = { ...wrapStyle };
      style.marginRight = style.marginBottom = gutterWith;
    } else {
      style = `${wrapStyle ?? ''} margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`;
    }

    const divProps = {
      ref: "wrap",
      class: [wrapClass, 'el-scrollbar__wrap'],
      style: style,
      onScroll: undefined as any,
    };

    if (!native) {
      divProps.class.push(gutter ? '' : 'el-scrollbar__wrap--hidden-default');
      divProps.onScroll = handleScroll;
    }

    return (
      <div class="el-scrollbar">
        <div
          {...divProps}
          v-slots={{
            default: () => h(tag, {
              class: ['el-scrollbar__view', viewClass],
              style: viewStyle,
              ref: 'resize'
            }, $slots.default)
          }}
        />,
        {renderCondition(
          !native,
          [
            <Bar move={moveX} size={sizeWidth} />,
            <Bar vertical move={moveY} size={sizeHeight} />
          ]
        )}
      </div>
    );
  },
});
