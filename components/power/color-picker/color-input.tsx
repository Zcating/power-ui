import { defineComponent, reactive, Ref, ref, toRef } from 'vue';
import { watchRef } from 'vue-cdk/hook';
import { Method } from 'vue-cdk/utils';
import { hexFrom, hsl2rgb, rgb2hsl } from './utils';

export const ColorInput = defineComponent({
  props: {
    hue: {
      type: Number,
      default: 0
    },
    sat: {
      type: Number,
      default: 0
    },
    light: {
      type: Number,
      default: 0
    },
    'onUpdate:hue': {
      type: Method<(event: number) => void>(),
    },
    'onUpdate:sat': {
      type: Method<(event: number) => void>(),
    },
    'onUpdate:light': {
      type: Method<(event: number) => void>(),
    },

    alpha: {
      type: Number,
      default: 100
    },
    'onUpdate:alpha': {
      type: Method<(alpha: number) => void>(),
    },

    hex: {
      type: String,
      default: '',
    },
    'onUpdate:hex': {
      type: Method<(event: string) => void>(),
    },
  },
  setup(props, ctx) {
    const status = ref(0);
    const nextStatus = (index: number) => {
      const tmp = (status.value + index) % 3;
      status.value = tmp < 0 ? 3 + tmp : tmp;
    };

    const createHSLACompo = (name: 'alpha' | 'hue' | 'sat' | 'light') => {
      return watchRef(
        toRef(props, name),
        (value) => {
          if (name !== 'alpha') {
            const tmp = hsl2rgb(hue.value, sat.value, light.value);
            rgb.r = tmp.r;
            rgb.g = tmp.g;
            rgb.b = tmp.b;
          }
          ctx.emit(`update:${name}`, value);
        }
      );
    };

    const alpha = createHSLACompo('alpha');
    const hue = createHSLACompo('hue');
    const sat = createHSLACompo('sat');
    const light = createHSLACompo('light');

    const rgb = reactive(hsl2rgb(hue.value, sat.value, light.value));


    const formatInt = (value: string, radix = 10) => {
      const num = parseInt(value, radix);
      return isNaN(num) ? null : num;
    };

    const force = (theRef: Ref<number>) => (e: any) => {
      if (!e.target.value) {
        return;
      }
      const num = formatInt(e.target.value);
      if (!num) {
        e.target.value = theRef.value;
      } else {
        theRef.value = num;
      }
    };

    const handleRGBAChange = (originColor: Ref<number>) => (e: any) => {
      const value = formatInt(e.target.value);
      if (!value) {
        e.target.value = originColor.value;
        return;
      }
      originColor.value = e.target.value;

      const hsl = rgb2hsl(rgb.r, rgb.g, rgb.b);
      hue.value = hsl.h;
      sat.value = hsl.s;
      light.value = hsl.l;
    };

    const handleHexChange = (e: any) => {
      let rgba = e.target.value as string;
      if (!!rgba.match(/\#[0-9|a-f|A-F]{8}$/)) {
      } else if (!!rgba.match(/\#[0-9|a-f|A-F]{6}$/)) {
        rgba = rgba + hexFrom(alpha.value / 100 * 255);
      } else if (!!rgba.match(/[0-9|a-f|A-F]{8}$/)) {
        rgba = `#${rgba}`;
      } else if (!!rgba.match(/[0-9|a-f|A-F]{6}$/)) {
        rgba = `#${rgba}${hexFrom(alpha.value / 100 * 255)}`;
      } else {
        rgba = props.hex;
      }
      e.target.value = rgba;
      ctx.emit('update:hex', rgba);
    };

    const switchStatus = () => {
      if (status.value === 1) {
        return (
          <div class="el-color-input__XXXA">
            <div class="item">
              <input
                value={rgb.r}
                onChange={handleRGBAChange(toRef(rgb, 'r'))}
              />
              <div class="text">R</div>
            </div>
            <div class="item">
              <input
                value={rgb.g}
                onChange={handleRGBAChange(toRef(rgb, 'g'))}
              />
              <div class="text">G</div>
            </div>
            <div class="item">
              <input
                value={rgb.b}
                onChange={handleRGBAChange(toRef(rgb, 'b'))}
              />
              <div class="text">B</div>
            </div>
            <div class="item">
              <input
                value={alpha.value}
                onChange={force(alpha)}
              />
              <div class="text">A</div>
            </div>
          </div>
        );
      } else if (status.value === 2) {
        return (
          <div class="el-color-input__XXXA">
            <div class="item">
              <input
                value={hue.value}
                onChange={force(hue)}
              />
              <div class="text">H</div>
            </div>
            <div class="item">
              <input
                value={sat.value}
                onChange={force(sat)}
              />
              <div class="text">S</div>
            </div>
            <div class="item">
              <input
                value={light.value}
                onChange={force(light)}
              />
              <div class="text">L</div>
            </div>
            <div class="item">
              <input
                value={alpha.value}
                onChange={force(alpha)}
              />
              <div class="text">A</div>
            </div>
          </div>
        );
      } else {
        return (
          <div class="el-color-input__HEX">
            <input
              value={props.hex}
              onChange={handleHexChange}
            />
            <div class="text">HEX</div>
          </div>
        );
      }
    };

    return () => (
      <div class="el-color-input">
        <div class="el-color-input__main">
          {switchStatus()}
        </div>
        <div class="el-color-input__switch">
          <div
            class="item"
            onClick={() => nextStatus(-1)}
          >
            <i class="el-icon-arrow-up" />
          </div>
          <div
            class="item"
            onClick={() => nextStatus(1)}>
            <i class="el-icon-arrow-down" />
          </div>
        </div>
      </div>
    );
  }
});