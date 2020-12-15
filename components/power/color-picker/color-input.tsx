import { computed, defineComponent, ref, toRef, watch } from 'vue';
import { watchRef } from 'vue-cdk/hook';
import { Method, Model } from 'vue-cdk/utils';
import { hsl2rgb, rgb2hsl } from './utils';

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
    }
  },
  setup(props, ctx) {

    const status = ref(0);
    const nextStatus = (index: number) => {
      const tmp = (status.value + index) % 3;
      status.value = tmp < 0 ? 3 + tmp : tmp;
    };

    const createHSLACompo = (name: 'alpha' | 'hue' | 'sat' | 'light') => {
      return watchRef(toRef(props, name), (value) => ctx.emit(`update:${name}`, value));
    };

    const alpha = createHSLACompo('alpha');
    const hue = createHSLACompo('hue');
    const sat = createHSLACompo('sat');
    const light = createHSLACompo('light');

    const rgb = watchRef(
      computed(() => hsl2rgb(hue.value, sat.value, light.value)),
      (value) => {
        const hsl = rgb2hsl(value.r, value.g, value.b);
        hue.value = hsl.h;
        sat.value = hsl.s;
        light.value = hsl.l;
      },
      true
    );


    const switchStatus = () => {
      if (status.value === 1) {
        return (
          <div class="el-color-input__XXXA">
            <div class="item">
              <input v-model={rgb.value.r} />
              <div class="text">R</div>
            </div>
            <div class="item">
              <input v-model={rgb.value.g} />
              <div class="text">G</div>
            </div>
            <div class="item">
              <input v-model={rgb.value.b} />
              <div class="text">B</div>
            </div>
            <div class="item">
              <input v-model={alpha.value} />
              <div class="text">A</div>
            </div>
          </div>
        );
      } else if (status.value === 2) {
        return (
          <div class="el-color-input__XXXA">
            <div class="item">
              <input v-model={hue.value} />
              <div class="text">H</div>
            </div>
            <div class="item">
              <input v-model={sat.value} />
              <div class="text">S</div>
            </div>
            <div class="item">
              <input v-model={light.value} />
              <div class="text">L</div>
            </div>
            <div class="item">
              <input v-model={alpha.value} />
              <div class="text">A</div>
            </div>
          </div>
        );
      } else {
        return (
          <div class="el-color-input__HEX">
            <input />
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