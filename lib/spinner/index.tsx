import { computed, defineComponent } from 'vue'

import { coerceCssPixelValue } from '../cdk/coercion';

export const Spinner = defineComponent({
  name: 'ElSpinner',
  props: {
    type: String,
    radius: {
      type: Number,
      default: 100
    },
    strokeWidth: {
      type: Number,
      default: 5
    },
    strokeColor: {
      type: String,
      default: '#efefef'
    }
  },

  setup(props) {
    const spinnerStyle = computed(() => {
      const innerRadius = coerceCssPixelValue(props.radius / 2);
      return { width: innerRadius, height: innerRadius };
    });
    
    return { spinnerStyle };
  },

  render() {
    const { strokeColor, strokeWidth, spinnerStyle } = this;
    return <span class="el-spinner">
      <svg
        class="el-spinner-inner"
        viewBox="0 0 50 50"
        style={spinnerStyle}
      >
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke={strokeColor} stroke-width={strokeWidth} />
      </svg>
    </span>
  }
});