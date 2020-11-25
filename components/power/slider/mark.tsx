import { defineComponent } from 'vue';

export const SliderMark = defineComponent({
  name: 'el-slider-mark',
  props: {
    label: {
      type: String,
      default: ''
    },
  },
  setup(props, ctx) {
    return () => (
      <div class="el-slider__marks-text" {...ctx.attrs}>
        {props.label}
      </div>
    );
  }
});