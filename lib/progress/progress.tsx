import { renderCondition } from '../cdk/utils';
import { computed, CSSProperties, defineComponent, Prop } from 'vue';
import { ElProgressType, ColorFunction, ElProgressStatus, FormatFunction, StringArray } from './types';

export const Progress = defineComponent({
  name: 'el-progress',
  props: {
    type: {
      type: String as () => ElProgressType,
      default: 'line',
      validator: (val: any) => ['line', 'circle', 'dashboard'].indexOf(val) > -1
    } as Prop<string, string>,
    percentage: {
      type: Number,
      default: 0,
      required: true,
      validator: (val: any) => val >= 0 && val <= 100
    } as Prop<number, number>,
    status: {
      type: String as () => ElProgressStatus,
      validator: (val: any) => ['success', 'exception', 'warning'].indexOf(val) > -1
    } as Prop<string, string>,
    strokeWidth: {
      type: Number,
      default: 6
    },
    strokeLinecap: {
      type: String as () => "round" | "inherit" | "butt" | "square" | undefined,
      default: 'round'
    },
    textInside: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 126
    },
    showText: {
      type: Boolean,
      default: true
    },
    color: {
      type: [String, StringArray, ColorFunction],
      default: ''
    },
    format: FormatFunction
  },

  setup(props) {
    const levelColor = (percentage: number, colors: string[]) => {
      const span = 100 / colors.length;
      const colorArray = colors.map((color, index) => {
        if (typeof color === 'string') {
          return {
            color,
            progress: (index + 1) * span,
            percentage: 0
          };
        }
        return color;
      }).sort((a, b) => a.percentage - b.percentage);

      for (let i = 0; i < colorArray.length; i++) {
        if (colorArray[i].percentage > percentage) {
          return colorArray[i].color;
        }
      }
      return colorArray[colorArray.length - 1].color;
    };
    const currentColor = (color: any, percentage: number) => {
      if (typeof color === 'function') {
        return color(percentage);
      } else if (typeof color === 'string') {
        return color;
      } else {
        return levelColor(percentage, color);
      }
    };

    const barStyle = computed(() => {
      const style: CSSProperties = {};
      const percentage = props.percentage!;
      style.width = percentage + '%';
      style.backgroundColor = currentColor(props.color, percentage);
      return style;
    });

    const stroke = computed(() => {
      if (props.color) {
        return currentColor(props.color, props.percentage!);
      } else {
        switch (props.status) {
          case 'success': return '#13ce66';
          case 'exception': return '#ff4949';
          case 'warning': return '#e6a23c';
          default: return '#20a0ff';
        }
      }
    });

    const iconClass = computed(() => {
      const status = props.status;
      if (status === 'warning') {
        return 'el-icon-warning';
      }
      if (props.type === 'line') {
        return status === 'success' ? 'el-icon-circle-check' : 'el-icon-circle-close';
      } else {
        return status === 'success' ? 'el-icon-check' : 'el-icon-close';
      }
    });

    const progressTextSize = computed(() => {
      return props.type === 'line'
        ? 12 + props.strokeWidth * 0.4
        : props.width * 0.111111 + 2;
    });
    const content = computed(() => {
      const { format, percentage } = props;
      if (typeof format === 'function') {
        return format(percentage!) || '';
      } else {
        return `${percentage}%`;
      }
    });

    const relativeStrokeWidth = computed(() => Math.round(props.strokeWidth / props.width * 1000) / 10);

    const radius = computed(() => {
      const { type } = props;
      if (type === 'circle' || type === 'dashboard') {
        return Math.round(50 - relativeStrokeWidth.value / 2);
      } else {
        return 0;
      }
    });
    const trackPath = computed(() => {
      const isDashboard = props.type === 'dashboard';
      const value = radius.value;
      return `
        M 50 50
        m 0 ${isDashboard ? '' : '-'}${value}
        a ${value} ${value} 0 1 1 0 ${isDashboard ? '-' : ''}${value * 2}
        a ${value} ${value} 0 1 1 0 ${isDashboard ? '' : '-'}${value * 2}
        `;
    });
    const perimeter = computed(() => 2 * Math.PI * radius.value);
    const rate = computed(() => props.type === 'dashboard' ? 0.75 : 1);

    const strokeDashoffset = computed(() => `${-1 * perimeter.value * (1 - rate.value) / 2}px`);

    const trailPathStyle = computed(() => ({
      strokeDasharray: `${(perimeter.value * rate.value)}px, ${perimeter.value}px`,
      strokeDashoffset: strokeDashoffset.value
    }));

    const circlePathStyle = computed(() => ({
      strokeDasharray: `${perimeter.value * rate.value * (props.percentage! / 100)}px, ${perimeter.value}px`,
      strokeDashoffset: strokeDashoffset.value,
      transition: 'stroke-dasharray 0.6s ease 0s, stroke 0.6s ease'
    }));

    return {
      barStyle,
      stroke,
      iconClass,
      content,
      progressTextSize,
      relativeStrokeWidth,
      trailPathStyle,
      circlePathStyle,
      trackPath
    }
  },

  render() {
    const {
      type,
      status,
      showText,
      textInside,
      percentage,
      strokeWidth,
      strokeLinecap,
      width,
    } = this.$props;

    const {
      barStyle,
      relativeStrokeWidth,
      content,
      iconClass,
      trackPath,
      trailPathStyle,
      circlePathStyle,
      progressTextSize,
      stroke
    } = this;

    return <div
      class={[
        'el-progress',
        'el-progress--' + type,
        status ? 'is-' + status : '',
        {
          'el-progress--without-text': !showText,
          'el-progress--text-inside': textInside,
        }
      ]}
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {renderCondition(
        type === 'line',
        <div class="el-progress-bar">
          <div class="el-progress-bar__outer" style={{ height: `${strokeWidth}px` }}>
            <div class="el-progress-bar__inner" style={barStyle}>
              {renderCondition(
                showText && textInside,
                <div class="el-progress-bar__innerText">{content}</div>
              )}
            </div>
          </div>
        </div>,
        <div class="el-progress-circle" style={{ height: `${width}px`, width: `${width}px` }}>
          <svg viewBox="0 0 100 100">
            <path
              class="el-progress-circle__track"
              d={trackPath}
              stroke="#e5e9f2"
              stroke-width={relativeStrokeWidth}
              fill="none"
              style={trailPathStyle}
            ></path>
            <path
              class="el-progress-circle__path"
              d={trackPath}
              stroke={stroke}
              fill="none"
              stroke-linecap={strokeLinecap}
              stroke-width={percentage ? relativeStrokeWidth : 0}
              style={circlePathStyle}
            ></path>
          </svg>
        </div>
      )}
      {renderCondition(
        showText && !textInside,
        <div class="el-progress__text" style={{ fontSize: `${progressTextSize}px` }}>
          {renderCondition(!status, <>{content}</>, <i class={iconClass} />)}
        </div>
      )}
    </div>
  }
})